import type {ImgHTMLAttributes} from "react";

export type ImageProps = {
    src: string;
    webpSrcSet?: string;
    pngSrcSet?: string;
} & Omit<ImgHTMLAttributes<HTMLImageElement>, "loading">;
