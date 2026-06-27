import type { GalleryImage } from '../common/types';
import burguntia from '../assets/sources/burguntia.png';
import fogAlbion from '../assets/sources/fog-albion.png';
import inTheRocks from '../assets/sources/in-the-rocks.png';
import japanMountain from '../assets/sources/japan-mountain.png';
import sadTree from '../assets/sources/sad-tree.png';
import space from '../assets/sources/space.png';

export const galleryImages: GalleryImage[] = [
    {
        id: '1',
        src: burguntia,
        alt: 'Альпийские поля',
        title: 'Альпийские поля',
        description: 'Красивые поля близ гор'
    },
    {
        id: '2',
        src: fogAlbion,
        alt: 'Туманный Альбион',
        title: 'Туманный Альбион',
        description: 'Кораблики, блуждающие в тумане'
    },
    {
        id: '3',
        src: inTheRocks,
        alt: 'В скалах',
        title: 'В скалах',
        description: 'Корабль заходит в бухту'
    },
    {
        id: '4',
        src: japanMountain,
        alt: 'Японские горы',
        title: 'Японские горы',
        description: 'Озеро близ Фудзи'
    },
    {
        id: '5',
        src: sadTree,
        alt: 'Закат',
        title: 'Сумерки',
        description: 'Дерево пытается ухватить последние лучики солнца'
    },
    {
        id: '6',
        src: space,
        alt: 'Космос',
        title: 'Галактика',
        description: 'Завораживающие небесные просторы'
    },
];
