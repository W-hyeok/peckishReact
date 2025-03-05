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

import { format } from 'date-fns';
import { useTimeStamp } from '../../hooks/useTimeAgo';
import useCustomMove from '../../hooks/useCustomMove';

const host = `${API_SERVER_HOST}`;

const product = {
  name: 'Application UI Icon Pack',
  version: { name: '1.0', date: 'June 5, 2021', datetime: '2021-06-05' },
  price: '$220',

  highlights: [
    '200+ SVG icons in 3 unique styles',
    'Compatible with Figma, Sketch, and Adobe XD',
    'Drawn on 24 x 24 pixel grid',
  ],
  imageSrc:
    'https://tailwindui.com/plus/img/ecommerce-images/product-page-05-product-01.jpg',
  imageAlt:
    'Sample of 30 icons with friendly and fun details in outline, filled, and brand color styles.',
};
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
const faqs = [
  {
    question: 'What format are these icons?',
    answer:
      'The icons are in SVG (Scalable Vector Graphic) format. They can be imported into your design tool of choice and used directly in code.',
  },
  {
    question: 'Can I use the icons at different sizes?',
    answer:
      "Yes. The icons are drawn on a 24 x 24 pixel grid, but the icons can be scaled to different sizes as needed. We don't recommend going smaller than 20 x 20 or larger than 64 x 64 to retain legibility and visual balance.",
  },
  // More FAQs...
];
const license = {
  href: '#',
  summary:
    'For personal and professional use. You cannot resell or redistribute these icons in their original or modified state.',
  content: `
      <h4>Overview</h4>
      
      <p>For personal and professional use. You cannot resell or redistribute these icons in their original or modified state.</p>
      
      <ul role="list">
      <li>You\'re allowed to use the icons in unlimited projects.</li>
      <li>Attribution is not required to use the icons.</li>
      </ul>
      
      <h4>What you can do with it</h4>
      
      <ul role="list">
      <li>Use them freely in your personal and professional work.</li>
      <li>Make them your own. Change the colors to suit your project or brand.</li>
      </ul>
      
      <h4>What you can\'t do with it</h4>
      
      <ul role="list">
      <li>Don\'t be greedy. Selling or distributing these icons in their original or modified state is prohibited.</li>
      <li>Don\'t be evil. These icons cannot be used on websites or applications that promote illegal or immoral beliefs or activities.</li>
      </ul>
    `,
};

const { kakao } = window;

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const DetailUserComponent = ({ shop, shopId, mapData, storeLoc }) => {
  const navigate = useNavigate();
  console.log(mapData);
  console.log(storeLoc);

  // 방문 성공
  const [visitedSuccess, setVisitedSuccess] = useState(0);
  // 방문 실패
  const [visitedFail, setVisitedFail] = useState(0);
  // 방문 여부 확인
  const [hasVisited, setHasVisited] = useState(false);

  // 방문 성공 클릭 이벤트
  const handleVisitedSuccess = () => {
    if (hasVisited) {
      alert('한 번만 방문을 기록할 수 있습니다');
      return;
    }
    setVisitedSuccess(visitedSuccess + 1); // 방문 성공시 +1

    setHasVisited(true); // 방문 여부 바꾸기
  };

  // 방문 실패 클릭 이벤트
  const handleVisitedFail = () => {
    if (hasVisited) {
      alert('한 번만 방문을 기록할 수 있습니다');
      return;
    }
    setVisitedFail(visitedFail + 1); // 방문 실패시 +1
    setHasVisited(true); // 방문 여부 바꾸기
  };

  // 방문 성공 여부 back에 전달해주기

  // 메뉴 추가버튼 클릭시 이벤트
  const handleClickAddMenu = () => {
    navigate({
      pathname: `/shop/addMenu/${shopId}/${shop.shopUserDTO.shopUserId}/USER`,
    });
  };

  console.log(shop);
  console.log(shopId);

  //점포 수정 페이지로 이동 이벤트
  const handleModify = () => {
    navigate({
      pathname: `/shop/modify/${shopId}/${shop.shopUserDTO.shopUserId}/USER`,
    });
  };

  const { moveToBack } = useCustomMove();
  return (
    <>
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

          {/* 방문 인증 여부 */}
          <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleVisitedSuccess}
              className="flex items-center justify-center rounded-md border border-black/30 px-8 py-3 font-extrabold text-lg text-green-800 hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
            >
              {/* <img
                src="../../src/assets/icon/success2.png"
                className="h-1/12 w-1/12 mr-2"
              /> */}
              방문 성공 ({visitedSuccess}회)
            </button>
            <button
              type="button"
              className="flex w-auto items-center justify-center rounded-md border border-black/30 px-8 py-3 font-extrabold text-lg text-rose-800 hover:bg-rose-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
              onClick={handleVisitedFail}
            >
              {/* <img
                src="../../src/assets/icon/failed.png"
                className="h-1/12 w-1/12 mr-2"
              /> */}
              방문 실패 ({visitedFail}회)
            </button>
          </div>

          {/* <div className="border-t border-gray-200 pt-5">
            <h3 className="text-sm font-medium text-gray-900">
              방문 인증 기록
            </h3>
            <div className="mt-2">
              <ul
                role="list"
                className="list-disc space-y-1 pl-5 text-sm/6 text-gray-500 marker:text-gray-300"
              >
                <li> 성공 {visitedSuccess}회</li>
                <li> 실패 {visitedFail}회 </li>
              </ul>
            </div>
          </div> */}

          <div className="mt-10">
            {/* 수정, 돌아가기 버튼 */}
            <div className="flex">
              <div className="ml-auto grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleModify}
                  className="max-w-30 items-center justify-center rounded-md border border-transparent bg-yellow-500 px-8 py-3 text-base font-medium text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-700 focus:ring-offset-2 focus:ring-offset-gray-50"
                >
                  정보 수정
                </button>
                <button
                  type="button"
                  onClick={moveToBack}
                  className="max-w-28 items-center justify-center pl-4 py-2 text-base text-black focus:outline-none focus:ring-2"
                >
                  돌아가기
                </button>
              </div>
            </div>
          </div>
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

            {/* <TabPanel className="text-sm text-gray-500">
                <h3 className="sr-only">상점 정보</h3>

                <dl>영업일: {shop.shopUserDTO.days} </dl>
                <dl>
                  {' '}
                  영업시간: {shop.shopUserDTO.openTime} ~{' '}
                  {shop.shopUserDTO.closeTime}
                </dl>
                <dl></dl>
              </TabPanel> */}
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
                {shop.menuUserList ? (
                  <div className="max-h-64 scrollbar2">
                    <dl>
                      {shop.menuUserList.map((menuUser, index) => (
                        <Fragment key={menuUser}>
                          <div className="flex items-center py-4 border-b border-gray-200 hover:bg-gray-50 transition-all duration-200">
                            <img
                              alt={menuUser.menuName}
                              src={`${host}/api/shop/view/${menuUser.menuFilename}`}
                              className="w-1/6 h-1/6 rounded-full bg-gray-50 mr-6 transition-all duration-300 transform hover:scale-105"
                            />
                            <div className="flex-1">
                              <dt className="font-semibold text-gray-900 text-lg">
                                {menuUser.menuName}
                              </dt>
                              <dd className="text-sm text-gray-600">
                                {menuUser.price}
                              </dd>
                            </div>
                          </div>
                        </Fragment>
                      ))}
                    </dl>
                  </div>
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
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </div>
      </div>
    </>
  );
};

export default DetailUserComponent;
