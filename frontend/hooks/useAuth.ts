import { useState, useEffect } from 'react';
import { User } from '../types';
import { verifyToken, logout as logoutApi } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authView, setAuthView] = useState<'login' | 'register' | null>('login');

  // 🔁 새로고침 시 자동 로그인
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const checkAuth = async () => {
      try {
        const response = await verifyToken(token);
        if (response.success && response.data) {
          setUser({
            user_no: response.data.user_no,
            role_no: response.data.role_no,
            email: response.data.email ?? '',
            nickname: response.data.nickname,
            profile_url: response.data.profile_url ?? null,
            created_at: response.data.created_at,
          });
          setAuthView(null);
        } else {
          handleLogout();
        }
      } catch {
        handleLogout();
      }
    };

    checkAuth();
  }, []);

  // ✅ 로그인 성공 시 (Login.tsx에서 호출)
  const handleLoginSuccess = (
    user: User,
    token: string
  ) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user_no', String(user.user_no));
    localStorage.setItem('nickname', user.nickname);

    setUser(user);
    setAuthView(null);
  };

  const handleLogout = () => {
    logoutApi();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user_no');
    localStorage.removeItem('nickname');
    setUser(null);
    setAuthView('login');
  };

  return {
    user,
    authView,
    setAuthView,
    handleLoginSuccess,
    handleLogout,
  };
};
