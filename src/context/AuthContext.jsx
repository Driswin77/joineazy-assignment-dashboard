import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { accounts } from '../data/mockData';
import { STORAGE_KEYS, readStorage, removeStorage, writeStorage } from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStorage(STORAGE_KEYS.session, null));

  const login = useCallback((email, password) => {
    const match = accounts.find(
      (account) =>
        account.email.toLowerCase() === email.trim().toLowerCase() && account.password === password
    );

    if (!match) {
      return { ok: false, error: 'Incorrect email or password. Try one of the demo accounts below.' };
    }

    const { password: _password, ...sessionUser } = match;
    setUser(sessionUser);
    writeStorage(STORAGE_KEYS.session, sessionUser);

    return { ok: true, user: sessionUser };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    removeStorage(STORAGE_KEYS.session);
  }, []);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }

  return context;
}