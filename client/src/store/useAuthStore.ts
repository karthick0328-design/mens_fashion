import { create } from 'zustand';
import { IUser } from '../types';

interface AuthState {
  token: string | null;
  user: IUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  setAuth: (user: IUser, token: string) => void;
  setUser: (user: IUser) => void;
  logout: () => void;
}

const getStoredToken = () => localStorage.getItem('aurelius_token');
const getStoredUser = (): IUser | null => {
  try {
    const raw = localStorage.getItem('aurelius_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => {
  const initialToken = getStoredToken();
  const initialUser = getStoredUser();

  const checkIsAdmin = (role?: string) =>
    Boolean(role && ['ADMIN', 'SUPER_ADMIN', 'MANAGER', 'STAFF'].includes(role));

  return {
    token: initialToken,
    user: initialUser,
    isAuthenticated: Boolean(initialToken && initialUser),
    isAdmin: checkIsAdmin(initialUser?.role),

    setAuth: (user, token) => {
      localStorage.setItem('aurelius_token', token);
      localStorage.setItem('aurelius_user', JSON.stringify(user));
      set({
        token,
        user,
        isAuthenticated: true,
        isAdmin: checkIsAdmin(user.role),
      });
    },

    setUser: (user) => {
      localStorage.setItem('aurelius_user', JSON.stringify(user));
      set({
        user,
        isAdmin: checkIsAdmin(user.role),
      });
    },

    logout: () => {
      localStorage.removeItem('aurelius_token');
      localStorage.removeItem('aurelius_user');
      set({
        token: null,
        user: null,
        isAuthenticated: false,
        isAdmin: false,
      });
    },
  };
});
