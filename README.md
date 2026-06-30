# Grandmother Gallery

Онлайн-галерея живописи Бикметовой Жанны Геннадьевны. Сайт позволяет просматривать картины, узнать об авторе и оставить заявку на приобретение работы.

## Стек

- **React 19** + **TypeScript** + **Vite**
- **React Router v7** — клиентский роутинг (`/`, `/about`, `/order`)
- **Husky** — pre-commit и pre-push хуки

## Быстрый старт

```bash
npm install
npm run dev
```

Откройте [http://localhost:5173](http://localhost:5173).

## Сборка

```bash
npm run build
npm run preview
```

## Деплой на GitHub Pages

```bash
npm run deploy
```

## Структура проекта

```
src/
├── app.tsx              # Layout: шапка, навигация, <Outlet>
├── router.tsx           # Определение маршрутов
├── pages/
│   ├── gallery-page.tsx # Главная страница с сеткой картин
│   ├── about-page.tsx   # Страница «Об авторе»
│   └── order-page.tsx   # Форма заказа (Formspree)
├── components/
│   ├── gallary-grid/    # Сетка картин
│   └── image-modal/     # Лайтбокс с навигацией
├── data/
│   └── gallery-data.ts  # Данные о картинах
└── common/types/        # Общие TypeScript типы
public/
└── images/<name>/       # 1.webp … 4.webp для каждой картины
```

## Добавить новую картину

1. Положить файлы в `public/images/my-painting/`: `1.png`, `1.webp` … `4.png`, `4.webp`
2. Добавить запись в [`src/data/gallery-data.ts`](src/data/gallery-data.ts):

```ts
{
  id: '7',
  name: 'my-painting',
  width: 1800,
  height: 1200,
  alt: 'Название',
  title: 'Название',
  description: 'Описание картины',
}
```
