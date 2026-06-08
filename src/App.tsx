import { useState, useCallback } from 'react';
import { GalleryGrid } from './components/GallaryGrid.tsx';
import { ImageModal } from './components/ImageModal';
import { OrderPage } from './pages/OrderPage';
import './App.css';
import { galleryImages } from "./data/gallaryData.ts";
import type { GalleryImage } from "./types/types.ts";

function App() {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [showOrderPage, setShowOrderPage] = useState(false);

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

  const handleOrderClick = useCallback(() => {
    setShowOrderPage(true);
    setSelectedImageIndex(null);
  }, []);

  return (
      <div className="app">
        <header className="header">
          <div className="header-content">
            <h1>🖼️ Картинная галерея</h1>
            <p className="subtitle">Нажмите на картину, чтобы рассмотреть её поближе</p>
            <button className="order-btn-header" onClick={handleOrderClick}>
              🛒 Заказать картину
            </button>
          </div>
        </header>

        <main>
          <GalleryGrid images={galleryImages} onImageClick={handleImageClick} />
        </main>

        {selectedImageIndex !== null && (
            <ImageModal
                images={galleryImages}
                currentIndex={selectedImageIndex}
                onClose={handleCloseModal}
                onPrev={handlePrev}
                onNext={handleNext}
            />
        )}

        <footer className="footer">
          <p>Листайте стрелками ⬅️ ➡️ | Закрыть: ESC</p>
        </footer>

        {showOrderPage && (
          <OrderPage
            onClose={() => setShowOrderPage(false)}
            selectedImage={selectedImageIndex !== null ? galleryImages[selectedImageIndex] : undefined}
          />
        )}
      </div>
  );
}

export default App;