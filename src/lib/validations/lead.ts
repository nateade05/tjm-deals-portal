import { z } from 'zod';

export const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(6, 'Phone must be at least 6 characters'),
  email: z.string().email('Invalid email'),
  country: z.string().min(2, 'Country must be at least 2 characters'),
  company: z.string().optional(),
  website: z.optional(z.union([z.string().url('Invalid URL'), z.literal('')])),
});
