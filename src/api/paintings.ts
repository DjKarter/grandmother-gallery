import axios from 'axios';
import type { GalleryImage } from '../common/types';

const apiClient = axios.create({
  baseURL: '/',
  timeout: 5000,
});

export const fetchPaintings = async (): Promise<GalleryImage[]> => {
  const { data } = await apiClient.get<GalleryImage[]>('api/paintings.json');
  return data;
};
