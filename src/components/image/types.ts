import type {ImgHTMLAttributes} from "react";

export type ImageProps = {
    dataTestId?: string;
    src: string;
    webpSrc?: string;
} & Omit<ImgHTMLAttributes<HTMLImageElement>, "loading">;
