import React from 'react';
import './about-page.css';

export const AboutPage: React.FC = () => (
  <div className="about-page">
    <div className="about-inner">
      <div className="about-photo-wrap">
        <img
          src="/author/author.jpeg"
          alt="Автор — у цветов"
          className="about-photo"
        />
      </div>

      <div className="about-text">
        <h2 className="about-name">Бикметова Жанна Геннадьевна</h2>
        <div className="about-ornament" />
        <p className="about-lead">Врач по призванию — художник по душе.</p>
        <p>
          Картины написаны на холсте, картоне и других поверхностях —
          каждая работа уникальна и несёт частицу её души.
        </p>
      </div>
    </div>
  </div>
);
