import React, { lazy, Suspense } from 'react';
import LoadingPage from '../components/common/LoadingPage';

const AddReview = lazy(() => import('../pages/review/AddReviewPage'));

const reviewRouter = () => {
  return [
    {
      //  리뷰 등록
      path: '/review/:shopId/:shopDetailId/:infoType',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <AddReview />
        </Suspense>
      ),
    },
  ];
};
export default reviewRouter;
