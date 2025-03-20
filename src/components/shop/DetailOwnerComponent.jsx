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
import DetailOwnerMenuComponent from './DetailOwnerMenuComponent';
import DetailOwnerReviewComponent from '../review/DetailOwnerReviewComponent';
import { getReview, getOwnerRating } from '../../api/reviewApi';
import { getCookie } from '../../util/cookieUtil';
import axios from 'axios';
import { createRoom } from '../../api/roomApi';
import '../../css/common.css';

const host = `${API_SERVER_HOST}`;
const { kakao } = window;
const memberInfo = getCookie('member'); //채팅

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const DetailOwnerComponent = ({
  shop,
  shopId,
  infoType,
  mapData,
  storeLoc,
}) => {
  const [menuItems, setMenuItems] = useState([]); // 메뉴 목록 뿌려줄때 필요한 것들
  const [review, setReview] = useState([]); // 리뷰 목록 뿌려줄때 필요한 것들
  const [ratingAvg, setRatingAvg] = useState(null); // 리뷰 별점계산
  const [result, setResult] = useState(null); // 모달 띄워주기 위해서
  const [refresh, setRefresh] = useState(false);
  const [fetch, setFetch] = useState(false); // 시간차
  const [ownerEmail, setOwnerEmail] = useState(null);
  const navigate = useNavigate();

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

  // Owner - 리뷰 평점 계산
  useEffect(() => {
    getOwnerRating(shopId).then((data) => {
      console.log('Owner 리뷰 평균 : ', data);
      setRatingAvg(data);
    });
  });

  useEffect(() => {
    const fetchOwnerInfo = async () => {
      try {
        const response = await axios.get(`${host}/api/shop/owner/${shopId}`);
        setOwnerEmail(response.data.email); // 사장님 이메일 저장
        console.log('setOwnerEmail: ', response.data.email);
      } catch (error) {
        console.error('사장님 정보를 가져오지 못했습니다.', error);
      }
    };
    fetchOwnerInfo();
  }, [shopId]);

  //채팅
  const handleChat = async () => {
    // 로그인 여부 체크
    if (!memberInfo) {
      alert('로그인 후 이용 가능합니다.');
      return;
    }

    try {
      const memberEmail = memberInfo.email; // JWT에서 사용자 이메일 추출
      if (!ownerEmail) {
        alert('사장님 이메일을 확인할 수 없습니다.');
        return;
      }
      const member1 = ownerEmail;
      const member2 = memberEmail;
      // 두 멤버를 createRoom에 전달
      const room = await createRoom({
        member1,
        member2,
        shopId,
      });
      console.log('채팅방 생성 성공:', room);
      // 반환된 room 객체의 roomId를 이용해 채팅방 페이지로 이동
      if (room.room_ID) {
        navigate(`/room/${room.room_ID}`);
      } else {
        console.error('roomId가 반환되지 않았습니다.');
      }
    } catch (error) {
      console.error('채팅방 생성 실패', error);
    }
  };

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

  // 리뷰 삭제
  const handleReviewRemove = (reviewId) => {
    console.log('삭제할 reviewId : ', reviewId);
  };

  return (
    <>
      {result === 'menu' && (
        <AddMenuModal
          shopId={shopId}
          shopDetailId={shop.shopOwnerDTO.shopOwnerId}
          infoType={infoType}
          callbackFn={closeModal}
        />
      )}

      {/* Left Rayout */}
      <div className="lg:grid lg:grid-cols-10 lg:gap-x-8 xl:gap-x-12">
        <div className="lg:col-span-5 lg:row-end-1">
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

        {/* Right Layout */}
        <div className="mx-auto mt-4  sm:mt-12 lg:col-span-8 lg:row-span-2 lg:row-end-2 lg:mt-0 lg:max-w-2/3 lg:px-8">
          <div className="lg:col-span-4 lg:row-end-1">
            <div className="mt-4">
              {/* 줄바꿈 없음, overflow 자동 (줄바꿈 필요해지면 스크롤바 생성됨) */}
              <div className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                <h1 className="scrollbar">{shop.shopOwnerDTO.title}</h1>
                {/* 리뷰 별점 아이콘 */}
                <h3 className="sr-only">Reviews</h3>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-0.5">
                    {[0, 1, 2, 3, 4].map((index) => {
                      const wholeStars = Math.floor(ratingAvg);
                      const hasHalfStar = ratingAvg % 1 >= 0.5;

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
                최근 수정: {/* customhook: 날짜 표기법 */}
                <span>{useTimeStamp(shop.shopOwnerDTO.updateDate)}</span>
              </p>
              {/* 상점 이미지 */}
              <div className="col-span-full">
                <div className="mt-2 flex justify-center rounded-lg px-6 py-10">
                  <img
                    alt={shop.shopOwnerDTO.title}
                    src={`${host}/api/shop/view/${shop.shopOwnerDTO.filename}`}
                    className="mx-auto rounded-lg max-w-full h-auto"
                    style={{ width: '400px', height: '300px' }} // 이미지 크기 조정
                  />
                </div>
              </div>
              {/* tab */}
              <div className="mt-4 grid grid-cols-1 gap-y-8 sm:grid-cols-2 sm:gap-x-4">
                <div className="sm:col-span-6">
                  <TabGroup>
                    <div className="border-b border-gray-200 px-6">
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
                      <TabPanel className="text-sm text-gray-500 py-3 px-6 rounded-lg mt-0">
                        <h3 className="sr-only">상점 정보</h3>

                        <div className="space-y-4">
                          {/* 점포 상세위치 */}

                          {/* 영업일 */}
                          <dl className="p-4 bg-white rounded-lg">
                            <dt className="text-lg text-gray-900">영업일</dt>
                            <dd className="text-md text-gray-700">
                              {shop.shopOwnerDTO.days}
                            </dd>
                          </dl>
                          {/* 영업시간 */}
                          <dl className="p-4 bg-white rounded-lg">
                            <dt className="text-lg text-gray-900">영업시간</dt>
                            <dd className="text-md text-gray-700">
                              {shop.shopOwnerDTO.openTime} ~{' '}
                              {shop.shopOwnerDTO.closeTime}
                            </dd>
                          </dl>

                          <dl className="p-4 bg-white rounded-lg">
                            <dt className="text-lg text-gray-900">문의하기</dt>
                            <dd className="text-md text-gray-700 mt-1">
                              <button
                                type="button"
                                onClick={handleChat}
                                className="defaultBtn"
                              >
                                문의 하기
                              </button>
                            </dd>
                          </dl>
                        </div>
                      </TabPanel>

                      {/* 메뉴 */}
                      <TabPanel className="text-sm text-gray-500 py-3 px-6 rounded-lg mt-2">
                        <h3 className="sr-only">Owner Menu</h3>

                        {/* 메뉴 항목 목록 */}
                        {menuItems && fetch ? (
                          <DetailOwnerMenuComponent
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
                      <TabPanel className="min-h-[400px] w-full">
                        <h3 className="sr-only">Customer Reviews</h3>
                        <DetailOwnerReviewComponent
                          shopId={shopId}
                          shopDetailId={shop.shopOwnerDTO.shopOwnerId}
                          infoType={infoType}
                          review={review}
                          handleClickReview={handleClickReview}
                          handleReviewRemove={handleReviewRemove}
                        />
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

export default DetailOwnerComponent;
