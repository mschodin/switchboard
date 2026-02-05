import { UserRole } from './database'
import { User, Session } from '@supabase/supabase-js'

export interface AuthState {
  user: User | null
  session: Session | null
  role: UserRole | null
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
}

export interface AuthContextValue extends AuthState {
  // Add any auth methods if needed in the future
}
