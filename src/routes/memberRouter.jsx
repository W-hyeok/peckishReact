import { lazy, Suspense } from 'react';
import LoadingPage from '../components/common/LoadingPage';
import { Navigate } from 'react-router-dom';

const Login = lazy(() => import('../pages/member/LoginPage'));
const Logout = lazy(() => import('../pages/member/LogoutPage'));
const KakakoRedirect = lazy(() => import('../pages/member/KakaoRedirectPage'));
const MemberModify = lazy(() => import('../pages/member/ModifyPage'));
const MemberAdd = lazy(() => import('../pages/member/AddPage'));
const MemberRead = lazy(() => import('../pages/member/ReadPage'));
const MemberModifyInfo = lazy(() => import('../pages/member/ModifyInfoPage'));
const MemberModifyPassword = lazy(
  () => import('../pages/member/ModifyPasswordPage')
);
const Leave = lazy(() => import('../pages/member/LeavePage'));
const SearchEmail = lazy(() => import('../pages/member/SearchEmailPage'));
const SearchPassword = lazy(() => import('../pages/member/SearchPasswordPage'));
const OpenClose = lazy(() => import('../pages/member/OpenClosePage'));

const memberRouter = () => {
  return [
    {
      path: 'add',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <MemberAdd />
        </Suspense>
      ),
    },
    {
      path: 'login',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <Login />
        </Suspense>
      ),
    },
    {
      path: '',
      element: <Navigate replace to="/member/login" />,
    },
    {
      path: 'logout',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <Logout />
        </Suspense>
      ),
    },
    {
      path: 'kakao',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <KakakoRedirect />
        </Suspense>
      ),
    },
    {
      path: 'read/:email',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <MemberRead />
        </Suspense>
      ),
    },
    {
      path: 'modify',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <MemberModify />
        </Suspense>
      ),
    },
    {
      path: 'modifyInfo/:email',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <MemberModifyInfo />
        </Suspense>
      ),
    },
    {
      path: 'modifyPassword/:email',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <MemberModifyPassword />
        </Suspense>
      ),
    },
    {
      path: 'leave',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <Leave />
        </Suspense>
      ),
    },
    {
      path: 'searchEmail',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <SearchEmail />
        </Suspense>
      ),
    },
    {
      path: 'searchPassword',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <SearchPassword />
        </Suspense>
      ),
    },
    {
      path: 'openClose/:email',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <OpenClose />
        </Suspense>
      ),
    },
  ];
};

export default memberRouter;
