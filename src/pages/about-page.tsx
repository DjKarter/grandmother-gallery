import React from 'react';
import { useTranslation } from 'react-i18next';
import './about-page.css';

export const AboutPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="about-page">
      <div className="about-inner">
        <div className="about-photo-wrap">
          <img
            src="/author/author.jpeg"
            alt={t('about.photoAlt')}
            className="about-photo"
          />
        </div>

        <div className="about-text">
          <h2 className="about-name">{t('about.name')}</h2>
          <div className="about-ornament" />
          <p className="about-lead">{t('about.lead')}</p>
          <p>{t('about.bio')}</p>
        </div>
      </div>
    </div>
  );
};
