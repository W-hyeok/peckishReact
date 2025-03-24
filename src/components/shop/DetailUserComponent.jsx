import React, { useCallback, useEffect, Fragment, useState } from 'react';
import { API_SERVER_HOST } from '../../api/todoApi';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { StarIcon } from '@heroicons/react/20/solid';
import { Navigate, useNavigate } from 'react-router-dom';
import { Map as KakaoMap, MapMarker } from 'react-kakao-maps-sdk';
import '../../css/animate.css';
import '../../css/hoverText.css';
import '../../css/scrollbar.css';
import '../../css/scrollbar2.css';
import { useTimeStamp } from '../../hooks/useTimeAgo';
import useCustomMove from '../../hooks/useCustomMove';
import AddReviewModal from '../common/AddReviewModal';
import AddMenuModal from '../common/AddMenuModal';
import { deleteMenu, getMenuList } from '../../api/shopApi';
import DetailUserMenuComponent from './DetailUserMenuComponent';
import DetailUserReviewComponent from '../review/DetailUserReviewComponent';
import { deleteReview, getReview, getUserRating } from '../../api/reviewApi';
import ResultModal from '../common/ResultModal';
import RemoveModal from '../common/RemoveModal';
import { getCookie } from '../../util/cookieUtil';

const host = `${API_SERVER_HOST}`;

const days = [
  { id: 1, name: '월요일' },
  { id: 2, name: '화요일' },
  { id: 3, name: '수요일' },
  { id: 4, name: '목요일' },
  { id: 5, name: '금요일' },
  { id: 6, name: '토요일' },
  { id: 7, name: '일요일' },
];

