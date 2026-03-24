// Re-export từ api-client để backward compatibility
export { apiClient as api, apiClient } from '@/lib/api-client';
export type { LoginData, RegisterData, RefreshTokenData, UserProfile, ApiResponse } from '@/types/api';
