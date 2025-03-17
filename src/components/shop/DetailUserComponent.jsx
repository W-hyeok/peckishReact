import React, { useCallback, useEffect } from 'react';
import { API_SERVER_HOST } from '../../api/todoApi';
import { Fragment, useState } from 'react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { StarIcon } from '@heroicons/react/20/solid';
import { useNavigate } from 'react-router-dom';
import {
  Map as KakaoMap,
  MapMarker,
  MapTypeControl,
  MarkerClusterer,
  Toolbox,
  useMap,
} from 'react-kakao-maps-sdk';
import '../../css/animate.css'; // 스크롤 애니메이션용 css
import '../../css/hoverText.css'; // 텍스트 잘림 방지
import '../../css/scrollbar.css';
import '../../css/scrollbar2.css';
import { useTimeStamp } from '../../hooks/useTimeAgo';
import useCustomMove from '../../hooks/useCustomMove';
import AddReviewModal from '../common/AddReviewModal';
import AddMenuModal from '../common/AddMenuModal';
import { deleteMenu, getMenuList } from '../../api/shopApi';
import DetailUserMenuComponent from './DetailUserMenuComponent';
import DetailUserReviewComponent from '../review/DetailUserReviewComponent';
import {
  deleteReview,
  getReview,
  getUserRating,
  updateReview,
} from '../../api/reviewApi';
import ResultModal from '../common/ResultModal';

const host = `${API_SERVER_HOST}`;

