import { createBrowserRouter } from 'react-router';
import Root from './pages/Root';
import Home from './pages/Home';
import Katalog from './pages/Katalog';
import ProductDetail from './pages/ProductDetail';
import Jasa from './pages/Jasa';
import Edukasi from './pages/Edukasi';
import EdukasiDetail from './pages/EdukasiDetail';
import Admin from './pages/Admin';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: 'katalog', Component: Katalog },
      { path: 'katalog/:id', Component: ProductDetail },
      { path: 'jasa', Component: Jasa },
      { path: 'edukasi', Component: Edukasi },
      { path: 'edukasi/:slug', Component: EdukasiDetail },
    ],
  },
  {
    path: '/admin',
    Component: Admin,
  },
]);
