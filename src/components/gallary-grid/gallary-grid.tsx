import './gallery-grid.css';
import type {GalleryGridProps} from "./types.ts";
import {useState, type FC} from "react";
import {Image} from "../image/image.tsx";
import {getImagePaths} from "../../utils/image-paths.ts";

export const GalleryGrid: FC<GalleryGridProps> = ({ images, onImageClick }) => {
    const [loadedIds, setLoadedIds] = useState<Set<string>>(new Set());

    const handleLoad = (id: string) => {
        setLoadedIds(prev => new Set(prev).add(id));
    };

    return (
        <div className="gallery-grid">
            {images.map((image) => {
                const paths = getImagePaths(image.name);
                return (
                    <div
                        key={image.id}
                        className="gallery-item"
                        onClick={() => onImageClick(image)}
                    >
                        {!loadedIds.has(image.id) && (
                            <div className="gallery-skeleton" />
                        )}
                        <Image
                            src={paths.fallbackSrc}
                            webpSrcSet={paths.webpSrcSet}
                            pngSrcSet={paths.pngSrcSet}
                            alt={image.alt}
                            width={image.width}
                            height={image.height}
                            onLoad={() => handleLoad(image.id)}
                        />
                        {image.title && (
                            <div className="gallery-item-overlay">
                                <span className="gallery-item-title">{image.title}</span>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
