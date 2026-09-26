export const STORAGE_KEYS = {
  session: 'joineazy.session',
  assignments: 'joineazy.assignments',
  submissions: 'joineazy.submissions',
};

export function readStorage(key, fallback = null) {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.warn(`Could not read "${key}" from localStorage.`, error);
    return fallback;
  }
}

export function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Could not write "${key}" to localStorage.`, error);
  }
}

export function removeStorage(key) {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Could not remove "${key}" from localStorage.`, error);
  }
}