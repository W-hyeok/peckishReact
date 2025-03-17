import React, { useState, useEffect, Fragment } from 'react';
import { API_SERVER_HOST } from '../../api/todoApi';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { StarIcon } from '@heroicons/react/20/solid';
import { useTimeStamp } from '../../hooks/useTimeAgo';
import { Map as KakaoMap, MapMarker } from 'react-kakao-maps-sdk';
import '../../css/animate.css';
import '../../css/hoverText.css';
import '../../css/scrollbar.css';
import '../../css/scrollbar2.css';

import AddMenuModal from '../common/AddMenuModal';
import { deleteMenu, getMenuList } from '../../api/shopApi';
import DetailUserMenuComponent from './DetailUserMenuComponent';
import DetailUserReviewComponent from '../review/DetailUserReviewComponent';
import { deleteReview, getReview, getUserRating } from '../../api/reviewApi';
import ResultModal from '../common/ResultModal';

const host = `${API_SERVER_HOST}`;

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const DetailUserComponent = ({
  shop,
  shopId,
  infoType,
  mapData,
  storeLoc,
  memberCookie,
}) => {
  const [menuItems, setMenuItems] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [ratingAvg, setRatingAvg] = useState(null);
  const [result, setResult] = useState(null);

  // DB에서 메뉴, 리뷰, 별점 데이터를 새로 불러오는 함수
  const refreshData = () => {
    // 메뉴 목록 불러오기
    getMenuList(shopId, infoType).then((data) => {
      setMenuItems(data.RESULT);
      console.log('메뉴 목록:', data.RESULT);
    });
    // 리뷰 목록 불러오기
    getReview(shopId, infoType).then((data) => {
      setReviews(data.Result);
      console.log('리뷰 목록:', data.Result);
    });
    // 리뷰 평균 별점 불러오기
    getUserRating(shopId).then((data) => {
      console.log('USER 리뷰 평균:', data);
      setRatingAvg(data);
    });
  };

  // 초기 데이터 로드
  useEffect(() => {
    refreshData();
  }, [shopId, infoType]);

  // 리뷰 삭제
  const handleReviewRemove = (reviewId) => {
    deleteReview(reviewId, infoType)
      .then((data) => {
        console.log('리뷰 삭제:', data.RESULT);
        refreshData();
        setResult('reviewRemove');
      })
      .catch((err) => console.log('전송실패', err));
  };

  // 메뉴 삭제
  const handleMenuRemove = (menuId) => {
    deleteMenu(menuId, infoType).then((data) => {
      console.log('메뉴 삭제:', data.RESULT);
      refreshData();
      setResult('menuRemove');
    });
  };

  // 모달 닫기 (메뉴 추가 후 또는 삭제 후)
  const closeModal = () => {
    setResult(null);
    refreshData();
  };

  // 메뉴 추가 모달 열기
  const handleClickAddMenu = () => {
    console.log('메뉴모달 보여줘라');
    setResult('menu');
  };

  return (
    <>
      {result === 'reviewRemove' && (
        <ResultModal
          title={'리뷰 삭제'}
          content={`리뷰를 삭제했습니다!`}
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
          content={'메뉴를 삭제했습니다!'}
          callbackFn={closeModal}
        />
      )}

      <div className="lg:grid lg:grid-cols-10 lg:gap-x-8 xl:gap-x-12">
        {/* Left Layout: 카카오맵 */}
        <div className="lg:col-span-5 lg:row-end-1">
          <div id="mapWrap">
            <KakaoMap
              center={storeLoc.center}
              isPanto={storeLoc.isPanto}
              style={{
                width: '100%',
                height: '35vh',
                borderRadius: '15px',
              }}
              level={3}
              draggable={false}
            >
              {!storeLoc.isLoading && (
                <MapMarker
                  position={storeLoc.center}
                  image={{
                    src: '../../src/assets/icon/booth_active.png',
                    size: { width: 48, height: 48 },
                  }}
                  title="점포 위치"
                />
              )}
            </KakaoMap>
          </div>
        </div>

        {/* Right Layout: 상점 정보, 메뉴, 리뷰 */}
        <div className="mx-auto mt-4 sm:mt-12 lg:col-span-8 lg:row-span-2 lg:row-end-2 lg:mt-0 lg:max-w-2/3 lg:px-8">
          <div className="lg:col-span-4 lg:row-end-1">
            <div className="mt-4">
              <div className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                <h1 className="scrollbar">{shop.shopUserDTO.title}</h1>
                <h3 className="sr-only">Reviews</h3>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-0.5">
                    {[0, 1, 2, 3, 4].map((index) => {
                      const wholeStars = Math.floor(ratingAvg || 0);
                      const hasHalfStar = (ratingAvg || 0) % 1 >= 0.5;
                      return (
                        <span key={index} className="relative flex">
                          {index < wholeStars ? (
                            <StarIcon className="size-6 text-yellow-400" />
                          ) : index === wholeStars && hasHalfStar ? (
                            <div className="relative w-6">
                              <StarIcon className="size-6 text-gray-300 absolute" />
                              <StarIcon
                                className="size-6 text-yellow-400 absolute left-0 top-0"
                                style={{ clipPath: 'inset(0 50% 0 0)' }}
                              />
                            </div>
                          ) : (
                            <StarIcon className="size-6 text-gray-300" />
                          )}
                        </span>
                      );
                    })}
                  </div>
                  <span className="text-lg font-semibold text-gray-800">
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
                <span>{useTimeStamp(shop.shopUserDTO.updateDate)}</span>
              </p>
              <div className="col-span-full">
                <div className="mt-2 flex justify-center rounded-lg px-6 py-10">
                  <img
                    alt={shop.shopUserDTO.title}
                    src={`${host}/api/shop/view/${shop.shopUserDTO.filename}`}
                    className="mx-auto rounded-lg max-w-full h-auto"
                    style={{ width: '400px', height: '300px' }}
                  />
                </div>
              </div>

              {/* Tab 메뉴: 정보 / 메뉴 / 리뷰 */}
              <div className="mt-4 grid grid-cols-1 gap-y-8 sm:grid-cols-2 sm:gap-x-4">
                <div className="sm:col-span-6">
                  <TabGroup>
                    <div className="border-b border-gray-200 px-6">
                      <TabList className="-mb-px flex space-x-8">
                        <Tab className="whitespace-nowrap border-b-2 border-transparent py-2 text-sm font-medium text-gray-700 hover:border-gray-300 hover:text-gray-800 data-[selected]:border-indigo-600 data-[selected]:text-indigo-600">
                          정보
                        </Tab>
                        <Tab className="whitespace-nowrap border-b-2 border-transparent py-2 text-sm font-medium text-gray-700 hover:border-gray-300 hover:text-gray-800 data-[selected]:border-indigo-600 data-[selected]:text-indigo-600">
                          메뉴
                        </Tab>
                        <Tab className="whitespace-nowrap border-b-2 border-transparent py-2 text-sm font-medium text-gray-700 hover:border-gray-300 hover:text-gray-800 data-[selected]:border-indigo-600 data-[selected]:text-indigo-600">
                          리뷰
                        </Tab>
                      </TabList>
                    </div>
                    <TabPanels as={Fragment}>
                      {/* 정보 탭 */}
                      <TabPanel className="text-sm text-gray-500 py-3 px-6 rounded-lg">
                        <div className="space-y-4">
                          <dl className="p-4 bg-white rounded-lg">
                            <dt className="text-lg text-gray-900">영업일:</dt>
                            <dd className="text-md text-gray-700">
                              {shop.shopUserDTO.days}
                            </dd>
                          </dl>
                          <dl className="p-4 bg-white rounded-lg">
                            <dt className="text-lg text-gray-900">영업시간:</dt>
                            <dd className="text-md text-gray-700">
                              {shop.shopUserDTO.openTime} ~{' '}
                              {shop.shopUserDTO.closeTime}
                            </dd>
                          </dl>
                        </div>
                      </TabPanel>
                      {/* 메뉴 탭 */}
                      <TabPanel className="text-sm text-gray-500 py-3 px-6 rounded-lg">
                        <div className="flex justify-end mb-4">
                          <button
                            type="button"
                            onClick={handleClickAddMenu}
                            className="inline-flex items-center justify-center rounded-md border border-transparent bg-yellow-500 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300"
                          >
                            메뉴 추가
                          </button>
                        </div>
                        <div className="overflow-x-hidden">
                          {menuItems && menuItems.length > 0 ? (
                            <DetailUserMenuComponent
                              menuItems={menuItems}
                              handleMenuRemove={handleMenuRemove}
                            />
                          ) : (
                            <p className="text-center mt-2 text-gray-600">
                              메뉴를 추가해주세요!
                            </p>
                          )}
                        </div>
                      </TabPanel>
                      {/* 리뷰 탭 */}
                      <TabPanel className="min-h-[400px] w-full">
                        <h3 className="sr-only">Customer Reviews</h3>
                        {reviews && reviews.length > 0 ? (
                          <DetailUserReviewComponent
                            review={reviews}
                            memberCookie={memberCookie}
                            shopId={shopId}
                            shopDetailId={shop.shopUserDTO.shopUserId}
                            infoType={infoType}
                            handleReviewRemove={handleReviewRemove}
                            handleReviewAdded={refreshData} // 리뷰 저장 후 DB 최신 데이터 불러오기
                          />
                        ) : (
                          <p className="text-center mt-2 text-gray-600">
                            리뷰를 추가해주세요!
                          </p>
                        )}
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
