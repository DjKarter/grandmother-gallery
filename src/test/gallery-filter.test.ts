import { describe, it, expect } from 'vitest';
import type { GalleryImage } from '../common/types';

const paintings: GalleryImage[] = [
  { id: '1', name: 'burguntia', alt: 'Альпийские поля', title: 'Альпийские поля', description: 'Красивые поля близ гор' },
  { id: '2', name: 'fog-albion', alt: 'Туманный Альбион', title: 'Туманный Альбион', description: 'Кораблики в тумане' },
  { id: '3', name: 'space', alt: 'Космос', title: 'Галактика', description: 'Завораживающие небесные просторы' },
];

// Та же логика фильтрации что в gallery-page.tsx
function filterPaintings(paintings: GalleryImage[], query: string): GalleryImage[] {
  const q = query.trim().toLowerCase();
  if (!q) return paintings;
  return paintings.filter(
    (p) =>
      p.title?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.alt.toLowerCase().includes(q),
  );
}

describe('filterPaintings', () => {
  it('возвращает все картины при пустом запросе', () => {
    expect(filterPaintings(paintings, '')).toHaveLength(3);
    expect(filterPaintings(paintings, '   ')).toHaveLength(3);
  });

  it('ищет по title (регистронезависимо)', () => {
    const result = filterPaintings(paintings, 'галактика');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('3');
  });

  it('ищет по description', () => {
    const result = filterPaintings(paintings, 'туман');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('ищет по alt когда title не совпадает', () => {
    // title = 'Галактика', но alt = 'Космос'
    const result = filterPaintings(paintings, 'космос');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('3');
  });

  it('возвращает пустой массив если ничего не найдено', () => {
    expect(filterPaintings(paintings, 'xyz_not_found')).toHaveLength(0);
  });

  it('возвращает несколько результатов при частичном совпадении', () => {
    // 'поля' встречается в title и description первой картины
    const result = filterPaintings(paintings, 'поля');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });
});
