/**
 * Global TypeScript type definitions
 * Add shared types, interfaces, and type utilities here
 */

// Example: API Response types
export interface ApiResponse<T = unknown> {
    data: T;
    error?: string;
    message?: string;
}

// Database types (imported from schema)
export type { UserType, NewUserType } from '@/db/schema';
export type { RepositoryResultType, RepositorySuccessType, RepositoryErrorType } from './repository.types';

// Example: Utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
