/**
 * User Repository
 * Handles all database operations for the users table
 * Follows the Repository pattern with consistent error handling
 */

import { eq, desc } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { users, type UserType, type NewUserType } from '@/db/schema';
import type { RepositoryResultType } from '@/types/repository.types';

class UserRepository {
    private get db() {
        return getDb();
    }

    /**
     * CREATE: Insert new user
     */
    async create(params: { data: NewUserType }): Promise<RepositoryResultType<UserType>> {
        try {
            const [user] = await this.db.insert(users).values(params.data).returning();

            if (!user) {
                return {
                    success: false,
                    error: new Error('User creation failed - no record returned'),
                };
            }

            return { success: true, data: user };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error : new Error('Unknown error'),
            };
        }
    }

    /**
     * READ: Find user by ID
     */
    async findById(params: { id: string }): Promise<RepositoryResultType<UserType | null>> {
        try {
            const [user] = await this.db.select().from(users).where(eq(users.id, params.id)).limit(1);

            return { success: true, data: user ?? null };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error : new Error('Unknown error'),
            };
        }
    }

    /**
     * READ: Find user by email
     */
    async findByEmail(params: { email: string }): Promise<RepositoryResultType<UserType | null>> {
        try {
            const [user] = await this.db.select().from(users).where(eq(users.email, params.email)).limit(1);

            return { success: true, data: user ?? null };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error : new Error('Unknown error'),
            };
        }
    }

    /**
     * READ: List all users (ordered by creation date)
     */
    async findAll(): Promise<RepositoryResultType<UserType[]>> {
        try {
            const allUsers = await this.db.select().from(users).orderBy(desc(users.createdAt));

            return { success: true, data: allUsers };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error : new Error('Unknown error'),
            };
        }
    }

    /**
     * UPDATE: Update user fields
     */
    async update(params: { id: string; data: Partial<NewUserType> }): Promise<RepositoryResultType<UserType>> {
        try {
            const [user] = await this.db
                .update(users)
                .set({
                    ...params.data,
                    updatedAt: new Date(),
                })
                .where(eq(users.id, params.id))
                .returning();

            if (!user) {
                return {
                    success: false,
                    error: new Error('User not found or update failed'),
                };
            }

            return { success: true, data: user };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error : new Error('Unknown error'),
            };
        }
    }

    /**
     * DELETE: Remove user
     */
    async delete(params: { id: string }): Promise<RepositoryResultType<void>> {
        try {
            await this.db.delete(users).where(eq(users.id, params.id));

            return { success: true, data: undefined };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error : new Error('Unknown error'),
            };
        }
    }
}

// Singleton export
export const userRepository = new UserRepository();
