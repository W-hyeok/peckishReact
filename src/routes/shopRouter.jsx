import { lazy, Suspense } from 'react';
import LoadingPage from '../components/common/LoadingPage';

const AddShop = lazy(() => import('../pages/shop/AddShopPage'));
const AddShopExtraUSER = lazy(
  () => import('../pages/shop/AddShopExtraUSERPage')
);
const AddShopExtraOWNER = lazy(
  () => import('../pages/shop/AddShopExtraOWNERPage')
);
const AddMenu = lazy(() => import('../pages/shop/AddMenuPage'));
const ModifyShop = lazy(() => import('../pages/shop/ModifyPage'));
const DetailShop = lazy(() => import('../pages/shop/DetailPage'));
const DetailShopMoon = lazy(() => import('../pages/shop/DetailPageMoon'));
// const DetailMenuShop = lazy(() => import('../pages/shop/MenuPage'));
const DetailReviewShop = lazy(() => import('../pages/shop/ReviewPage'));

// 화면상에 보이는 URL
const shopRouter = () => {
  return [
    {
      // 최초 상점 등록
      path: 'add',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <AddShop />
        </Suspense>
      ),
    },
    {
      // 인증 O -> 제보 정보 추가
      path: 'add/:shopId/USER',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <AddShopExtraUSER />
        </Suspense>
      ),
    },
    {
      // 제보 O -> 인증 정보 추가
      path: 'add/:shopId/OWNER',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <AddShopExtraOWNER />
        </Suspense>
      ),
    },

    {
      // infoType에 따른 메뉴 추가
      path: 'addMenu/:shopId/:shopDetailId/:infoType',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <AddMenu />
        </Suspense>
      ),
    },
    {
      // 상점 상세보기
      path: 'detail/:shopId',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <DetailShop />
        </Suspense>
      ),
    },
    {
      // 상점 상세보기
      path: 'detailMoon/:email',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <DetailShopMoon />
        </Suspense>
      ),
    },
    {
      // 메뉴 상세보기
      path: 'detail/menu',
      element: (
        <Suspense fallback={<LoadingPage />}>
          {/* <DetailMenuShop /> */}
        </Suspense>
      ),
    },
    {
      // infoType에 따라 상점 정보 수정
      path: 'modify/:shopId/:shopDetailId/:infoType',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <ModifyShop />
        </Suspense>
      ),
    },
    {
      // 리뷰 보기
      path: 'detail/review',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <DetailReviewShop />
        </Suspense>
      ),
    },
  ];
};

export default shopRouter;
