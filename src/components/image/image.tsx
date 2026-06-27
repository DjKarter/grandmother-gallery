import type {ImageProps} from "./types.ts";

export const Image = ({ webpSrc, src, alt, ...props }: ImageProps) => (
    <picture>
        {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
        <img {...props} src={src} alt={alt} loading="lazy" />
    </picture>
);