const { kakao } = window;

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const DetailUserComponent = ({ shop, shopId, infoType, mapData, storeLoc }) => {
  // 메뉴 목록 뿌려줄때 필요한 것들
  const [menuItems, setMenuItems] = useState([]);
  const [updatedMenu, setUpdatedMenu] = useState([]);

  // useEffect(() => {
  //   setMenuItems(updatedMenu);
  // }, [updatedMenu]); // updatedMenu가 변경될 때만 실행

  // 리뷰 목록 뿌려줄때 필요한 것들
  const [review, setReview] = useState([]);

  // 리뷰 별점계산
  const [ratingAvg, setRatingAvg] = useState(null);
  const [result, setResult] = useState(null); // 모달 띄워주기 위해서
  const [menuRefresh, setMenuRefresh] = useState(false);
  const [reviewRefresh, setReviewRefresh] = useState(false);
  const [menuFetch, setMenuFetch] = useState(false); // 시간차
  const [reviewFetch, setReviewFetch] = useState(false); // 시간차

  // DB에서 메뉴목록 불러오기
  useEffect(() => {
    getMenuList(shopId, infoType).then((data) => {
      setMenuFetch(false);
      console.log('메뉴 목록 :', data.RESULT);
      setMenuItems(data.RESULT); // DB에서 가져온 목록을 menuItems state에 저장
      setMenuFetch(true);
    });
  }, [shopId, infoType, menuRefresh]);

  // DB에서 리뷰목록 불러오기
  useEffect(() => {
    setReviewFetch(false);
    getReview(shopId, infoType).then((data) => {
      console.log('리뷰 목록 : ', data.Result);
      setReview(data.Result);
      setReviewFetch(true);
    });
  }, [shopId, infoType, reviewRefresh]);

  //USER - 리뷰 평점 계산
  useEffect(() => {
    getUserRating(shopId).then((data) => {
      console.log('USER 리뷰 평균 : ', data);
      setRatingAvg(data);
    });
  }, [shopId, infoType, reviewRefresh]);

  //console.log(mapData);
  //console.log(storeLoc);

  // 리뷰 추가 버튼 클릭시 이벤트
  const handleClickReview = () => {
    console.log('리뷰모달 보여줘라');
    setResult('review');
  };

  // 메뉴 추가 버튼 클릭시 이벤트
  const handleClickAddMenu = () => {
    console.log('메뉴모달 보여줘라');
    setResult('menu');
  };

  // 메뉴 삭제
  const handleMenuDelete = (menuId) => {
    console.log('삭제할 menuId : ', menuId);
    deleteMenu(menuId, infoType).then((data) => {
      console.log('메뉴 삭제 : ', data.RESULT);
      // 메뉴 항목 업데이트 후 즉시 화면에 반영
      // menu.menuId :
      // 외부에서 전달된 menuId랑 비교해서 두 값이 다를 때 true
      // 외부에서 전달된 menuId와 일치하지 않는 메뉴들만 남겨서 새로운 배열 반환

      // setMenuItems((prevItems) =>
      //   prevItems.filter((menu) => menu.menuId !== menuId)
      // );

      setResult('menuRemove');
      //setMenuRefresh((prev) => !prev);
    });
  };

  // 리뷰 삭제
  const handleReviewRemove = (reviewId) => {
    deleteReview(reviewId, infoType)
      .then((data) => {
        console.log('리뷰 삭제:', data);
        setResult('reviewRemove');
        // setReview((prevItems) =>
        //   prevItems.filter((review) => review.reviewId != reviewId)
        // );
      })
      .catch((err) => console.log('전송실패', err));
  };

  const closeModal = () => {
    // 메뉴와 리뷰목록 다시 DB에서 가져오기 시키기위해 state값 변경
    setMenuRefresh((prev) => !prev);
    setReviewRefresh((prev) => !prev);
    setResult(null);
  };

  return (
    <>
      {result === 'review' && (
        <AddReviewModal
          shopId={shopId}
          shopDetailId={shop.shopUserDTO.shopUserId}
          infoType={infoType}
          title={'리뷰 작성'}
          content={`리뷰를 작성해주세요`}
          callbackFn={closeModal}
        />
      )}

      {result === 'menu' && (
        <AddMenuModal
          shopId={shopId}
          shopDetailId={shop.shopUserDTO.shopUserId}
          infoType={infoType}
          callbackFn={closeModal}
        />
      )}

      {result === 'menuRemove' && (
        <ResultModal
          title={'메뉴 삭제'}
          content={'메뉴가 삭제되었습니다'}
          callbackFn={closeModal}
        />
      )}

      {result === 'reviewRemove' && (
        <ResultModal
          title={'리뷰 삭제'}
          content={'리뷰가 삭제되었습니다'}
          callbackFn={closeModal}
        />
      )}

      {/* Product USER */}
      <div className="lg:grid lg:grid-cols-1 lg:gap-x-12 xl:gap-x-16">
        {/* Product image */}
        <div className="lg:col-span-2 lg:row-end-1">
          <div id="mapWrap">
            {/* 첫번째 레이아웃 */}
            {/* 카카오맵 */}
            <KakaoMap
              center={storeLoc.center} // state값에 따라 지도 중심 설정 (state: 페이지 로딩, 검색 시 변동)
              isPanto={storeLoc.isPanto}
              style={{
                width: '100%',
                height: '35vh', // v: view height
                borderRadius: '15px',

                // position: 'relative', // 지도 위에 버튼 깔기 위해 설정
                // float: 'right', // 상동
              }}
              level={3} // 확대 레벨
              draggable={false} // 지도 드래그 불가
            >
              {/* 현재 내 위치 마커. 모든 마커는 반드시 맵 다음에 와야 함 */}
              {!storeLoc.isLoading && (
                <MapMarker
                  position={storeLoc.center} // curLoc 값에 따라 마커 설정 (고정)
                  image={{
                    src: '../../src/assets/icon/booth_active.png',
                    size: {
                      width: 48,
                      height: 48,
                    },
                  }}
                  title="점포 위치에용"
                />
              )}
            </KakaoMap>
          </div>
        </div>

        {/* Product details */}
        <div className="mx-auto mt-7 max-w-2xl sm:mt-16 lg:col-span-3 lg:row-span-2 lg:row-end-2 lg:mt-0 lg:max-w-none">
          <div className="flex flex-col-reverse">
            <div className="mt-4">
              {/* 줄바꿈 없음, overflow 자동 (줄바꿈 필요해지면 스크롤바 생성됨) */}
              <div
                className={`text-2xl max-w-lg font-bold tracking-tight text-gray-900 sm:text-3xl`}
              >
                <h1 className="scrollbar">{shop.shopUserDTO.title}</h1>
                {/* 리뷰 별점 아이콘 */}
                <h3 className="sr-only">Reviews</h3>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-0.5">
                    {[0, 1, 2, 3, 4].map((index) => {
                      const wholeStars = Math.floor(ratingAvg); // 정수 별 개수
                      const hasHalfStar = ratingAvg % 1 >= 0.5; // 반쪽 별 여부

                      return (
                        <span key={index} className="relative flex">
                          {index < wholeStars ? (
                            <StarIcon className="size-5 text-yellow-400" />
                          ) : index === wholeStars && hasHalfStar ? (
                            <div className="relative w-5">
                              <StarIcon className="size-5 text-gray-300 absolute" />

                              <StarIcon
                                className="size-5 text-yellow-400 absolute left-0 top-0"
                                style={{ clipPath: 'inset(0 50% 0 0)' }}
                              />
                            </div>
                          ) : (
                            <StarIcon className="size-5 text-gray-300" />
                          )}
                        </span>
                      );
                    })}
                  </div>

                  <span className="text-sm font-semibold text-gray-800">
                    (
                    {typeof ratingAvg === 'number'
                      ? ratingAvg.toFixed(1)
                      : '0.0'}
                    )
                  </span>
                </div>
              </div>

              <h2 id="information-heading" className="sr-only">
                Product information
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                최근 수정:{' '}
                {/* <time dateTime={shop.shopUserDTO.updateDate}>
                {format(new Date(shop.shopUserDTO.updateDate), 'yyyy-MM-dd')}{' '}
                 </time> */}
                {/* customhook: 날짜 표기법 */}
                <span>{useTimeStamp(shop.shopUserDTO.updateDate)}</span>
              </p>
              <div className="col-span-full">
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <img
                    alt={shop.shopUserDTO.title}
                    src={`${host}/api/shop/view/${shop.shopUserDTO.filename}`}
                    className="mx-auto rounded-lg max-w-full h-auto"
                    style={{ width: '400px', height: '300px' }} // 이미지 크기 조정
                  />
                </div>
              </div>

              {/* tab */}
              <div className="mt-4 grid grid-cols-1 gap-y-8 sm:grid-cols-2 sm:gap-x-4">
                <div className="sm:col-span-2">
                  <TabGroup>
                    <div className="border-b border-gray-200">
                      <TabList className="-mb-px flex space-x-8">
                        <Tab className="whitespace-nowrap border-b-2 border-transparent py-2 mb-0 text-sm font-medium text-gray-700 hover:border-gray-300 hover:text-gray-800 data-[selected]:border-indigo-600 data-[selected]:text-indigo-600">
                          정보
                        </Tab>
                        <Tab className="whitespace-nowrap border-b-2 border-transparent py-2 mb-0 text-sm font-medium text-gray-700 hover:border-gray-300 hover:text-gray-800 data-[selected]:border-indigo-600 data-[selected]:text-indigo-600">
                          메뉴
                        </Tab>
                        <Tab className="whitespace-nowrap border-b-2 border-transparent py-2 mb-0 text-sm font-medium text-gray-700 hover:border-gray-300 hover:text-gray-800 data-[selected]:border-indigo-600 data-[selected]:text-indigo-600">
                          리뷰
                        </Tab>
                      </TabList>
                    </div>

                    <TabPanels as={Fragment}>
                      {/* 상점 정보 */}
                      <TabPanel className="text-sm text-gray-500 py-3 px-2 rounded-lg mt-0">
                        <h3 className="sr-only">상점 정보</h3>
                        <div className="space-y-4">
                          {/* 영업일 */}
                          <dl className="p-4 bg-white rounded-lg">
                            <dt className="text-lg font-semibold text-gray-900">
                              영업일:
                            </dt>
                            <dd className="text-md text-gray-700">
                              {shop.shopUserDTO.days}
                            </dd>
                          </dl>

                          {/* 영업시간 */}
                          <dl className="p-4 bg-white rounded-lg">
                            <dt className="text-lg font-semibold text-gray-900">
                              영업시간:
                            </dt>
                            <dd className="text-md text-gray-700">
                              {shop.shopUserDTO.openTime} ~{' '}
                              {shop.shopUserDTO.closeTime}
                            </dd>
                          </dl>
                        </div>
                      </TabPanel>

                      {/* 메뉴 */}
                      <TabPanel className="text-sm text-gray-500 py-3 px-4 rounded-lg mt-2">
                        <h3 className="sr-only">User Menu</h3>
                        {/* 메뉴 항목 목록 */}
                        {menuItems.length > 0 && menuFetch ? (
                          <DetailUserMenuComponent
                            menuItems={menuItems}
                            handleMenuDelete={handleMenuDelete}
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center py-10 text-gray-600 text-base">
                            <span className="text-4xl">🍽️</span>
                            <p className="mt-2">메뉴를 추가해주세요!</p>
                          </div>
                        )}

                        {/* 메뉴 추가 버튼 */}
                        <div className="flex">
                          <div className="mt-6 m-auto">
                            <button
                              type="button"
                              onClick={handleClickAddMenu}
                              className="inline-flex items-center justify-center rounded-md border border-transparent bg-yellow-500 px-8 py-3 text-base font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 transition-all duration-300"
                            >
                              메뉴 추가
                            </button>
                          </div>
                        </div>
                      </TabPanel>

                      {/* 리뷰 */}
                      <TabPanel className="min-h-[400px] w-full">
                        <h3 className="sr-only">User Reviews</h3>
                        {review.length > 0 && reviewFetch ? (
                          <DetailUserReviewComponent
                            shopId={shopId}
                            shopDetailId={shop.shopUserDTO.shopUserId}
                            infoType={infoType}
                            review={review}
                            handleReviewRemove={handleReviewRemove}
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center py-10 text-gray-600 text-base">
                            <span className="text-2xl">✏️</span>
                            <p className="mt-2">리뷰를 추가해주세요!</p>
                          </div>
                        )}

                        {/* 리뷰 작성 버튼 - 하단 고정 */}

                        <div className="sticky bottom-0 left-0 w-full bg-white  py-3 flex justify-center">
                          <button
                            type="button"
                            onClick={handleClickReview}
                            className="inline-flex items-center justify-center rounded-md border border-transparent bg-yellow-500 px-8 py-3 text-base font-medium text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-700 focus:ring-offset-2 focus:ring-offset-gray-50 transition-all duration-300"
                          >
                            리뷰 작성
                          </button>
                        </div>
                      </TabPanel>
                    </TabPanels>
                  </TabGroup>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailUserComponent;
