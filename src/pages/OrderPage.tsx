import React, { useState, useCallback } from 'react';
import type { GalleryImage } from '../types/types.ts';
import './OrderPage.css';

interface OrderPageProps {
  onClose?: () => void;
  selectedImage?: GalleryImage | undefined;
}

export const OrderPage: React.FC<OrderPageProps> = ({ onClose, selectedImage }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    // Здесь можно добавить отправку формы на сервер
    console.log('Order submitted:', formData);
    setIsSubmitted(true);
  }, [formData]);

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
      <button className="order-close" onClick={onClose} aria-label="Закрыть">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      <div className="order-content">
        <h1>Заказать картину</h1>

        {selectedImage && (
          <div className="selected-image">
            <img src={selectedImage.src} alt={selectedImage.alt} />
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
            />
          </div>

          <button type="submit" className="order-btn">
            Отправить заказ
          </button>
        </form>
      </div>
    </div>
  );
};
