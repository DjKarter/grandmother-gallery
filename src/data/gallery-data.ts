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
        alt: 'Морской берег',
        title: 'Спокойное море',
        description: 'Закат у моря'
    },
    {
        id: '2',
        src: fogAlbion,
        alt: 'Горный пейзаж',
        title: 'Туманный Альбион',
        description: 'Величественные горы в тумане'
    },
    {
        id: '3',
        src: inTheRocks,
        alt: 'Лесная тропа',
        title: 'В скалах',
        description: 'Золотая осень'
    },
    {
        id: '4',
        src: japanMountain,
        alt: 'Горный пейзаж',
        title: 'Японские горы',
        description: 'Уютные улочки'
    },
    {
        id: '5',
        src: sadTree,
        alt: 'Дерево',
        title: 'Грустное дерево',
        description: 'Кристально чистая вода'
    },
    {
        id: '6',
        src: space,
        alt: 'Космос',
        title: 'Просторы',
        description: 'Распустившиеся тюльпаны'
    },
];
