'use client';

import React, { createContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { AuthContextType, User } from '@/types/auth';
import { STORAGE_KEYS, ROUTES } from '@/lib/constants';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user;

  // Clear auth data
  const clearAuth = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }, []);

  // Save auth data
  const saveAuth = useCallback((userData: User, accessToken: string, refreshToken?: string) => {
    setUser(userData);
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    if (refreshToken) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }
  }, []);

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await apiClient.auth.login({ email, password });
      
      if (response.statusCode === 200) {
        const userData = (response.data as any)?.user || (response.data as any)?.data?.user;
        const accessToken = (response.data as any)?.accessToken || (response.data as any)?.data?.accessToken;
        const refreshToken = (response.data as any)?.refreshToken || (response.data as any)?.data?.refreshToken;
        
        if (userData && accessToken) {
          saveAuth(userData, accessToken, refreshToken);
          
          // Redirect based on role
          if (userData.role === 'admin') {
            router.push(ROUTES.ADMIN.DASHBOARD);
          } else {
            router.push(ROUTES.STUDENT.DASHBOARD);
          }
        } else {
          throw new Error('Invalid login response data');
        }
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      clearAuth();
      throw error;
    }
  }, [router, saveAuth, clearAuth]);

  // Register function
  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      const response = await apiClient.auth.register({ name, email, password });
      
      if (response.statusCode === 200) {
        // Auto login after successful registration
        await login(email, password);
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      throw error;
    }
  }, [login]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      if (refreshToken) {
        await apiClient.auth.logout({ refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuth();
      router.push(ROUTES.HOME);
    }
  }, [router, clearAuth]);

  // Refresh token function
  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const refreshTokenValue = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      if (!refreshTokenValue) {
        return false;
      }

      const response = await apiClient.auth.refreshToken({ refreshToken: refreshTokenValue });
      
      if (response.statusCode === 200 && response.data) {
        const userData = response.data.user;
        const accessToken = response.data.accessToken;
        const newRefreshToken = response.data.refreshToken;
        
        if (userData && accessToken) {
          saveAuth(userData, accessToken, newRefreshToken);
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      clearAuth();
      return false;
    }
  }, [saveAuth, clearAuth]);

  // Check authentication on app start
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        const userData = localStorage.getItem(STORAGE_KEYS.USER);
        
        if (token && userData) {
          try {
            const user = JSON.parse(userData);
            
            // Verify token is still valid
            const response = await apiClient.auth.getProfile();
            if (response.statusCode === 200) {
              setUser(response.data);
            } else {
              // Try to refresh token
              const refreshed = await refreshToken();
              if (!refreshed) {
                clearAuth();
              }
            }
          } catch (error) {
            // Try to refresh token
            const refreshed = await refreshToken();
            if (!refreshed) {
              clearAuth();
            }
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [refreshToken, clearAuth]);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}