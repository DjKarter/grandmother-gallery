import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import './order-page.css';

const FORMSPREE_ID = 'xvzjkdwj';

const makeOrderSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(2, t('errors.nameMin')),
    phone: z
      .string()
      .min(10, t('errors.phoneMin'))
      .regex(/^[\d\s\+\-\(\)]+$/, t('errors.phoneFormat')),
    email: z.union([z.literal(''), z.string().email(t('errors.emailFormat'))]),
    message: z.string(),
  });

type OrderFormData = { name: string; phone: string; email: string; message: string };
type FormErrors = Partial<Record<keyof OrderFormData, string>>;

export const OrderPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const orderSchema = makeOrderSchema(t);

  const [formData, setFormData] = useState<OrderFormData>({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      const fieldSchema = orderSchema.shape[name as keyof OrderFormData];
      const result = fieldSchema.safeParse(value);
      setErrors((prev) => ({
        ...prev,
        [name]: result.success ? undefined : result.error.message,
      }));
    },
    [orderSchema],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const result = orderSchema.safeParse(formData);
      if (!result.success) {
        const fieldErrors: FormErrors = {};
        for (const issue of result.error.issues) {
          const field = issue.path[0] as keyof OrderFormData;
          fieldErrors[field] = issue.message;
        }
        setErrors(fieldErrors);
        return;
      }

      setIsSubmitting(true);
      setSubmitError('');

      try {
        const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            Имя: formData.name,
            Телефон: formData.phone,
            Email: formData.email,
            Сообщение: formData.message,
            _subject: 'Заказ картины',
            _replyto: formData.email,
          }),
        });

        if (res.ok) {
          setIsSubmitted(true);
        } else {
          const data = await res.json().catch(() => ({}));
          setSubmitError((data as { error?: string }).error ?? t('errors.submitFail'));
        }
      } catch {
        setSubmitError(t('errors.connection'));
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, orderSchema, t],
  );

  if (isSubmitted) {
    return (
      <div className="order-page">
        <div className="order-content success-state">
          <div className="success-icon">✓</div>
          <h2>{t('order.successTitle')}</h2>
          <p>{t('order.successText')}</p>
          <button className="order-btn order-btn-secondary" onClick={() => navigate('/')}>
            {t('order.backToGallery')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-page">
      <div className="order-content">
        <h1>{t('order.title')}</h1>

        <form className="order-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="name">
              {t('order.name')} {t('order.required')}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder={t('order.namePlaceholder')}
              disabled={isSubmitting}
              aria-invalid={!!errors.name}
            />
            {errors.name && <p className="field-error">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">
              {t('order.phone')} {t('order.required')}
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder={t('order.phonePlaceholder')}
              disabled={isSubmitting}
              aria-invalid={!!errors.phone}
            />
            {errors.phone && <p className="field-error">{errors.phone}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="email">{t('order.email')}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={t('order.emailPlaceholder')}
              disabled={isSubmitting}
              aria-invalid={!!errors.email}
            />
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="message">{t('order.message')}</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder={t('order.messagePlaceholder')}
              rows={4}
              disabled={isSubmitting}
            />
          </div>

          {submitError && <p className="order-error">{submitError}</p>}

          <button
            type="submit"
            className={`order-btn ${isSubmitting ? 'order-btn--loading' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? t('order.submitting') : t('order.submit')}
          </button>
        </form>
      </div>
    </div>
  );
};
