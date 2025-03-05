import { lazy, Suspense } from 'react';
import LoadingPage from '../components/common/LoadingPage';
import { Navigate } from 'react-router-dom';

// Admin의 하위 경로 라우팅 설정 파일 = 파일 분리

const AdminList = lazy(() => import('../pages/admin/ListPage'));
const AdminShopList = lazy(() => import('../pages/admin/ListShopPage'));
const AdminMemberList = lazy(() => import('../pages/admin/ListMemberPage'));
const AdminMemberRead = lazy(() => import('../pages/admin/ReadPage'));
const AdminReadMemberRead = lazy(() => import('../pages/admin/ReadMemberPage'));
const AdminMemberModify = lazy(() => import('../pages/admin/ModifyPage'));

const adminRouter = () => {
  return [
    {
      path: 'list',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <AdminList />
        </Suspense>
        ),
    },
    {
      path: 'shoplist',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <AdminShopList />
        </Suspense>
        ),
    },
    {
      path: 'memberlist',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <AdminMemberList />
        </Suspense>
        ),
    },
    {
      path: 'read/:email',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <AdminMemberRead />
        </Suspense>
      ),
    },
    {
      path: 'readmember/:email',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <AdminReadMemberRead />
        </Suspense>
      ),
    },    
    {
      path: 'modifyInfo/:email',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <AdminMemberModify />
        </Suspense>
      ),
    },
  ];
};

export default adminRouter;