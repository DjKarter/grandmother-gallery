import axios from 'axios';
import type { GalleryImage } from '../common/types';

const apiClient = axios.create({
  baseURL: '/',
  timeout: 5000,
});

export const fetchPaintings = async (): Promise<GalleryImage[]> => {
  // Изменение каталога меняет URL запроса и обходит кеш прежней публикации.
  const { data } = await apiClient.get<GalleryImage[]>('api/paintings.json', {
    params: { v: import.meta.env.VITE_CATALOG_VERSION },
  });
  return data;
};
