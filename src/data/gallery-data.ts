import type { GalleryImage } from '../common/types';
import { BURGUNTIA } from '../assets/burguntia';
import { FOG_ALBION } from '../assets/fog-albion';
import { IN_THE_ROCKS } from '../assets/in-the-rocks';
import { JAPAN_MOUNTAIN } from '../assets/japan-mountain';
import { SAD_TREE } from '../assets/sad-tree';
import { SPACE } from '../assets/space';

export const galleryImages: GalleryImage[] = [
    {
        id: '1',
        src: BURGUNTIA.fallbackSrc,
        width: 2598,
        height: 2187,
        webpSrc: BURGUNTIA.webpSrc,
        webpSrcSet: BURGUNTIA.webpSrcSet,
        pngSrcSet: BURGUNTIA.pngSrcSet,
        alt: 'Альпийские поля',
        title: 'Альпийские поля',
        description: 'Красивые поля близ гор'
    },
    {
        id: '2',
        src: FOG_ALBION.fallbackSrc,
        width: 1918,
        height: 1498,
        webpSrc: FOG_ALBION.webpSrc,
        webpSrcSet: FOG_ALBION.webpSrcSet,
        pngSrcSet: FOG_ALBION.pngSrcSet,
        alt: 'Туманный Альбион',
        title: 'Туманный Альбион',
        description: 'Кораблики, блуждающие в тумане'
    },
    {
        id: '3',
        src: IN_THE_ROCKS.fallbackSrc,
        width: 2612,
        height: 2643,
        webpSrc: IN_THE_ROCKS.webpSrc,
        webpSrcSet: IN_THE_ROCKS.webpSrcSet,
        pngSrcSet: IN_THE_ROCKS.pngSrcSet,
        alt: 'В скалах',
        title: 'В скалах',
        description: 'Корабль заходит в бухту'
    },
    {
        id: '4',
        src: JAPAN_MOUNTAIN.fallbackSrc,
        width: 1755,
        height: 1799,
        webpSrc: JAPAN_MOUNTAIN.webpSrc,
        webpSrcSet: JAPAN_MOUNTAIN.webpSrcSet,
        pngSrcSet: JAPAN_MOUNTAIN.pngSrcSet,
        alt: 'Японские горы',
        title: 'Японские горы',
        description: 'Озеро близ Фудзи'
    },
    {
        id: '5',
        src: SAD_TREE.fallbackSrc,
        width: 2380,
        height: 3483,
        webpSrc: SAD_TREE.webpSrc,
        webpSrcSet: SAD_TREE.webpSrcSet,
        pngSrcSet: SAD_TREE.pngSrcSet,
        alt: 'Закат',
        title: 'Сумерки',
        description: 'Дерево пытается ухватить последние лучики солнца'
    },
    {
        id: '6',
        src: SPACE.fallbackSrc,
        width: 2665,
        height: 2718,
        webpSrc: SPACE.webpSrc,
        webpSrcSet: SPACE.webpSrcSet,
        pngSrcSet: SPACE.pngSrcSet,
        alt: 'Космос',
        title: 'Галактика',
        description: 'Завораживающие небесные просторы'
    },
];
