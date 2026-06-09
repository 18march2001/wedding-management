export type UserRole = 'admin' | 'editor' | 'viewer';

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  avatar_url?: string;
  role: UserRole;
  is_active: boolean;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  is_active?: boolean;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  role?: UserRole;
  is_active?: boolean;
}

export interface UserPermission {
  id: string;
  name: string;
  description?: string;
  category: string;
}

export interface RolePermissions {
  role: UserRole;
  permissions: UserPermission[];
}

export interface UserFilter {
  search?: string;
  role?: UserRole;
  is_active?: boolean;
  sort?: 'name' | 'email' | 'created_at';
  order?: 'asc' | 'desc';
}
