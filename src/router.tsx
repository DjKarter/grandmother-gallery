import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from './app';
import { ErrorBoundary } from './components/error-boundary/error-boundary';

// Lazy-loaded pages: браузер загружает каждую страницу отдельным чанком
// только когда пользователь на неё переходит
const GalleryPage = lazy(() =>
  import('./pages/gallery-page').then((m) => ({ default: m.GalleryPage })),
);
const AboutPage = lazy(() =>
  import('./pages/about-page').then((m) => ({ default: m.AboutPage })),
);
const OrderPage = lazy(() =>
  import('./pages/order-page').then((m) => ({ default: m.OrderPage })),
);

const PageSuspense = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary>
    <Suspense
      fallback={
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 24px' }}>
          <div className="gallery-skeleton" style={{ width: '100%', maxWidth: '800px', height: '400px', borderRadius: '4px' }} />
        </div>
      }
    >
      {children}
    </Suspense>
  </ErrorBoundary>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <PageSuspense><GalleryPage /></PageSuspense>,
      },
      {
        path: 'about',
        element: <PageSuspense><AboutPage /></PageSuspense>,
      },
      {
        path: 'order',
        element: <PageSuspense><OrderPage /></PageSuspense>,
      },
    ],
  },
]);
