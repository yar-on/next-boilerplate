/**
 * User Validation Schemas
 * Zod schemas for validating user input data
 */

import { z } from 'zod';

export const CreateUserValidation = z.object({
    email: z.string().email('Invalid email format').max(255),
    name: z.string().min(1, 'Name is required').max(255),
    isActive: z.boolean().optional().default(true),
});

export const UpdateUserValidation = z.object({
    email: z.string().email('Invalid email format').max(255).optional(),
    name: z.string().min(1, 'Name is required').max(255).optional(),
    isActive: z.boolean().optional(),
});

export type CreateUserInputType = z.infer<typeof CreateUserValidation>;
export type UpdateUserInputType = z.infer<typeof UpdateUserValidation>;
