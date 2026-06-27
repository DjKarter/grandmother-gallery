# Галлерея изображений

## Чтобы добавить новую картину:

1. Положить файлы в public/images/my-painting/1.png, 1.webp ... 4.png, 4.webp
2. Добавить в gallery-data.ts:
{
    id: '7',
    name: 'my-painting',
    width: 1800,   // опционально
    height: 1200,  // опционально
    alt: 'Название',
    title: 'Название',
    description: 'Описание',
}