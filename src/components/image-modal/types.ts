import type {GalleryImage} from "../../common/types";

export interface ImageModalProps {
    images: GalleryImage[];
    currentIndex: number | null;
    onClose: () => void;
    onPrev?: () => void;
    onNext?: () => void;
}
