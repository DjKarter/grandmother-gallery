import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { makeOrderSchema, normalizePhone } from '../utils/order-schema';
import './order-page.css';

const FORMSPREE_ID = 'xvzjkdwj';

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
      const { name } = e.target;
      const value = name === 'phone' ? normalizePhone(e.target.value) : e.target.value;
      setFormData((prev) => ({ ...prev, [name]: value }));

      const fieldSchema = orderSchema.shape[name as keyof OrderFormData];
      const result = fieldSchema.safeParse(value);
      setErrors((prev) => ({
        ...prev,
        [name]: result.success ? undefined : result.error.issues[0]?.message,
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
          fieldErrors[field] ??= issue.message;
        }
        setErrors(fieldErrors);
        e.currentTarget.querySelector<HTMLElement>(`[name="${Object.keys(fieldErrors)[0]}"]`)?.focus();
        return;
      }

      setIsSubmitting(true);
      setSubmitError('');

      try {
        const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            Имя: result.data.name,
            Телефон: result.data.phone,
            Email: result.data.email,
            Сообщение: result.data.message,
            _subject: 'Заказ картины',
            _replyto: result.data.email,
          }),
        });

        if (res.ok) {
          setIsSubmitted(true);
        } else {
          setSubmitError(t('errors.submitFail'));
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
              autoComplete="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              placeholder={t('order.namePlaceholder')}
              disabled={isSubmitting}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && <p id="name-error" className="field-error" aria-live="polite">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">
              {t('order.phone')} {t('order.required')}
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              inputMode="numeric"
              autoComplete="tel"
              pattern="[0-9]{10,15}"
              required
              value={formData.phone}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key.length === 1 && !/[0-9]/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
                  e.preventDefault();
                }
              }}
              placeholder={t('order.phonePlaceholder')}
              disabled={isSubmitting}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? 'phone-hint phone-error' : 'phone-hint'}
            />
            <p id="phone-hint" className="field-hint">{t('order.phoneHint')}</p>
            {errors.phone && <p id="phone-error" className="field-error" aria-live="polite">{errors.phone}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="email">{t('order.email')}</label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={t('order.emailPlaceholder')}
              disabled={isSubmitting}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && <p id="email-error" className="field-error" aria-live="polite">{errors.email}</p>}
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

          {submitError && <p className="order-error" role="alert">{submitError}</p>}

          <button
            type="submit"
            className="order-btn"
            aria-busy={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? t('order.submitting') : t('order.submit')}
          </button>
        </form>
      </div>
    </div>
  );
};
