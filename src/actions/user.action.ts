/**
 * User Server Actions
 * Server-side actions for user management
 * All database operations go through the repository pattern
 */

'use server';

import { revalidatePath } from 'next/cache';
import { userRepository } from '@/repositories/user.repository';
import { CreateUserValidation, UpdateUserValidation } from '@/validations/user.validations';
import type { RepositoryResultType } from '@/types/repository.types';
import type { UserType } from '@/db/schema';

/**
 * Create a new user
 */
export async function createUser(formData: FormData): Promise<RepositoryResultType<UserType>> {
    // Parse and validate input
    const parse = CreateUserValidation.safeParse({
        email: formData.get('email'),
        name: formData.get('name'),
    });

    if (!parse.success) {
        return {
            success: false,
            error: new Error(parse.error.issues[0]?.message || 'Validation failed'),
        };
    }

    // Check for existing user
    const existingUser = await userRepository.findByEmail({ email: parse.data.email });
    if (existingUser.success && existingUser.data) {
        return {
            success: false,
            error: new Error('User with this email already exists'),
        };
    }

    // Create user
    const result = await userRepository.create({ data: parse.data });

    // Revalidate cache on success
    if (result.success) {
        revalidatePath('/users');
    }

    return result;
}

/**
 * Update an existing user
 */
export async function updateUser(params: { id: string; data: Record<string, unknown> }): Promise<RepositoryResultType<UserType>> {
    // Validate input
    const parse = UpdateUserValidation.safeParse(params.data);

    if (!parse.success) {
        return {
            success: false,
            error: new Error(parse.error.issues[0]?.message || 'Validation failed'),
        };
    }

    // Update user
    const result = await userRepository.update({
        id: params.id,
        data: parse.data as Record<string, string | boolean>,
    });

    // Revalidate on success
    if (result.success) {
        revalidatePath('/users');
        revalidatePath(`/users/${params.id}`);
    }

    return result;
}

/**
 * Get a single user by ID
 */
export async function getUser(id: string): Promise<RepositoryResultType<UserType | null>> {
    return await userRepository.findById({ id });
}

/**
 * Get all users
 */
export async function getAllUsers(): Promise<RepositoryResultType<UserType[]>> {
    return await userRepository.findAll();
}

/**
 * Delete a user
 */
export async function deleteUser(id: string): Promise<RepositoryResultType<void>> {
    const result = await userRepository.delete({ id });

    // Revalidate on success
    if (result.success) {
        revalidatePath('/users');
    }

    return result;
}
