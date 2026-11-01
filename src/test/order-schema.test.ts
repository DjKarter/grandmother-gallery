import { describe, it, expect } from 'vitest';
import { makeOrderSchema, normalizePhone } from '../utils/order-schema';
import { ru } from '../i18n/locales/ru';

const orderSchema = makeOrderSchema((key) => ru.errors[key.split('.')[1] as keyof typeof ru.errors]);

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
    expect(orderSchema.shape.phone.safeParse('79990000000').success).toBe(true);
    expect(orderSchema.shape.phone.safeParse('89991234567').success).toBe(true);
  });

  it('отклоняет номер с буквами', () => {
    const result = orderSchema.shape.phone.safeParse('+7 999 abc 00 00');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(ru.errors.phoneFormat);
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
      phone: '79991234567',
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

describe('Нормализация и граничные значения', () => {
  it('оставляет цифры при вставке форматированного телефона', () => {
    expect(normalizePhone('+7 (999) 123-45-67 доб. abc')).toBe('79991234567');
    expect(normalizePhone('буквы +()-')).toBe('');
  });

  it('принимает 10–15 цифр, отклоняет 16 цифр и знаки без номера', () => {
    for (const value of ['1234567890', '123456789012345']) {
      expect(orderSchema.shape.phone.safeParse(value).success).toBe(true);
    }
    for (const value of ['1234567890123456', '() --     ', '123456789', '']) {
      expect(orderSchema.shape.phone.safeParse(value).success).toBe(false);
    }
  });

  it('убирает пробелы вокруг имени и email и отклоняет пустое имя', () => {
    expect(orderSchema.shape.name.parse('  Анна  ')).toBe('Анна');
    expect(orderSchema.shape.name.safeParse('   ').success).toBe(false);
    expect(orderSchema.shape.email.parse(' anna@example.com ')).toBe('anna@example.com');
  });
});
