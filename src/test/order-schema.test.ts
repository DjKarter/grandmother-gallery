import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Та же схема что в order-page.tsx, но с фиксированными сообщениями
const orderSchema = z.object({
  name: z.string().min(2, 'Введите имя (минимум 2 символа)'),
  phone: z
    .string()
    .min(10, 'Введите корректный номер телефона')
    .regex(/^[\d\s\+\-\(\)]+$/, 'Только цифры, +, -, пробелы и скобки'),
  email: z.union([z.literal(''), z.string().email('Введите корректный email')]),
  message: z.string(),
});

describe('orderSchema — name', () => {
  it('принимает имя длиной >= 2', () => {
    expect(orderSchema.shape.name.safeParse('Ан').success).toBe(true);
    expect(orderSchema.shape.name.safeParse('Анна').success).toBe(true);
  });

  it('отклоняет имя короче 2 символов', () => {
    const result = orderSchema.shape.name.safeParse('А');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Введите имя (минимум 2 символа)');
    }
  });

  it('отклоняет пустое имя', () => {
    expect(orderSchema.shape.name.safeParse('').success).toBe(false);
  });
});

describe('orderSchema — phone', () => {
  it('принимает корректный номер', () => {
    expect(orderSchema.shape.phone.safeParse('+7 (999) 000-00-00').success).toBe(true);
    expect(orderSchema.shape.phone.safeParse('89991234567').success).toBe(true);
  });

  it('отклоняет номер с буквами', () => {
    const result = orderSchema.shape.phone.safeParse('+7 999 abc 00 00');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Только цифры, +, -, пробелы и скобки');
    }
  });

  it('отклоняет слишком короткий номер', () => {
    expect(orderSchema.shape.phone.safeParse('123').success).toBe(false);
  });
});

describe('orderSchema — email', () => {
  it('принимает пустой email (необязательное поле)', () => {
    expect(orderSchema.shape.email.safeParse('').success).toBe(true);
  });

  it('принимает корректный email', () => {
    expect(orderSchema.shape.email.safeParse('test@example.com').success).toBe(true);
  });

  it('отклоняет некорректный email', () => {
    const result = orderSchema.shape.email.safeParse('not-an-email');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Введите корректный email');
    }
  });
});

describe('orderSchema — полная форма', () => {
  it('принимает корректные данные', () => {
    const result = orderSchema.safeParse({
      name: 'Анна',
      phone: '+7 (999) 123-45-67',
      email: 'anna@example.com',
      message: 'Хочу заказать картину',
    });
    expect(result.success).toBe(true);
  });

  it('возвращает ошибки для нескольких полей сразу', () => {
    const result = orderSchema.safeParse({
      name: 'А',
      phone: '123',
      email: 'bad-email',
      message: '',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const fields = result.error.issues.map((i) => i.path[0]);
      expect(fields).toContain('name');
      expect(fields).toContain('phone');
      expect(fields).toContain('email');
    }
  });
});
