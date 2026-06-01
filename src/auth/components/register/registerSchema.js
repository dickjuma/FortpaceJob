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
      fullName: z.string().trim().min(2, 'Full name is required'),
      businessName: z.string().trim().optional().default(''),
      email: z.string().trim().email('Enter a valid email address'),
      phoneNumber: z.string().trim().min(7, 'Enter a valid phone number'),
      country: z.string().trim().min(2, 'Select a country'),
      password: passwordSchema,
      confirmPassword: z.string().trim().min(1, 'Confirm your password'),
      companySize: z.string().trim().optional().default(''),
      industry: z.string().trim().optional().default(''),
      teamSize: z.string().trim().optional().default(''),
      primarySkillCategory: z.string().trim().optional().default(''),
      experienceLevel: z.string().trim().optional().default(''),
      hiringNeeds: z.string().trim().optional().default(''),
      antiSpamWebsite: z.string().trim().optional().default(''),
    })
    .superRefine((values, ctx) => {
      if (values.confirmPassword !== values.password) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['confirmPassword'],
          message: 'Passwords do not match',
        });
      }

      if (values.antiSpamWebsite) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['antiSpamWebsite'],
          message: 'Spam submission detected',
        });
      }

      if (accountType === 'SME' || accountType === 'CORPORATE') {
        if (!values.businessName.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['businessName'],
            message: 'Business name is required for business accounts',
          });
        }
      }
    });
}
