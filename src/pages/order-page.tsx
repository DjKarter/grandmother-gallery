import React, { useState, useCallback } from 'react';
import './order-page.css';
import type { OrderPageProps } from './types.ts';

const FORMSPREE_ID = 'xvzjkdwj';

export const OrderPage: React.FC<OrderPageProps> = ({ onClose, selectedImage }) => {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          Имя: formData.name,
          Телефон: formData.phone,
          Email: formData.email,
          Сообщение: formData.message,
          Картина: selectedImage?.title ?? '—',
          _subject: `Заказ картины: ${selectedImage?.title ?? 'не выбрана'}`,
          _replyto: formData.email,
        }),
      });

      if (res.ok) {
        setIsSubmitted(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setError((data as { error?: string }).error ?? 'Не удалось отправить. Попробуйте позже.');
      }
    } catch {
      setError('Ошибка соединения. Проверьте интернет и попробуйте снова.');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, selectedImage]);

  if (isSubmitted) {
    return (
      <div className="order-page">
        <div className="order-content success-state">
          <div className="success-icon">✓</div>
          <h2>Спасибо за заказ!</h2>
          <p>Мы свяжемся с вами в ближайшее время для уточнения деталей.</p>
          <button className="order-btn order-btn-secondary" onClick={onClose}>
            Вернуться в галерею
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-page">
      <div className="order-content">
        <h1>Заказать картину</h1>

        {selectedImage && (
          <div className="selected-image">
            <img src={`/images/${selectedImage.name}/2.png`} alt={selectedImage.alt} />
            <div className="selected-image-info">
              <strong>{selectedImage.title || selectedImage.alt}</strong>
            </div>
          </div>
        )}

        <form className="order-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Ваше имя *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Как к вам обращаться"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Телефон *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+7 (999) 000-00-00"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="vashe@pochta.ru"
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Сообщение</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Хочу заказать эту картину... или другой вопрос"
              rows={4}
              disabled={isSubmitting}
            />
          </div>

          {error && <p className="order-error">{error}</p>}

          <button type="submit" className={`order-btn ${isSubmitting ? 'order-btn--loading' : ''}`} disabled={isSubmitting}>
            {isSubmitting ? 'Отправляем…' : 'Отправить заказ'}
          </button>
        </form>
      </div>
    </div>
  );
};
