import { lazy, Suspense } from 'react';
import LoadingPage from '../components/common/LoadingPage';
import { Navigate } from 'react-router-dom';

const ProductList = lazy(() => import('../pages/products/ListPage'));
const ProductAdd = lazy(() => import('../pages/products/AddPage'));
const ProductRead = lazy(() => import('../pages/products/ReadPage'));
const ProductModify = lazy(() => import('../pages/products/ModifyPage'));

const productsRouter = () => {
  return [
    {
      path: 'list',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <ProductList />
        </Suspense>
      ),
    },
    {
      path: '',
      element: <Navigate replace to="/products/list" />,
    },
    {
      path: 'add',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <ProductAdd />
        </Suspense>
      ),
    },
    {
      path: 'read/:pno',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <ProductRead />
        </Suspense>
      ),
    },
    {
      path: 'modify/:pno',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <ProductModify />
        </Suspense>
      ),
    },
  ];
};

export default productsRouter;
