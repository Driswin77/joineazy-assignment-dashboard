import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { accounts } from '../data/mockData';
import { STORAGE_KEYS, readStorage, removeStorage, writeStorage } from '../utils/storage';

const AuthContext = createContext(null);

const REGISTERED_KEY = 'joineazy.registeredUsers';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStorage(STORAGE_KEYS.session, null));
  const [registeredUsers, setRegisteredUsers] = useState(() =>
    readStorage(REGISTERED_KEY, [])
  );

  const allAccounts = useMemo(
    () => [...accounts, ...registeredUsers],
    [registeredUsers]
  );

  const login = useCallback(
    (email, password) => {
      const match = allAccounts.find(
        (account) =>
          account.email.toLowerCase() === email.trim().toLowerCase() &&
          account.password === password
      );

      if (!match) {
        return {
          ok: false,
          error: 'Incorrect email or password. Try one of the demo accounts below.',
        };
      }

      const { password: _password, ...sessionUser } = match;
      setUser(sessionUser);
      writeStorage(STORAGE_KEYS.session, sessionUser);

      return { ok: true, user: sessionUser };
    },
    [allAccounts]
  );

  const register = useCallback(
    ({ name, email, password, role }) => {
      const normalizedEmail = email.trim().toLowerCase();

      const exists = allAccounts.some(
        (account) => account.email.toLowerCase() === normalizedEmail
      );

      if (exists) {
        return { ok: false, error: 'An account with this email already exists.' };
      }

      const id = `${role === 'admin' ? 'admin' : 'u'}-${Date.now()}`;

      const newUser = {
        id,
        name: name.trim(),
        email: normalizedEmail,
        password,
        role,
        ...(role === 'student'
          ? {
              course: 'B.Tech Computer Science',
              year: '3rd year',
              rollNo: 'NEW',
              enrolledCourses: [],
            }
          : {
              title: 'Professor',
              department: 'Computer Science',
            }),
      };

      const next = [...registeredUsers, newUser];
      setRegisteredUsers(next);
      writeStorage(REGISTERED_KEY, next);

      return { ok: true, user: newUser };
    },
    [allAccounts, registeredUsers]
  );

  const logout = useCallback(() => {
    setUser(null);
    removeStorage(STORAGE_KEYS.session);
  }, []);

  const value = useMemo(
    () => ({ user, login, logout, register }),
    [user, login, logout, register]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }

  return context;
}