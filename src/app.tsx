import { useCallback } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './app.css';

function App() {
  const { t, i18n } = useTranslation();

  const toggleLang = useCallback(() => {
    const next = i18n.language === 'ru' ? 'en' : 'ru';
    i18n.changeLanguage(next);
    localStorage.setItem('lang', next);
  }, [i18n]);

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>{t('header.title')}</h1>
          <div className="header-ornament" />
          <p className="subtitle">{t('header.subtitle')}</p>
          <nav className="header-nav">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
            >
              {t('nav.gallery')}
            </NavLink>
            <span className="header-nav-sep">·</span>
            <NavLink
              to="/about"
              className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
            >
              {t('nav.about')}
            </NavLink>
            <span className="header-nav-sep">·</span>
            <NavLink
              to="/order"
              className={({ isActive }) =>
                `nav-link nav-link--order${isActive ? ' nav-link--active' : ''}`
              }
            >
              {t('nav.order')}
            </NavLink>
            <span className="header-nav-sep">·</span>
            <button className="nav-link lang-toggle" onClick={toggleLang} aria-label="Switch language">
              {i18n.language === 'ru' ? 'EN' : 'RU'}
            </button>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer" />
    </div>
  );
}

export default App;