const DetailUserComponent = ({
  shop,
  shopDetailId,
  shopId,
  infoType,
  membercookie,
  mapData,
  storeLoc,
}) => {
  const [menuItems, setMenuItems] = useState([]);
  const [review, setReview] = useState([]);
  const [ratingAvg, setRatingAvg] = useState(null);
  const [result, setResult] = useState(null);
  const [menuRefresh, setMenuRefresh] = useState(false);
  const [reviewRefresh, setReviewRefresh] = useState(false);
  const [menuFetch, setMenuFetch] = useState(false);
  const [reviewFetch, setReviewFetch] = useState(false);

  const { moveToUserShopModify } = useCustomMove();
  const daysData = (() => {
    const raw = shop.shopUserDTO.days;
    if (typeof raw === 'string') {
      if (raw.trim().startsWith('[')) {
        try {
          return JSON.parse(raw);
        } catch (e) {
          return raw
            .replace(/^\[|\]$/g, '')
            .split(',')
            .map((item) => item.trim());
        }
      } else {
        return raw.includes(',')
          ? raw.split(',').map((item) => item.trim())
          : [raw.trim()];
      }
    }
    return raw;
  })();

  useEffect(() => {
    getMenuList(shopId, infoType).then((data) => {
      setMenuFetch(false);
      setMenuItems(data.RESULT);
      setMenuFetch(true);
    });
  }, [shopId, infoType, menuRefresh]);

  useEffect(() => {
    setReviewFetch(false);
    getReview(shopId, infoType).then((data) => {
      setReview(data.Result);
      setReviewFetch(true);
    });
  }, [shopId, infoType, reviewRefresh]);

  useEffect(() => {
    getUserRating(shopId).then((data) => {
      setRatingAvg(data);
    });
  }, [shopId, infoType, reviewRefresh]);

  const handleClickReview = () => {
    setResult('review');
  };

  const handleClickAddMenu = () => {
    setResult('menu');
  };

  const handleMenuDelete = (menuId) => {
    deleteMenu(menuId, infoType).then(() => {
      setResult('menuRemove');
    });
  };

  const handleReviewRemove = (reviewId) => {
    deleteReview(reviewId, infoType)
      .then(() => setResult('reviewRemove'))
      .catch((err) => console.log('전송실패', err));
  };

  const closeModal = () => {
    setMenuRefresh((prev) => !prev);
    setReviewRefresh((prev) => !prev);
    setResult(null);
  };

  const handleUserShopModify = () => {
    moveToUserShopModify(shopId, shopDetailId);
  };

  const handleUserShopDelete = () => {
    setResult('shopRemove');
  };

  const navigate = useNavigate();
  const handelClickBack = () => {
    navigate(-1);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      {result === 'review' && (
        <AddReviewModal
          shopId={shopId}
          shopDetailId={shop.shopUserDTO.shopUserId}
          infoType={infoType}
          title={'리뷰 작성'}
          content={'리뷰를 작성해주세요'}
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
      {result === 'shopRemove' && (
        <RemoveModal
          title={'상점 정보 삭제'}
          content={'상점 정보를 삭제하시겠습니까?'}
          callbackFn={closeModal}
          shopId={shopId}
          infoType={infoType}
          shopDetailId={shopDetailId}
        />
      )}

      {/* 상단 정보 섹션 */}
      <div className="mb-6">
        <div className="flex items-center flex-wrap">
          <div className="flex space-x-1">
            {[0, 1, 2, 3, 4].map((index) => {
              const wholeStars = Math.floor(ratingAvg);
              const hasHalfStar = ratingAvg % 1 >= 0.5;
              return (
                <span key={index} className="relative flex">
                  {index < wholeStars ? (
                    <StarIcon className="h-6 w-6 text-yellow-400" />
                  ) : index === wholeStars && hasHalfStar ? (
                    <div className="relative w-6 h-6">
                      <StarIcon className="h-6 w-6 text-gray-300 absolute" />
                      <StarIcon
                        className="h-6 w-6 text-yellow-400 absolute left-0 top-0"
                        style={{ clipPath: 'inset(0 50% 0 0)' }}
                      />
                    </div>
                  ) : (
                    <StarIcon className="h-6 w-6 text-gray-300" />
                  )}
                </span>
              );
            })}
          </div>
          <span className="text-base font-semibold text-gray-800 ml-2">
            ({typeof ratingAvg === 'number' ? ratingAvg.toFixed(1) : '0.0'})
          </span>
          {ratingAvg === 0 || ratingAvg === '0.0' ? (
            <p className="text-base font-semibold text-red-500 ml-2">
              첫 리뷰를 작성해주세요!
            </p>
          ) : null}
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center mt-2">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-gray-900 mb-4 whitespace-nowrap overflow-visible">
            {shop.shopUserDTO.title}
          </h1>
          <p className="text-sm sm:text-lg text-gray-700">
            최근 수정: {useTimeStamp(shop.shopUserDTO.updateDate)}
          </p>
        </div>
      </div>

      {/* 이미지/지도 섹션 */}
      <div className="mt-4 w-full max-w-5xl mx-auto h-[40vh] sm:h-[50vh] overflow-hidden">
        <img
          alt={shop.shopUserDTO.title}
          src={`${host}/api/shop/view/${shop.shopUserDTO.filename}`}
          className="w-full h-full object-contain"
        />
      </div>

      {/* 탭 섹션 */}
      <div className="mt-6">
        <TabGroup>
          <div className="border-b border-gray-200">
            <TabList className="flex space-x-2">
              <Tab className="px-4 py-2 sm:px-6 sm:py-3 text-base sm:text-lg font-semibold border-2 border-yellow-500 bg-white rounded-t-md hover:bg-yellow-50 data-[selected]:bg-yellow-500 data-[selected]:text-white data-[selected]:border-yellow-500 outline-none">
                노점 정보
              </Tab>
              <Tab className="px-4 py-2 sm:px-6 sm:py-3 text-base sm:text-lg font-semibold border-2 border-yellow-500 bg-white rounded-t-md hover:bg-yellow-50 data-[selected]:bg-yellow-500 data-[selected]:text-white data-[selected]:border-yellow-500 outline-none">
                노점 메뉴
              </Tab>
              <Tab className="px-4 py-2 sm:px-6 sm:py-3 text-base sm:text-lg font-semibold border-2 border-yellow-500 bg-white rounded-t-md hover:bg-yellow-50 data-[selected]:bg-yellow-500 data-[selected]:text-white data-[selected]:border-yellow-500 outline-none">
                노점 리뷰
              </Tab>
            </TabList>
          </div>

          <TabPanels as={Fragment}>
            {/* 정보 탭 */}
            <TabPanel className="py-4 px-4 sm:px-6 rounded-lg mt-2 space-y-6 text-sm sm:text-base">
              <div className="space-y-6">
                <dl className="p-4 sm:p-6">
                  <dt className="text-lg sm:text-xl text-gray-900">위치</dt>
                  <dd>
                    <div id="mapWrap" className="mt-4 relative">
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
                  </dd>
                </dl>
                <dl className="p-4 sm:p-6">
                  <dt className="text-lg sm:text-xl text-gray-900">
                    영업일 & 영업시간
                  </dt>
                  <dd className="text-base sm:text-lg text-gray-700">
                    <div
                      className="block w-full rounded-md bg-white px-3 py-2 sm:px-4 sm:py-3 outline outline-1 outline-gray-300 focus:outline focus:outline-2 focus:outline-indigo-600"
                      style={{
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'inherit',
                        userSelect: 'none',
                      }}
                    >
                      {days.map((day) => {
                        const isOpen = daysData.includes(day.name);
                        const timeDisplay = isOpen
                          ? `${shop.shopUserDTO.openTime} - ${shop.shopUserDTO.closeTime}`
                          : '휴무';
                        return (
                          <div key={day.id}>
                            <span>{day.name} </span>
                            {isOpen ? (
                              <span>{timeDisplay}</span>
                            ) : (
                              <span className="text-red-500">
                                {timeDisplay}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </dd>
                </dl>
              </div>
              <div className="flex flex-col sm:flex-row justify-end items-center gap-2 mt-4">
                {membercookie.roleNames === 'ADMIN' && (
                  <button
                    onClick={handelClickBack}
                    className="px-4 py-2 bg-white text-red-500 text-base font-semibold rounded-md border-2 border-red-500 hover:bg-red-500 hover:text-white"
                  >
                    목록으로
                  </button>
                )}
                <button
                  onClick={handleUserShopModify}
                  className="px-4 py-2 bg-white text-blue-600 text-base font-semibold rounded-md border-2 border-blue-600 hover:bg-blue-600 hover:text-white"
                >
                  수정
                </button>
                {membercookie.email === shop.shopUserDTO.email && (
                  <button
                    onClick={handleUserShopDelete}
                    className="px-4 py-2 bg-white text-red-500 text-base font-semibold rounded-md border-2 border-red-500 hover:bg-red-500 hover:text-white"
                  >
                    삭제
                  </button>
                )}
              </div>
            </TabPanel>

            {/* 메뉴 탭 */}
            <TabPanel className="relative py-4 px-4 sm:px-6 pt-20 rounded-lg mt-4 text-sm sm:text-base">
              {menuItems.length > 0 && menuFetch ? (
                <DetailUserMenuComponent
                  menuItems={menuItems}
                  handleMenuDelete={handleMenuDelete}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-10">
                  <span className="text-4xl">🍽️</span>
                  <p className="mt-4">메뉴를 추가해주세요!</p>
                </div>
              )}
              <button
                type="button"
                onClick={handleClickAddMenu}
                className="absolute top-6 right-6 px-4 py-2 bg-white text-yellow-400 text-base font-semibold rounded-md border-2 border-yellow-400 hover:bg-yellow-400 hover:text-white"
              >
                메뉴 작성
              </button>
            </TabPanel>

            {/* 리뷰 탭 */}
            <TabPanel className="relative py-4 px-4 sm:px-6 pt-20 rounded-lg mt-4 text-sm sm:text-base">
              {review.length > 0 && reviewFetch ? (
                <DetailUserReviewComponent
                  shopId={shopId}
                  shopDetailId={shop.shopUserDTO.shopUserId}
                  infoType={infoType}
                  review={review}
                  handleReviewRemove={handleReviewRemove}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-10">
                  <span className="text-3xl">✏️</span>
                  <p className="mt-4">리뷰를 추가해주세요!</p>
                </div>
              )}
              <button
                type="button"
                onClick={handleClickReview}
                className="absolute top-6 right-6 px-4 py-2 bg-white text-yellow-400 text-base font-semibold rounded-md border-2 border-yellow-400 hover:bg-yellow-400 hover:text-white"
              >
                리뷰 작성
              </button>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
};

export default DetailUserComponent;
