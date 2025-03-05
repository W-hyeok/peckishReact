import { useRoutes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import LoadingPage from '../components/common/LoadingPage';
import memberRouter from './memberRouter';
import shopRouter from './shopRouter';
import adminRouter from './adminRouter';

// 지연 로딩 처리 : dynamic import
const Main = lazy(() => import('../pages/MainPage'));
const About = lazy(() => import('../pages/AboutPage'));
const MemberIndex = lazy(() => import('../pages/member/MemberIndex'));
const ShopIndex = lazy(() => import('../pages/shop/shopIndex'));
const AdminIndex = lazy(() => import('../pages/admin/AdminIndex'));
const AdminShopIndex = lazy(
  () => import('../pages/admin/adminshop/AdminShopIndex')
);
const AdminMemberIndex = lazy(
  () => import('../pages/admin/adminMember/AdminMemberIndex')
);
const TestPage = lazy(() => import('../pages/TestPage'));
// 라우팅 설정 메인 파일
const Router = () => {
  return useRoutes([
    {
      path: '',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <Main />
        </Suspense>
      ),
    },
    {
      path: 'about',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <About />
        </Suspense>
      ),
    }, //about
    {
      path: 'member',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <MemberIndex />
        </Suspense>
      ),
      children: memberRouter(),
    }, // member
    {
      path: 'shop',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <ShopIndex />
        </Suspense>
      ),
      children: shopRouter(),
    }, // shop
    {
      path: 'admin',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <AdminIndex />
        </Suspense>
      ),
      children: adminRouter(),
    }, // admin
    {
      path: 'admin/adminshop',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <AdminShopIndex />
        </Suspense>
      ),
      children: adminRouter(),
    }, // admin
    {
      path: 'admin/adminmember',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <AdminMemberIndex />
        </Suspense>
      ),
      children: adminRouter(),
    }, // admin
    {
      path: 'test',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <TestPage />
        </Suspense>
      ),
      children: adminRouter(),
    }, // admin
  ]);
};

export default Router;
