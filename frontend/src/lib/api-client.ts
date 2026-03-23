// Centralized API client with error handling and interceptors
import { ApiResponse, AuthResponse, LoginData, RegisterData, RefreshTokenData, UserProfile } from '@/types/api';

class ApiClient {
  private baseURL: string;
  private healthURL: string;

  constructor() {
    this.baseURL = process.env.NODE_ENV === 'production' 
      ? '/api/proxy/api/v1'
      : process.env.NEXT_PUBLIC_API_BASE_URL || 'http://144.91.104.237:3001/api/v1';
    
    this.healthURL = process.env.NODE_ENV === 'production'
      ? '/api/proxy/health'
      : 'http://144.91.104.237:3001/health';
  }

  // Helper method to get auth headers
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  // Generic request method with error handling
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;
      
      const response = await fetch(url, {
        headers: this.getAuthHeaders(),
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          statusCode: response.status,
          message: data.message || 'Request failed',
          ...data
        };
      }

      return data;
    } catch (error: any) {
      // Handle network errors
      if (!error.statusCode) {
        throw {
          statusCode: 500,
          message: 'Network error occurred',
          error: error.message
        };
      }
      throw error;
    }
  }

  // Health endpoints
  async health() {
    const response = await fetch(this.healthURL);
    return response.json();
  }

  async healthDetailed() {
    const detailedUrl = process.env.NODE_ENV === 'production' 
      ? '/api/proxy/' 
      : 'http://144.91.104.237:3001/';
    const response = await fetch(detailedUrl);
    return response.json();
  }

  // Auth endpoints
  auth = {
    register: (data: RegisterData): Promise<ApiResponse> => 
      this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data)
      }),

    login: (data: LoginData): Promise<ApiResponse<AuthResponse>> => 
      this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data)
      }),

    refreshToken: (data: RefreshTokenData): Promise<ApiResponse> => 
      this.request('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify(data)
      }),

    logout: (data: RefreshTokenData): Promise<ApiResponse> => 
      this.request('/auth/logout', {
        method: 'POST',
        body: JSON.stringify(data)
      }),

    getProfile: (): Promise<ApiResponse<UserProfile>> => 
      this.request('/auth/me', { method: 'GET' })
  };

  // Media endpoints
  media = {
    getPresignedUploadUrl: (data: { fileName: string; fileType: string }) => 
      this.request('/media/upload', {
        method: 'POST',
        body: JSON.stringify(data)
      }),

    getPresignedGetUrl: (data: { fileName: string }) => 
      this.request('/media/presign-get', {
        method: 'POST',
        body: JSON.stringify(data)
      })
  };
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export for backward compatibility
export const api = apiClient;