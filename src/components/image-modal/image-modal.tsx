import {type FC, useEffect, useState} from 'react';
import './image-modal.css';
import type {ImageModalProps} from "./types.ts";

export const ImageModal: FC<ImageModalProps> = ({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext
}) => {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (currentIndex === null) return;

            switch (e.key) {
              case 'ArrowLeft':
                e.preventDefault();
                onPrev?.();
                break;
              case 'ArrowRight':
                e.preventDefault();
                onNext?.();
                break;
              case 'Escape':
                onClose();
                break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = currentIndex !== null ? 'hidden' : '';

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [currentIndex, onClose]);

    const handleNextClick = () => {
      if (!isAnimating && onNext) {
        setIsAnimating(true);
        onNext();
        setTimeout(() => setIsAnimating(false), 300);
      }
    };

    const handlePreviousClick = () => {
      if (!isAnimating && onPrev) {
        setIsAnimating(true);
        onPrev();
        setTimeout(() => setIsAnimating(false), 300);
      }
    };

    if (currentIndex === null || currentIndex < 0 || currentIndex >= images.length) {
        return null;
    }

    const image = images[currentIndex];
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === images.length - 1;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {/* Кнопка закрытия */}
                <button className="modal-close" onClick={onClose} aria-label="Закрыть">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path
                            d="M8 8L24 24M24 8L8 24"
                            stroke="white"
                            strokeWidth="3"
                            strokeLinecap="round"
                        />
                    </svg>
                </button>

                {/* Кнопка "Назад" */}
                <button
                  className={`modal-nav modal-prev ${isFirst ? 'disabled' : ''}`}
                  onClick={handlePreviousClick}
                  aria-label="Предыдущая картинка"
                >
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path
                            d="M14 8L8 16L14 24"
                            stroke="white"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>

                {/* Кнопка "Вперёд" */}
                <button
                  className={`modal-nav modal-next ${isLast ? 'disabled' : ''}`}
                  onClick={handleNextClick}
                  aria-label="Следующая картинка"
                >
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path
                            d="M18 8L24 16L18 24"
                            stroke="white"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>

                {/* Картинка */}
                <div className="modal-image-wrapper">
                    <img
                        src={image.src}
                        alt={image.alt}
                        className="modal-image"
                    />
                </div>

                {/* Описание */}
                {(image.title || image.description) && (
                    <div className="modal-caption">
                        {image.title && <h3>{image.title}</h3>}
                        {image.description && <p>{image.description}</p>}
                    </div>
                )}

                {/* Индикатор */}
                <div className="modal-indicator">
                    {currentIndex + 1} / {images.length}
                </div>
            </div>
        </div>
    );
};