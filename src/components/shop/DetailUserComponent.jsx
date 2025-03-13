import React, { useEffect } from 'react';
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
import { getReview, getUserRating } from '../../api/reviewApi';

const host = `${API_SERVER_HOST}`;
const { kakao } = window;

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const DetailUserComponent = ({ shop, shopId, infoType, mapData, storeLoc }) => {
  // 메뉴 목록 뿌려줄때 필요한 것들
  const [menuItems, setMenuItems] = useState([]);
  // 리뷰 목록 뿌려줄때 필요한 것들
  const [review, setReview] = useState([]);
  // 리뷰 별점계산
  const [ratingAvg, setRatingAvg] = useState(null);
  const [result, setResult] = useState(null); // 모달 띄워주기 위해서
  const [refresh, setRefresh] = useState(false);
  const [fetch, setFetch] = useState(false); // 시간차

  // DB에서 메뉴목록 불러오기
  useEffect(() => {
    getMenuList(shopId, infoType).then((data) => {
      setFetch(false);
      setMenuItems(data.RESULT); // DB에서 가져온 목록을 menuItems state에 저장
      setFetch(true);
      console.log('메뉴 목록 :', data.RESULT);
    });
  }, [shopId, infoType, refresh]);

  // DB에서 리뷰목록 불러오기
  useEffect(() => {
    getReview(shopId, infoType).then((data) => {
      setFetch(false);
      console.log('리뷰 목록 : ', data.Result);
      setReview(data.Result);
      setFetch(true);
    });
  }, [shopId, infoType, refresh]);

  // USER - 리뷰 평점 계산
  useEffect(() => {
    getUserRating(shopId).then((data) => {
      console.log('USER 리뷰 평균 : ', data);
      setRatingAvg(data);
    });
  });

  //console.log(mapData);
  //console.log(storeLoc);

  const closeModal = () => {
    setResult(null);
    setRefresh((prev) => !prev);
  };

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

  //메뉴 삭제 (받을 인자 값)
  const handleMenuRemove = (menuId) => {
    console.log('삭제할 menuId : ', menuId);
    deleteMenu(menuId, infoType).then((data) => {
      console.log('메뉴 삭제 : ', data.RESULT);
      // 메뉴 항목 업데이트 후 즉시 화면에 반영

      setMenuItems((prevItems) =>
        prevItems.filter((menu) => menu.menuId !== menuId)
      );
      setResult(false);
    });
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

      {/* Product USER */}
      <div className="lg:grid lg:grid-cols-4 lg:grid-rows-1 lg:gap-y-5">
        {/* Product image */}
        <div className="lg:col-span-2 lg:row-end-1">
          <img
            alt={shop.shopUserDTO.title}
            src={`${host}/api/shop/view/${shop.shopUserDTO.filename}`}
            className="aspect-[5/3] w-full rounded-lg bg-gray-100 object-cover"
            style={{ boxShadow: '3px 3px gray' }}
          />
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
            </div>
            {/* 리뷰 별점 아이콘 */}
            <h3 className="sr-only">Reviews</h3>
            <div className="flex items-center space-x-2">
              {/* ⭐ 별 아이콘 */}
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
                ({typeof ratingAvg === 'number' ? ratingAvg.toFixed(1) : '0.0'})
              </span>
            </div>
          </div>

          <div id="mapWrap">
            {/* 카카오맵 */}
            <KakaoMap
              center={storeLoc.center} // state값에 따라 지도 중심 설정 (state: 페이지 로딩, 검색 시 변동)
              isPanto={storeLoc.isPanto}
              style={{
                width: '100%',
                height: '35vh', // v: view height
                borderRadius: '15px',
                boxShadow: '3px 3px gray',
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
          <p className="mt-6 text-gray-700 text-lg">
            <span className="font-bold">위치: </span>
            {shop.shopUserDTO.location}
          </p>
        </div>

        {/* tab */}
        <div className="mx-auto mt-8 w-full max-w-2xl lg:col-span-2 lg:mt-0 lg:max-w-none">
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
                      {shop.shopUserDTO.openTime} ~ {shop.shopUserDTO.closeTime}
                    </dd>
                  </dl>
                </div>
              </TabPanel>

              {/* 메뉴 */}
              <TabPanel className="text-sm text-gray-500 py-3 px-4 rounded-lg mt-2">
                <h3 className="sr-only">User Menu</h3>

                {/* 메뉴 항목 목록 */}
                {menuItems && fetch ? (
                  <DetailUserMenuComponent
                    menuItems={menuItems}
                    handleMenuRemove={handleMenuRemove}
                  />
                ) : !menuItems ? (
                  // 등록된 메뉴가 하나도 없으면 노출
                  <p className="text-center mt-2 text-gray-600">
                    메뉴를 추가해주세요!
                  </p>
                ) : null}

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
              <TabPanel className="-mb-10">
                <h3 className="sr-only">Customer Reviews</h3>
                <DetailUserReviewComponent
                  shopId={shopId}
                  shopDetailId={shop.shopUserDTO.shopUserId}
                  infoType={infoType}
                  review={review}
                  handleClickReview={handleClickReview}
                />
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </div>
      </div>
    </>
  );
};

export default DetailUserComponent;
