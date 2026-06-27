const SIZES = [1, 2, 3, 4] as const;

export const getImagePaths = (name: string) => ({
    webpSrcSet: SIZES.map(x => `/images/${name}/${x}.webp ${x}x`).join(', '),
    pngSrcSet:  SIZES.map(x => `/images/${name}/${x}.png ${x}x`).join(', '),
    fallbackSrc: `/images/${name}/2.png`,
    fullWebp:    `/images/${name}/4.webp`,
    fullPng:     `/images/${name}/4.png`,
});
