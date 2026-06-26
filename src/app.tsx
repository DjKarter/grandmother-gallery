import { useState, useCallback, useRef } from 'react';
import { GalleryGrid } from './components/gallary-grid';
import { ImageModal } from './components/image-modal';
import { OrderPage } from './pages/order-page.tsx';
import { AboutPage } from './pages/about-page.tsx';
import './app.css';
import { galleryImages } from "./data/gallery-data.ts";
import type { GalleryImage } from "./common/types";

type View = 'gallery' | 'about' | 'order';

function App() {
  const [currentView, setCurrentView] = useState<View>('gallery');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigateTo = useCallback((view: View) => {
    if (view === currentView) return;
    if (transitionTimer.current) clearTimeout(transitionTimer.current);

    setSelectedImageIndex(null);
    setIsTransitioning(true);

    transitionTimer.current = setTimeout(() => {
      setCurrentView(view);
      setIsTransitioning(false);
    }, 220);
  }, [currentView]);

  const handleImageClick = useCallback((image: GalleryImage) => {
    const index = galleryImages.findIndex((img) => img.id === image.id);
    setSelectedImageIndex(index !== -1 ? index : 0);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedImageIndex(null);
  }, []);

  const handlePrev = useCallback(() => {
    setSelectedImageIndex((prev) => {
      if (prev !== null && prev > 0) return prev - 1;
      return prev;
    });
  }, []);

  const handleNext = useCallback(() => {
    setSelectedImageIndex((prev) => {
      if (prev !== null && prev < galleryImages.length - 1) return prev + 1;
      return prev;
    });
  }, []);

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>Картинная галерея</h1>
          <div className="header-ornament" />
          <p className="subtitle">Нажмите на картину, чтобы рассмотреть её поближе</p>
          <nav className="header-nav">
            <button
              className={`nav-link ${currentView === 'gallery' ? 'nav-link--active' : ''}`}
              onClick={() => navigateTo('gallery')}
            >
              Галерея
            </button>
            <span className="header-nav-sep">·</span>
            <button
              className={`nav-link ${currentView === 'about' ? 'nav-link--active' : ''}`}
              onClick={() => navigateTo('about')}
            >
              Об авторе
            </button>
            <span className="header-nav-sep">·</span>
            <button
              className={`nav-link nav-link--order ${currentView === 'order' ? 'nav-link--active' : ''}`}
              onClick={() => navigateTo('order')}
            >
              Заказать
            </button>
          </nav>
        </div>
      </header>

      <main className={`main-content ${isTransitioning ? 'main-content--out' : ''}`}>
        {currentView === 'gallery' && (
          <GalleryGrid images={galleryImages} onImageClick={handleImageClick} />
        )}
        {currentView === 'about' && <AboutPage />}
        {currentView === 'order' && (
          <OrderPage
            onClose={() => navigateTo('gallery')}
            selectedImage={undefined}
          />
        )}
      </main>

      {currentView === 'gallery' && selectedImageIndex !== null && (
        <ImageModal
          images={galleryImages}
          currentIndex={selectedImageIndex}
          onClose={handleCloseModal}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}

      <footer className="footer" id="about-footer" />
    </div>
  );
}

export default App;
