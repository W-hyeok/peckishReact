import { lazy, Suspense } from 'react';
import LoadingPage from '../components/common/LoadingPage';
import { getCookie } from '../util/cookieUtil';
import LoginRequired from './loginRequiredRouter';

const AddShop = lazy(() => import('../pages/shop/AddShopPage'));
const AddShopExtraUSER = lazy(
  () => import('../pages/shop/AddShopExtraUSERPage')
);
const AddShopExtraOWNER = lazy(
  () => import('../pages/shop/AddShopExtraOWNERPage')
);
// const AddMenu = lazy(() => import('../pages/shop/AddMenuPage'));
const ModifyShop = lazy(() => import('../pages/shop/ModifyPage'));
const DetailShop = lazy(() => import('../pages/shop/DetailPage'));
const DetailShopMoon = lazy(() => import('../pages/shop/DetailPageMoon'));
// const DetailMenuShop = lazy(() => import('../pages/shop/MenuPage'));
//const DetailReviewShop = lazy(() => import('../pages/shop/ReviewPage'));

// 화면상에 보이는 URL
const shopRouter = () => {
  // 등록, 수정 등은 로그인 해야 접속 가능
  return [
    {
      // 최초 상점 등록
      path: 'add',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <LoginRequired>
            <AddShop />
          </LoginRequired>
        </Suspense>
      ),
    },
    {
      // 인증 O -> 제보 정보 추가
      path: 'add/:shopId/USER',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <LoginRequired>
            <AddShopExtraUSER />
          </LoginRequired>
        </Suspense>
      ),
    },
    {
      // 제보 O -> 인증 정보 추가
      path: 'add/:shopId/OWNER',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <LoginRequired>
            <AddShopExtraOWNER />
          </LoginRequired>
        </Suspense>
      ),
    },

    // {
    //   // infoType에 따른 메뉴 추가
    //   path: 'addMenu/:shopId/:shopDetailId/:infoType',
    //   element: (
    //     <Suspense fallback={<LoadingPage />}>
    //       {/* <LoginRequired> */}
    //       <AddMenu />
    //       {/* </LoginRequired> */}
    //     </Suspense>
    //   ),
    // },
    {
      // infoType에 따라 상점 정보 수정
      path: 'modify/:shopId/:shopDetailId/:infoType',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <LoginRequired>
            <ModifyShop />
          </LoginRequired>
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
    // {
    //   // 메뉴 상세보기
    //   path: 'detail/menu',
    //   element: (
    //     <Suspense fallback={<LoadingPage />}>
    //       {/* <DetailMenuShop /> */}
    //     </Suspense>
    //   ),
    // },
  ];
};

export default shopRouter;
