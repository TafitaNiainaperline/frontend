import Cookies from 'js-cookie';
import api from './api';

export interface User {
  id: string;
  email: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  role: 'student' | 'instructor' | 'admin';
  avatar_url?: string;
}

export const getToken = () => Cookies.get('token');

export const setToken = (token: string) => {
  Cookies.set('token', token, { expires: 7, sameSite: 'lax' });
};

export const removeToken = () => Cookies.remove('token');

export const getMe = async (): Promise<User | null> => {
  try {
    const res = await api.get('/auth/me');
    return res.data;
  } catch {
    return null;
  }
};
