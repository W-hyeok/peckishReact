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
import ResultModal from '../common/ResultModal';
import AddMenuModal from '../common/AddMenuModal';
import { deleteMenu, getMenuList } from '../../api/shopApi';
import DetailUserMenuComponent from './DetailUserMenuComponent';

const host = `${API_SERVER_HOST}`;

const reviews = {
  average: 4,
  featured: [
    {
      id: 1,
      rating: 5,
      content: `
          <p>맛이 young하네요 mz하네요</p>
        `,
      date: 'July 16, 2021',
      datetime: '2021-07-16',
      author: 'youngman',
      avatarSrc:
        'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80',
    },
    {
      id: 2,
      rating: 5,
      content: `
          <p>변비 특효약!!</p>
        `,
      date: 'July 12, 2021',
      datetime: '2021-07-12',
      author: 'hero zealot',
      avatarSrc:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80',
    },
    // More reviews...
  ],
};

const { kakao } = window;

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const DetailUserComponent = ({ shop, shopId, infoType, mapData, storeLoc }) => {
  // 메뉴 목록 뿌려줄때 필요한 것들
  const [menuItems, setMenuItems] = useState([]);
  const navigate = useNavigate();
  const { moveToBack } = useCustomMove();
  const [result, setResult] = useState(null);

  const [refresh, setRefresh] = useState(false);
  const [fetch, setFetch] = useState(false);

  // DB에서 메뉴목록 불러오기
  useEffect(() => {
    getMenuList(shopId, infoType).then((data) => {
      setFetch(false);
      setMenuItems(data.RESULT);
      setFetch(true);
      console.log('메뉴 목록 업데이트:', data.RESULT);
    });
  }, [shopId, infoType, refresh]); // ✅ menuItems 제거, refresh 추가

  //메뉴 삭제 (받을 인자 값)
  const handleMenuRemove = (menuId) => {
    console.log('삭제할 menuId : ', menuId);
    deleteMenu(menuId, infoType).then((data) => {
      console.log(data.RESULT);
      // 메뉴 항목 업데이트 후 즉시 화면에 반영
      setMenuItems((prevItems) =>
        prevItems.filter((menu) => menu.menuId !== menuId)
      );
    });
  };

  console.log(mapData);
  console.log(storeLoc);

  const closeModal = () => {
    setResult(null);
    setRefresh((prev) => !prev);
  };

  // 메뉴 추가 버튼 클릭시 이벤트
  const handleClickAddMenu = () => {
    console.log('메뉴모달 보여줘라');
    setResult('menu');
  };

  // 리뷰 추가 버튼 클릭시 이벤트
  const handleClickReview = () => {
    console.log('리뷰모달 보여줘라');
    setResult('review');
  };

  console.log(shop);
  console.log(shopId);

  return (
    <>
      {result === 'review' && (
        <AddReviewModal
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

            <div>
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <StarIcon
                    key={rating}
                    aria-hidden="true"
                    className={classNames(
                      reviews.average > rating
                        ? 'text-yellow-400'
                        : 'text-gray-300',
                      'size-5 shrink-0'
                    )}
                  />
                ))}
              </div>
              <p className="sr-only">{reviews.average} out of 5 stars</p>
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

              <TabPanel className="text-sm text-gray-500 py-3 px-4 rounded-lg mt-2">
                <h3 className="sr-only">User Menu</h3>

                {/* 메뉴 목록 */}
                {menuItems ? (
                  fetch ? (
                    <DetailUserMenuComponent
                      menuItems={menuItems}
                      handleMenuRemove={handleMenuRemove}
                    />
                  ) : (
                    <></>
                  )
                ) : (
                  // 등록된 메뉴가 하나도 없으면 노출
                  <p className="text-center mt-2 text-gray-600">
                    메뉴를 추가해주세요!
                  </p>
                )}

                {/* 메뉴 추가 버튼 */}
                <div className="flex">
                  <div className="mt-6 m-auto">
                    <button
                      type="button"
                      onClick={handleClickAddMenu}
                      className="inline-flex items-center justify-center rounded-md border border-transparent bg-yellow-500 px-8 py-3 text-base font-medium text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-700 focus:ring-offset-2 focus:ring-offset-gray-50 transition-all duration-300"
                    >
                      메뉴 정보 변경
                    </button>
                  </div>
                </div>
              </TabPanel>

              {/* 리뷰 */}
              <TabPanel className="-mb-10">
                <h3 className="sr-only">Customer Reviews</h3>

                {reviews.featured.map((review, reviewIdx) => (
                  <div
                    key={review.id}
                    className="flex space-x-4 text-sm text-gray-500"
                  >
                    <div className="flex-none py-10">
                      <img
                        alt=""
                        src={review.avatarSrc}
                        className="size-10 rounded-full bg-gray-100"
                      />
                    </div>
                    <div
                      className={classNames(
                        reviewIdx === 0 ? '' : 'border-t border-gray-200',
                        'flex-1 py-10'
                      )}
                    >
                      <h3 className="font-medium text-gray-900">
                        {review.author}
                      </h3>
                      <p>
                        <time dateTime={review.datetime}>{review.date}</time>
                      </p>

                      <div className="mt-4 flex items-center">
                        {[0, 1, 2, 3, 4].map((rating) => (
                          <StarIcon
                            key={rating}
                            aria-hidden="true"
                            className={classNames(
                              review.rating > rating
                                ? 'text-yellow-400'
                                : 'text-gray-300',
                              'size-5 shrink-0'
                            )}
                          />
                        ))}
                      </div>
                      <p className="sr-only">{review.rating} out of 5 stars</p>

                      <div
                        dangerouslySetInnerHTML={{ __html: review.content }}
                        className="mt-4 text-sm/6 text-gray-500"
                      />
                    </div>
                  </div>
                ))}
                {/* 리뷰 추가 버튼 */}
                <div className="flex">
                  <div className="mt-6 m-auto">
                    <button
                      type="button"
                      onClick={handleClickReview}
                      className="inline-flex items-center justify-center rounded-md border border-transparent bg-yellow-500 px-8 py-3 text-base font-medium text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-700 focus:ring-offset-2 focus:ring-offset-gray-50 transition-all duration-300"
                    >
                      리뷰 작성
                    </button>
                  </div>
                </div>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </div>
      </div>
    </>
  );
};

export default DetailUserComponent;
