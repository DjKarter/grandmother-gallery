import { z } from 'zod';

export const normalizePhone = (value: string) => value.replace(/[^0-9]/g, '');

export const makeOrderSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().trim().min(2, t('errors.nameMin')),
    phone: z.string().regex(/^[0-9]{10,15}$/, t('errors.phoneFormat')),
    email: z.string().trim().email(t('errors.emailFormat')).or(z.literal('')),
    message: z.string(),
  });
