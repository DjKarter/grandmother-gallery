import React from 'react';
import './about-page.css';

export const AboutPage: React.FC = () => (
  <div className="about-page">
    <div className="about-inner">
      <div className="about-photo-wrap">
        <div className="about-photo-placeholder">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" stroke="rgba(245,197,24,0.5)" strokeWidth="1.5"/>
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="rgba(245,197,24,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <p className="about-photo-hint">Фотография автора</p>
      </div>

      <div className="about-text">
        <h2 className="about-name">Имя Отчество</h2>
        <div className="about-ornament" />
        <p className="about-lead">Врач по призванию — художник по душе.</p>
        <p>
          Здесь будет небольшой рассказ об авторе: откуда родом, какой путь прошла,
          когда и почему начала рисовать. Этот текст можно заполнить позже.
        </p>
        <p>
          Картины написаны на холсте, картоне и других поверхностях —
          каждая работа уникальна и несёт частицу её души.
        </p>
      </div>
    </div>
  </div>
);
