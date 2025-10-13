export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  display_name: string;
  phone_number?: string;
  date_of_birth?: string;
  avatar?: string;
  bio?: string;
  is_verified: boolean;
  email_verified: boolean;
  phone_verified: boolean;
  is_public_profile: boolean;
  allow_notifications: boolean;
  date_joined: string;
  profile: UserProfile;
}

export interface UserProfile {
  company?: string;
  job_title?: string;
  website?: string;
  linkedin_url?: string;
  github_url?: string;
  twitter_url?: string;
  preferred_currency: string;
  risk_tolerance: 'conservative' | 'moderate' | 'aggressive';
  email_notifications: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
  client_id: string;
  client_secret: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  user: User;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
  new_password_confirm: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  changePassword: (data: ChangePasswordRequest) => Promise<void>;
}