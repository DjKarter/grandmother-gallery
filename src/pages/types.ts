import type {GalleryImage} from "../common/types";


export type OrderPageProps  = {
    onClose?: () => void;
    selectedImage?: GalleryImage | undefined;
}
