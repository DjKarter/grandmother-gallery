import type {ImageProps} from "./types.ts";

export const Image = ({
                          webpSrcSet,
                          pngSrcSet,
                          src,
                          alt,
                          ...props
                      }: ImageProps) => (
    <picture>
        {webpSrcSet && (
            <source
                srcSet={webpSrcSet}
                type="image/webp"
            />
        )}
        {pngSrcSet && (
            <source
                srcSet={pngSrcSet}
                type="image/png"
            />
        )}
        <img
            {...props}
            src={src}
            alt={alt}
            loading="lazy"
        />
    </picture>
);
