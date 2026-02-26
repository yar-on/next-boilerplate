/**
 * Repository Result Types
 * Provides a consistent success/error pattern for all repository operations
 */

export type RepositorySuccessType<T> = {
    success: true;
    data: T;
};

export type RepositoryErrorType = {
    success: false;
    error: Error;
};

export type RepositoryResultType<T> = RepositorySuccessType<T> | RepositoryErrorType;
