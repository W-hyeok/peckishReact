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
import { getCookie } from '../../util/cookieUtil';
import { createRoom } from '../../api/roomApi';
import axios from 'axios';

import AddReviewModal from '../common/AddReviewModal';
import AddMenuModal from '../common/AddMenuModal';
import { deleteMenu, getMenuList } from '../../api/shopApi';
import DetailOwnerMenuComponent from './DetailOwnerMenuComponent';
import DetailOwnerReviewComponent from '../review/DetailOwnerReviewComponent';

const host = `${API_SERVER_HOST}`;
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
  console.log('shop : ', shop);
  console.log('shopId : ', shopId);

  // 메뉴 목록 뿌려줄때 필요한 것들
  const [menuItems, setMenuItems] = useState([]);
  // 리뷰 목록 뿌려줄때 필요한 것들
  const [review, setReview] = useState([]);
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [fetch, setFetch] = useState(false);
  const [ownerEmail, setOwnerEmail] = useState(null);

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
    try {
      const memberEmail = memberInfo.email; // JWT에서 사용자 이메일 추출
      if (!ownerEmail) {
        alert('사장님 이메일을 확인할 수 없습니다.');
        return;
      }

      const member1 = ownerEmail;
      const member2 = memberEmail;
      // 두 멤버를 createRoom에 전달합니다.
      const room = await createRoom({
        member1,
        member2,
        shopId,
      });
      console.log('채팅방 생성 성공:', room);
      // 반환된 room 객체의 roomId를 이용해 채팅방 페이지로 이동합니다.
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
  };

  // 리뷰 추가 버튼 클릭시 이벤트
  const handleClickReview = () => {
    console.log('리뷰모달 보여줘라');
    setResult('review'); // 리뷰 모달 열기
  };

  // 메뉴 추가 버튼 클릭시 이벤트
  const handleClickAddMenu = () => {
    console.log('메뉴모달 보여줘라');
    setResult('menu'); // 메뉴 모달 열기
  };

  // DB에서 메뉴목록 불러오기
  useEffect(() => {
    getMenuList(shopId, infoType).then((data) => {
      setFetch(false);
      console.log(data.RESULT);
      setMenuItems(data.RESULT); // DB에서 가져온 목록을 menuItems state에 저장
      setFetch(true);
      console.log('메뉴 목록 업데이트:', data.RESULT);
    });
  }, [shopId, infoType, result]);

  // 리뷰 목록 조회
  useEffect(() => {
    getReview(shopId, shopDetailId, infoType).then((data) => {
      setFetch(false);
      console.log('리뷰 조회');
      console.log(date.RESULT);
      setReview(data.RESULT);
      setFetch(true);
    });
  }, [shopId, infoType, refresh]);

  //메뉴 삭제 (받을 인자 값)
  const handleMenuRemove = (menuId) => {
    console.log('삭제할 menuId : ', menuId);
    deleteMenu(menuId, infoType).then((data) => {
      console.log(data.RESULT);
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
          shopDetailId={shop.shopOwnerDTO.shopOwnerId}
          infoType={infoType}
          title={'리뷰 작성'}
          content={`리뷰를 작성해주세요`}
          callbackFn={closeModal}
        />
      )}
      {result === 'menu' && (
        <AddMenuModal
          shopId={shopId}
          shopDetailId={shop.shopOwnerDTO.shopOwnerId}
          infoType={infoType}
          callbackFn={closeModal}
        />
      )}

      <div className="lg:grid lg:grid-cols-4 lg:grid-rows-1 lg:gap-y-5">
        {/* Product image */}
        <div className="lg:col-span-2 lg:row-end-1">
          <img
            alt={shop.shopOwnerDTO.title}
            src={`${host}/api/shop/view/${shop.shopOwnerDTO.filename}`}
            className="aspect-[5/3] w-full rounded-lg bg-gray-100 object-cover"
            style={{ boxShadow: '3px 3px gray' }}
          />
        </div>

        {/* Product details */}
        <div className="m-auto mt-14 max-w-2xl sm:mt-16 lg:col-span-3 lg:row-span-2 lg:row-end-2 lg:mt-0 lg:max-w-none">
          <div className="flex flex-col-reverse">
            <div className="mt-4">
              {/* 줄바꿈 없음, overflow 자동 (줄바꿈 필요해지면 스크롤바 생성됨) */}
              <div
                className={`text-2xl max-w-lg font-bold tracking-tight text-gray-900 sm:text-3xl`}
              >
                <h1 className="scrollbar">{shop.shopOwnerDTO.title}</h1>
              </div>

              <h2 id="information-heading" className="sr-only">
                Product information
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                최근 수정:{' '}
                <span>{useTimeStamp(shop.shopOwnerDTO.updateDate)}</span>
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
            {shop.shopOwnerDTO.location}
          </p>

          {/* 방문 인증 여부 */}
          <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleChat}
              className="flex items-center justify-center rounded-md border border-black/30 px-8 py-3 font-extrabold text-lg text-green-800 hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
            >
              문의 하기
            </button>
          </div>
        </div>

        {/* tab */}
        <div className="mx-auto mt-4 w-full max-w-2xl lg:col-span-2 lg:mt-0 lg:max-w-none">
          <TabGroup>
            <div className="border-b border-gray-200">
              <TabList className="-mb-px flex space-x-8">
                <Tab className="whitespace-nowrap border-b-2 border-transparent py-2 mb-0 text-sm font-medium text-gray-700 hover:text-gray-900 hover:border-indigo-500 data-[selected]:border-indigo-600 data-[selected]:text-indigo-600 transition-all ease-in-out duration-300">
                  정보
                </Tab>
                <Tab className="whitespace-nowrap border-b-2 border-transparent py-2 mb-0 text-sm font-medium text-gray-700 hover:text-gray-900 hover:border-indigo-500 data-[selected]:border-indigo-600 data-[selected]:text-indigo-600 transition-all ease-in-out duration-300">
                  메뉴
                </Tab>
                <Tab className="whitespace-nowrap border-b-2 border-transparent py-2 mb-0 text-sm font-medium text-gray-700 hover:text-gray-900 hover:border-indigo-500 data-[selected]:border-indigo-600 data-[selected]:text-indigo-600 transition-all ease-in-out duration-300">
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
                      {shop.shopOwnerDTO.days}
                    </dd>
                  </dl>
                  {/* 영업시간 */}
                  <dl className="p-4 bg-white rounded-lg">
                    <dt className="text-lg font-semibold text-gray-900">
                      영업시간:
                    </dt>
                    <dd className="text-md text-gray-700">
                      {shop.shopOwnerDTO.openTime} ~{' '}
                      {shop.shopOwnerDTO.closeTime}
                    </dd>
                  </dl>
                </div>
              </TabPanel>

              {/* 메뉴 */}
              <TabPanel className="text-sm text-gray-500 py-3 px-4 rounded-lg mt-2">
                <h3 className="sr-only">User Menu</h3>

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
              <TabPanel className="-mb-10 pb-10 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                <DetailOwnerReviewComponent
                  shopId={shopId}
                  shopDetailId={shop.shopOwnerDTO.shopOwnerId}
                  infoType={infoType}
                  reviews={reviews}
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

export default DetailOwnerComponent;
