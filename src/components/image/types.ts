import type {ImgHTMLAttributes} from "react";

export type ImageProps = {
    /**
     * Идентификатор для автоматического тестирования
     */
    dataTestId?: string;
    /**
     * Либо fallback для webp/png set, либо изображение для отображения
     */
    src: string;
} & WebpPngSrcType & Omit<ImgHTMLAttributes<HTMLImageElement>, "loading">;



export type WebpPngSrcType =
    | {
    /**
     * Строка с webp картинками формата `${ImageWebp1} 1x, ${ImageWebp2} 2x, ${ImageWebp3} 3x, ${ImageWebp4} 4x`
     */
    webpSrcSet: string;
    /**
     * Строка с png картинками формата `${NoneImagePng1} 1x, ${NoneImagePng2} 2x, ${NoneImagePng3} 3x, ${NoneImagePng4} 4x`
     */
    pngSrcSet: string;
}
    | {
    /**
     * Строка с webp картинками формата `${ImageWebp1} 1x, ${ImageWebp2} 2x, ${ImageWebp3} 3x, ${ImageWebp4} 4x`
     */
    webpSrcSet?: never;
    /**
     * Строка с png картинками формата `${NoneImagePng1} 1x, ${NoneImagePng2} 2x, ${NoneImagePng3} 3x, ${NoneImagePng4} 4x`
     */
    pngSrcSet?: never;
};
