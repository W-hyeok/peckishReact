import { lazy, Suspense } from 'react';
import LoadingPage from '../components/common/LoadingPage';
import { Navigate } from 'react-router-dom';

// Todo의 하위 경로 라우팅 설정 파일 = 파일 분리

const TodoList = lazy(() => import('../pages/todo/ListPage'));
const TodoAdd = lazy(() => import('../pages/todo/AddPage'));
const TodoRead = lazy(() => import('../pages/todo/ReadPage'));
const TodoModify = lazy(() => import('../pages/todo/ModifyPage'));

const todoRouter = () => {
  return [
    {
      path: 'list',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <TodoList />
        </Suspense>
      ),
    },
    {
      path: '',
      element: <Navigate replace to="list" />,
    },
    {
      path: 'add',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <TodoAdd />
        </Suspense>
      ),
    },
    {
      path: 'read/:tno',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <TodoRead />
        </Suspense>
      ),
    },
    {
      path: 'modify/:tno',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <TodoModify />
        </Suspense>
      ),
    },
  ];
};

export default todoRouter;
