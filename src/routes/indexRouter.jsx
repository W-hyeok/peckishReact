import { useRoutes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import LoadingPage from '../components/common/LoadingPage';
import memberRouter from './memberRouter';
import shopRouter from './shopRouter';
import adminRouter from './adminRouter';
import reviewRouter from './reviewRouter';
import About2 from '../pages/About2';

// 지연 로딩 처리 : dynamic import
const Main = lazy(() => import('../pages/MainPage'));
const About = lazy(() => import('../pages/AboutPage'));
const MemberIndex = lazy(() => import('../pages/member/MemberIndex'));
const ShopIndex = lazy(() => import('../pages/shop/shopIndex'));
const ReviewIndex = lazy(() => import('../pages/review/reviewIndex'));
const AdminIndex = lazy(() => import('../pages/admin/AdminIndex'));
const AdminShopIndex = lazy(
  () => import('../pages/admin/adminshop/AdminShopIndex')
);
const AdminMemberIndex = lazy(
  () => import('../pages/admin/adminmember/AdminMemberIndex')
);
const RoomPage = lazy(() => import('../pages/chat/RoomPage'));
const RoomComponent = lazy(() => import('../components/chat/RoomComponent'));
const RoomListPage = lazy(() => import('../pages/chat/RoomListPage'));
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
      path: 'about2',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <About2 />
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
      path: 'review',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <ReviewIndex />
        </Suspense>
      ),
      children: reviewRouter(),
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
      path: 'room/:room_ID',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <RoomPage />
        </Suspense>
      ),
    },
    {
      path: '/roomList',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <RoomListPage />
        </Suspense>
      ),
    },
    {
      path: '/roomList/room/:room_ID',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <RoomComponent />
        </Suspense>
      ),
    },

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
