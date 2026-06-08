import React from 'react';
import './GalleryGrid.css';
import type {GalleryImage} from "../types/types.ts";

interface GalleryGridProps {
    images: GalleryImage[];
    onImageClick: (image: GalleryImage) => void;
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({ images, onImageClick }) => {
    return (
        <div className="gallery-grid">
            {images.map((image) => (
                <div
                    key={image.id}
                    className="gallery-item"
                    onClick={() => onImageClick(image)}
                >
                    <img
                        src={image.src}
                        alt={image.alt}
                        loading="lazy"
                    />
                    {image.title && (
                        <div className="gallery-item-overlay">
                            <span className="gallery-item-title">{image.title}</span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};