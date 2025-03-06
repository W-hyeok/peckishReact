import { useRoutes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import LoadingPage from '../components/common/LoadingPage';

const ChatRoomPage = lazy(() => import('../pages/chat/ChatRoomPage'));
const chatRouter = () => {
  return useRoutes([]);
};

export default chatRouter;
