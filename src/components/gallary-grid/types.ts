import type {GalleryImage} from "../../common/types";

export interface GalleryGridProps {
    images: GalleryImage[];
    onImageClick: (image: GalleryImage) => void;
}