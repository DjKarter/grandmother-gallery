
import {type FC, useEffect, useLayoutEffect, useState, useRef, type MouseEvent, type WheelEvent} from 'react';
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
    const [isImageLoading, setIsImageLoading] = useState(true);
    const [scale, setScale] = useState(1);
    const [isPanning, setIsPanning] = useState(false);
    const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
    const [startPan, setStartPan] = useState({ x: 0, y: 0 });
    const imageRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Сброс зума и показ спиннера при смене картинки
    useLayoutEffect(() => {
        setScale(1);
        setPanPosition({ x: 0, y: 0 });
        setIsPanning(false);
        setIsImageLoading(true);
    }, [currentIndex]);

    // Прелоадинг соседних картин
    useEffect(() => {
        if (currentIndex === null) return;
        const preload = (src: string) => { new Image().src = src; };
        if (currentIndex > 0) preload(images[currentIndex - 1].src);
        if (currentIndex < images.length - 1) preload(images[currentIndex + 1].src);
    }, [currentIndex, images]);

    const handleZoomIn = () => {
        setScale(s => Math.min(4, s + 0.5));
    };

    const handleZoomOut = () => {
        setScale(s => Math.max(1, s - 0.5));
    };

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
                case '=':
                case '+':
                    e.preventDefault();
                    handleZoomIn();
                    break;
                case '-':
                    e.preventDefault();
                    handleZoomOut();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = currentIndex !== null ? 'hidden' : '';

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [currentIndex, onClose, handleZoomIn, handleZoomOut]);

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

    // Зум колесиком
    const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
        if (e.target !== imageRef.current) return;
        e.preventDefault();

        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        const newScale = Math.max(1, Math.min(4, scale + delta));
        setScale(newScale);
    };

    const handleResetZoom = () => {
        setScale(1);
        setPanPosition({ x: 0, y: 0 });
    };

    const handleDoubleClick = (_e: MouseEvent) => {
        if (scale > 1) {
            handleResetZoom();
        } else {
            const rect = imageRef.current?.getBoundingClientRect();
            if (rect) {
                setScale(2);
            }
        }
    };

    const handleMouseDown = (e: MouseEvent) => {
        if (scale <= 1) return;
        setIsPanning(true);
        setStartPan({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isPanning || scale <= 1) return;
        setPanPosition({
            x: e.clientX - startPan.x,
            y: e.clientY - startPan.y
        });
    };

    const handleMouseUp = () => {
        setIsPanning(false);
    };

    // Тач-жесты для зума и свайпов
    const [lastTouchX, setLastTouchX] = useState(0);
    const [lastTouchY, setLastTouchY] = useState(0);
    const [touchStartDist, setTouchStartDist] = useState<number | null>(null);

    const handleTouchStart = (e: TouchEvent) => {
        if (e.touches.length === 1) {
            setLastTouchX(e.touches[0].clientX);
            setLastTouchY(e.touches[0].clientY);
        } else if (e.touches.length === 2) {
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            setTouchStartDist(Math.hypot(dx, dy));
        }
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (e.touches.length === 1 && scale <= 1) {
            const dx = e.touches[0].clientX - lastTouchX;
            const dy = e.touches[0].clientY - lastTouchY;

            if (Math.abs(dx) > 10 && Math.abs(dy) < Math.abs(dx)) {
                if (dx > 50) onPrev?.();
                else if (dx < -50) onNext?.();
            }

            setLastTouchX(e.touches[0].clientX);
            setLastTouchY(e.touches[0].clientY);
        } else if (e.touches.length === 2 && touchStartDist !== null) {
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const dist = Math.hypot(dx, dy);
            const delta = dist - touchStartDist;

            if (Math.abs(delta) > 5) {
                const newScale = Math.max(1, Math.min(4, scale + delta * 0.01));
                setScale(newScale);
                setTouchStartDist(dist);
            }
        }
    };

    if (currentIndex === null || currentIndex < 0 || currentIndex >= images.length) {
        return null;
    }

    const image = images[currentIndex];
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === images.length - 1;
    const progress = ((currentIndex + 1) / images.length) * 100;

    return (
        <div className="modal-overlay" onClick={onClose}>
            {/* Прогресс-бар */}
            <div className="modal-progress-bar">
                <div className="modal-progress-fill" style={{ width: `${progress}%` }} />
            </div>

            {/* Верхняя панель: зум слева, закрыть справа */}
            <div className="modal-top-bar" onClick={(e) => e.stopPropagation()}>
                <div className="modal-zoom-controls">
                    <button className="zoom-btn" onClick={handleZoomOut} disabled={scale <= 1} aria-label="Уменьшить">
                        <svg width="16" height="16" viewBox="0 0 24 24">
                            <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </button>
                    <span className="zoom-indicator">{Math.round(scale * 100)}%</span>
                    <button className="zoom-btn" onClick={handleZoomIn} disabled={scale >= 4} aria-label="Увеличить">
                        <svg width="16" height="16" viewBox="0 0 24 24">
                            <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </button>
                    {scale > 1 && (
                        <button className="zoom-btn" onClick={handleResetZoom} aria-label="Сбросить зум">
                            <svg width="14" height="14" viewBox="0 0 24 24">
                                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
                                <path d="M3 3v5h5" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
                            </svg>
                        </button>
                    )}
                </div>

                <button className="modal-close" onClick={onClose} aria-label="Закрыть">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                </button>
            </div>

            {/* Стрелки навигации */}
            <button
                className={`modal-nav modal-prev ${isFirst ? 'disabled' : ''}`}
                onClick={(e) => { e.stopPropagation(); handlePreviousClick(); }}
                aria-label="Предыдущая картинка"
            >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>

            {/* Картинка — wrapper на весь экран, клик по полям закрывает */}
            <div
                className="modal-image-wrapper"
                ref={containerRef}
                onMouseLeave={handleMouseUp}
                onTouchStart={(e) => { handleTouchStart(e as unknown as TouchEvent); e.stopPropagation(); }}
                onTouchMove={(e) => { handleTouchMove(e as unknown as TouchEvent); e.stopPropagation(); }}
                onWheel={(e) => { handleWheel(e); e.stopPropagation(); }}
            >
                {isImageLoading && (
                    <div className="modal-spinner">
                        <div className="spinner-ring" />
                    </div>
                )}
                <picture key={image.id} style={{ display: 'contents' }}>
                    <source srcSet={image.webpSrc} type="image/webp" />
                    <img
                        ref={imageRef}
                        src={image.src}
                        alt={image.alt}
                        className="modal-image"
                        style={{
                            transform: `scale(${scale}) translate(${panPosition.x}px, ${panPosition.y}px)`,
                            cursor: scale > 1 ? (isPanning ? 'grabbing' : 'grab') : 'default',
                            opacity: isImageLoading ? 0 : 1,
                            transition: 'opacity 0.3s ease, transform 0.1s ease-out',
                        }}
                        onLoad={() => setIsImageLoading(false)}
                        onClick={(e) => e.stopPropagation()}
                        onDoubleClick={handleDoubleClick}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                    />
                </picture>
            </div>

            <button
                className={`modal-nav modal-next ${isLast ? 'disabled' : ''}`}
                onClick={(e) => { e.stopPropagation(); handleNextClick(); }}
                aria-label="Следующая картинка"
            >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>

            {/* Нижняя полоса: название + счётчик */}
            <div className="modal-bottom" onClick={(e) => e.stopPropagation()}>
                {image.title && <h3 className="modal-title">{image.title}</h3>}
                {image.description && <p className="modal-desc">{image.description}</p>}
                <span className="modal-indicator">{currentIndex + 1} / {images.length}</span>
            </div>
        </div>
    );
};