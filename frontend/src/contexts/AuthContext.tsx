'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import type { UserProfile, LoginData, RegisterData } from '@/types/api';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<{ success: boolean; message: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  const logout = useCallback(async () => {
    try {
      const rt = localStorage.getItem('refreshToken');
      if (rt) await apiClient.auth.logout({ refreshToken: rt });
    } catch {
      // ignore logout errors
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      // Xóa cookie
      document.cookie = 'accessToken=; path=/; max-age=0';
      setUser(null);
    }
  }, []);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const rt = localStorage.getItem('refreshToken');
      if (!rt) return false;

      const res = await apiClient.auth.refreshToken({ refreshToken: rt });
      const inner = res.data?.data;

      if (res.statusCode === 200 && inner?.accessToken) {
        localStorage.setItem('accessToken', inner.accessToken);
        localStorage.setItem('refreshToken', inner.refreshToken);
        
        // Cập nhật cookie để Middleware nhận diện được token mới
        const maxAge = inner.expiresIn || 3600;
        document.cookie = `accessToken=${inner.accessToken}; path=/; max-age=${maxAge}; SameSite=Lax`;
        
        return true;
      }
      return false;
    } catch {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      document.cookie = 'accessToken=; path=/; max-age=0';
      setUser(null);
      return false;
    }
  }, []);

  // Khôi phục user từ localStorage và kiểm tra session khi app khởi động
  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          
          try {
            const res = await apiClient.auth.getMe();
            // getMe trả về JwtPayload trong data.data
            if (res.statusCode === 200 && res.data?.data) {
              const payload = res.data.data;
              // Chuyển JwtPayload thành UserProfile (tối thiểu)
              const freshUser: UserProfile = {
                ...parsedUser,
                id: payload.sub,
                email: payload.email,
                role: payload.role,
                permissions: payload.permissions || [],
              };
              setUser(freshUser);
              localStorage.setItem('user', JSON.stringify(freshUser));
            } else {
              throw new Error('Session expired');
            }
          } catch (verifyErr) {
            console.warn('Auth verification failed, trying refresh...', verifyErr);
            const refreshed = await refreshToken();
            if (!refreshed) {
              logout();
            }
          }
        } else {
          setUser(null);
        }
      } catch (e) {
        console.error('Auth initialization error:', e);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [refreshToken, logout]);

  const login = async (data: LoginData) => {
    setIsLoading(true);
    try {
      const res = await apiClient.auth.login(data);
      const inner = res.data?.data;

      if (res.statusCode === 200 && inner?.accessToken) {
        localStorage.setItem('accessToken', inner.accessToken);
        localStorage.setItem('refreshToken', inner.refreshToken);
        localStorage.setItem('user', JSON.stringify(inner.user));
        
        const maxAge = inner.expiresIn || 3600;
        document.cookie = `accessToken=${inner.accessToken}; path=/; max-age=${maxAge}; SameSite=Lax`;
        
        setUser(inner.user);
        return { success: true, message: res.data?.message || 'Đăng nhập thành công' };
      }

      return { success: false, message: res.message || 'Đăng nhập thất bại' };
    } catch (err: any) {
      const msg =
        err.statusCode === 401 ? 'Email hoặc mật khẩu không đúng' :
        err.statusCode === 403 ? 'Tài khoản tạm thời bị khóa. Vui lòng thử lại sau' :
        err.message || 'Lỗi kết nối. Vui lòng thử lại.';
      return { success: false, message: msg };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const res = await apiClient.auth.register(data);
      if (res.statusCode === 201) {
        return { success: true, message: res.data?.message || 'Đăng ký thành công' };
      }
      return { success: false, message: res.message || 'Đăng ký thất bại' };
    } catch (err: any) {
      const msg =
        err.statusCode === 409 ? 'Email đã được sử dụng' :
        err.message || 'Lỗi kết nối. Vui lòng thử lại.';
      return { success: false, message: msg };
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, login, register, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
