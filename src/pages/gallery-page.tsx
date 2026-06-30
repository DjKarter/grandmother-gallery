import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { GalleryGrid } from '../components/gallary-grid';
import { ImageModal } from '../components/image-modal';
import { fetchPaintings } from '../api/paintings';
import { useGalleryStore } from '../store/gallery-store';
import type { GalleryImage } from '../common/types';
import './gallery-page.css';

export const GalleryPage = () => {
  const { t } = useTranslation();
  const { selectedImageIndex, openModal, closeModal, goToPrev, goToNext } = useGalleryStore();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: paintings = [], isLoading, isError } = useQuery({
    queryKey: ['paintings'],
    queryFn: fetchPaintings,
  });

  // useMemo: вычисляем отфильтрованный список только когда меняется
  // searchQuery или сам массив paintings — не при каждом рендере
  const filteredPaintings = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return paintings;
    return paintings.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.alt.toLowerCase().includes(q),
    );
  }, [paintings, searchQuery]);

  // useCallback: стабильная ссылка на функцию — не создаётся заново при рендере,
  // нужна чтобы GalleryGrid не перерисовывался когда меняется только searchQuery
  const handleImageClick = useCallback(
    (image: GalleryImage) => {
      const index = filteredPaintings.findIndex((img) => img.id === image.id);
      if (index !== -1) openModal(index);
    },
    [filteredPaintings, openModal],
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
      closeModal();
    },
    [closeModal],
  );

  if (isLoading) {
    return (
      <div className="gallery-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="gallery-item">
            <div className="gallery-skeleton" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ textAlign: 'center', padding: '64px 24px', color: '#6B5D3F' }}>
        <p style={{ fontSize: '18px' }}>{t('gallery.errorTitle')}</p>
        <p style={{ fontSize: '14px', marginTop: '8px' }}>{t('gallery.errorHint')}</p>
      </div>
    );
  }

  return (
    <>
      <div className="gallery-search-wrap">
        <input
          className="gallery-search"
          type="search"
          placeholder={t('gallery.search')}
          value={searchQuery}
          onChange={handleSearchChange}
          aria-label={t('gallery.search')}
        />
      </div>

      {filteredPaintings.length === 0 ? (
        <p className="gallery-empty">
          {t('gallery.empty', { query: searchQuery })}
        </p>
      ) : (
        <GalleryGrid images={filteredPaintings} onImageClick={handleImageClick} />
      )}

      {selectedImageIndex !== null && (
        <ImageModal
          images={filteredPaintings}
          currentIndex={selectedImageIndex}
          onClose={closeModal}
          onPrev={goToPrev}
          onNext={() => goToNext(filteredPaintings.length)}
        />
      )}
    </>
  );
};
