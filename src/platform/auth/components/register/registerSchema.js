import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .refine((value) => /[A-Z]/.test(value), 'Include at least one uppercase letter')
  .refine((value) => /\d/.test(value), 'Include at least one number')
  .refine((value) => /[^A-Za-z0-9]/.test(value), 'Include at least one special character');

export function buildRegisterSchema(role, accountType) {
  return z
    .object({
      email: z.string().trim().email('Enter a valid email address'),
      password: passwordSchema,
      antiSpamWebsite: z.string().trim().optional().default(''),
    })
    .superRefine((values, ctx) => {
      if (values.antiSpamWebsite) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['antiSpamWebsite'],
          message: 'Spam submission detected',
        });
      }
    });
}
