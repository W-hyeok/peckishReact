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
  const [menuItems, setMenuItems] = useState([]);
  const [updatedMenu, setUpdatedMenu] = useState([]);
  const [review, setReview] = useState([]);
  const [ratingAvg, setRatingAvg] = useState(null);
  const [result, setResult] = useState(null);
  const [menuRefresh, setMenuRefresh] = useState(false);
  const [reviewRefresh, setReviewRefresh] = useState(false);
  const [menuFetch, setMenuFetch] = useState(false);
  const [reviewFetch, setReviewFetch] = useState(false);

  useEffect(() => {
    getMenuList(shopId, infoType).then((data) => {
      setMenuFetch(false);
      console.log('메뉴 목록 :', data.RESULT);
      setMenuItems(data.RESULT);
      setMenuFetch(true);
    });
  }, [shopId, infoType, menuRefresh]);

  useEffect(() => {
    setReviewFetch(false);
    getReview(shopId, infoType).then((data) => {
      console.log('리뷰 목록 : ', data.Result);
      setReview(data.Result);
      setReviewFetch(true);
    });
  }, [shopId, infoType, reviewRefresh]);

  useEffect(() => {
    getUserRating(shopId).then((data) => {
      console.log('USER 리뷰 평균 : ', data);
      setRatingAvg(data);
    });
  }, [shopId, infoType, reviewRefresh]);

  // 리뷰 작성 모달
  const handleClickReview = () => {
    console.log('리뷰모달 보여줘라');
    setResult('review');
  };

  // 메뉴 작성 모달
  const handleClickAddMenu = () => {
    console.log('메뉴모달 보여줘라');
    setResult('menu');
  };

  // 메뉴 삭제
  const handleMenuDelete = (menuId) => {
    console.log('삭제할 menuId : ', menuId);
    deleteMenu(menuId, infoType).then((data) => {
      console.log('메뉴 삭제 : ', data.RESULT);
      setResult('menuRemove');
    });
  };

  // 리뷰 삭제
  const handleReviewRemove = (reviewId) => {
    deleteReview(reviewId, infoType)
      .then((data) => {
        console.log('리뷰 삭제:', data);
        setResult('reviewRemove');
      })
      .catch((err) => console.log('전송실패', err));
  };

  // 모달 닫기
  const closeModal = () => {
    setMenuRefresh((prev) => !prev);
    setReviewRefresh((prev) => !prev);
    setResult(null);
  };

  // 점포 수정페이지로 이동
  const { moveToUserShopModify } = useCustomMove();

  const handleUserShopModify = () => {
    console.log('User Shop - Modify');
    moveToUserShopModify(shopId);
  };

  // 점포 삭제처리
  const handleUserShopDelete = () => {
    console.log('User Shop - Delete');
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

      {/* 상품제목/별점/최근수정일자 */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1
            className="
              text-2xl
              sm:text-3xl
              font-bold
              tracking-tight
              text-gray-900
              mb-2 sm:mb-0
              leading-tight
              overflow-visible
            "
          >
            {shop.shopUserDTO.title}
          </h1>
          <p className="text-base text-gray-700">
            최근 수정: {useTimeStamp(shop.shopUserDTO.updateDate)}
          </p>
        </div>
        <div className="flex items-center">
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
        </div>
      </div>

      {/* 사진 컨테이너 */}
      <div className="mt-4 w-full max-w-5xl mx-auto h-[50vh] overflow-hidden">
        <img
          alt={shop.shopUserDTO.title}
          src={`${host}/api/shop/view/${shop.shopUserDTO.filename}`}
          className="w-full h-full object-contain"
        />
      </div>

      {/* 탭 섹션 */}
      <div className="mt-6 w-full mx-auto max-w-7xl px-4">
        <TabGroup>
          <div className="border-b border-gray-200">
            <TabList className="flex space-x-2">
              <Tab
                className="
                  px-4 py-2
                  text-base font-medium
                  border-2 border-yellow-500
                  text-gray-700
                  bg-white
                  rounded-t-md
                  hover:bg-yellow-50
                  data-[selected]:bg-yellow-500
                  data-[selected]:text-white
                  data-[selected]:border-yellow-500
                  outline-none
                  transition-colors duration-200
                "
              >
                노점 정보
              </Tab>
              <Tab
                className="
                  px-4 py-2
                  text-base font-medium
                  border-2 border-yellow-500
                  text-gray-700
                  bg-white
                  rounded-t-md
                  hover:bg-yellow-50
                  data-[selected]:bg-yellow-500
                  data-[selected]:text-white
                  data-[selected]:border-yellow-500
                  outline-none
                  transition-colors duration-200
                "
              >
                노점 메뉴
              </Tab>
              <Tab
                className="
                  px-4 py-2
                  text-base font-medium
                  border-2 border-yellow-500
                  text-gray-700
                  bg-white
                  rounded-t-md
                  hover:bg-yellow-50
                  data-[selected]:bg-yellow-500
                  data-[selected]:text-white
                  data-[selected]:border-yellow-500
                  outline-none
                  transition-colors duration-200
                "
              >
                노점 리뷰
              </Tab>
            </TabList>
          </div>

          <TabPanels as={Fragment}>
            {/* 정보 탭 */}
            <TabPanel className="text-base text-gray-600 py-4 px-4 rounded-lg mt-2 space-y-6">
              <div className="space-y-6">
                <dl className="p-4 bg-white rounded-lg">
                  <dt className="text-xl text-gray-900">위치</dt>
                  <dd>
                    <div id="mapWrap" className="mt-4 relative">
                      <KakaoMap
                        center={storeLoc.center}
                        isPanto={storeLoc.isPanto}
                        style={{
                          width: '100%',
                          height: '40vh',
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
                            title="점포 위치에용"
                          />
                        )}
                      </KakaoMap>
                    </div>
                  </dd>
                </dl>
                <dl className="p-4 bg-white rounded-lg">
                  <dt className="text-xl text-gray-900">영업일</dt>
                  <dd className="text-lg text-gray-700">
                    <input
                      name="title"
                      type="text"
                      value={shop.shopUserDTO.days}
                      autoComplete="street-address"
                      className="block w-full rounded-md bg-white px-4 py-3 text-lg text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-none focus:outline-2 focus:outline-indigo-600"
                    />
                  </dd>
                </dl>
                <dl className="p-4 bg-white rounded-lg">
                  <dt className="text-xl text-gray-900">영업시간</dt>
                  <dd className="text-lg text-gray-700">
                    <input
                      name="title"
                      type="text"
                      value={`${shop.shopUserDTO.openTime} ~ ${shop.shopUserDTO.closeTime}`}
                      autoComplete="street-address"
                      className="block w-full rounded-md bg-white px-4 py-3 text-lg text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-none focus:outline-2 focus:outline-indigo-600"
                    />
                  </dd>
                </dl>
              </div>
            </TabPanel>

            {/* 메뉴 탭 */}
            <TabPanel className="relative text-base text-gray-600 py-4 px-4 pt-20 rounded-lg mt-4">
              <h3 className="sr-only">User Menu</h3>
              {menuItems.length > 0 && menuFetch ? (
                <DetailUserMenuComponent
                  menuItems={menuItems}
                  handleMenuDelete={handleMenuDelete}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-10">
                  <span className="text-5xl">🍽️</span>
                  <p className="mt-4">메뉴를 추가해주세요!</p>
                </div>
              )}
              <button
                type="button"
                onClick={handleClickAddMenu}
                className="absolute top-6 right-6 inline-flex items-center justify-center h-fit w-fit px-4 py-2 bg-white text-yellow-400 text-base font-medium rounded-[8px] mt-3 border-[2px] border-yellow-400 hover:bg-yellow-400 hover:text-white"
              >
                메뉴 작성
              </button>
            </TabPanel>

            {/* 리뷰 탭 */}
            <TabPanel className="relative text-base text-gray-600 py-4 px-4 pt-20 rounded-lg mt-4">
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
                <div className="flex flex-col items-center justify-center py-10 text-gray-600">
                  <span className="text-3xl">✏️</span>
                  <p className="mt-4 text-lg">리뷰를 추가해주세요!</p>
                </div>
              )}
              <button
                type="button"
                onClick={handleClickReview}
                className="absolute top-6 right-6 inline-flex items-center justify-center h-fit w-fit px-4 py-2 bg-white text-yellow-400 text-base font-medium rounded-[8px] mt-3 border-[2px] border-yellow-400 hover:bg-yellow-400 hover:text-white"
              >
                리뷰 작성
              </button>
            </TabPanel>
          </TabPanels>
        </TabGroup>

        <div className="flex justify-end space-x-4 mt-2">
          <button
            onClick={handleUserShopModify}
            className="h-fit w-fit px-4 py-2 bg-white text-blue-600 text-base font-medium rounded-[8px] mt-6 border-[2px] border-blue-600 hover:bg-blue-600 hover:text-white"
          >
            수정
          </button>
          <button
            onClick={handleUserShopDelete}
            className="h-fit w-fit px-4 py-2 bg-white text-red-500 text-base font-medium rounded-[8px] mt-6 border-[2px] border-red-500 hover:bg-red-500 hover:text-white"
          >
            삭제
          </button>
        </div>
      </div>
    </>
  );
};

export default DetailUserComponent;
