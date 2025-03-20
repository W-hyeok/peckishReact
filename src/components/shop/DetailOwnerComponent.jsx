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
import ResultModal from '../common/ResultModal';
import RemoveModal from '../common/RemoveModal';

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
  shopDetailId,
  mapData,
  storeLoc,
}) => {
  console.log('DetailOwner - shopDetailId : ', shopDetailId);

  const [menuItems, setMenuItems] = useState([]); // 메뉴 목록 뿌려줄때 필요한 것들
  const [review, setReview] = useState([]); // 리뷰 목록 뿌려줄때 필요한 것들
  const [ratingAvg, setRatingAvg] = useState(null); // 리뷰 별점계산
  const [result, setResult] = useState(null); // 모달 띄워주기 위해서
  const [menuRefresh, setMenuRefresh] = useState(false); // 메뉴 리프레시
  const [reviewRefresh, setReviewRefresh] = useState(false);
  const [menuFetch, setMenuFetch] = useState(false); // 메뉴 시간차
  const [reviewFetch, setReviewFetch] = useState(false);

  const [ownerEmail, setOwnerEmail] = useState(null);
  const navigate = useNavigate();

  // 점포 수정페이지로 이동
  const { moveToOwnerShopModify } = useCustomMove();
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
    getOwnerRating(shopId).then((data) => {
      console.log('Owner 리뷰 평균 : ', data);
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

  // 점포 수정
  const handleOwnerShopModify = () => {
    console.log('Owner Shop - Modify');
    moveToOwnerShopModify(shopId, shopDetailId);
  };

  // 점포 삭제
  const handleOwnerShopDelete = () => {
    console.log('점포 삭제 모달 보여줘라');
    setResult('shopRemove');
  };

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

      {/* 상품제목/별점/최근수정일자 */}
      <div className="mb-6">
        {/* 별점 및 평점 */}
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
        <div className="flex justify-between items-center mt-2">
          <h1
            className="
                     text-4xl
                     sm:text-6xl
                     font-extrabold
                     tracking-tight
                     text-gray-900
                     mb-4
                     leading-tight
                     whitespace-nowrap
                     overflow-visible
                   "
          >
            {shop.shopOwnerDTO.title}
          </h1>

          {/* 최근 수정 텍스트 */}
          <p className="text-lg text-gray-700">
            최근 수정: {useTimeStamp(shop.shopOwnerDTO.updateDate)}
          </p>
        </div>
      </div>

      {/* 사진 컨테이너 */}
      <div className="mt-4 w-full max-w-5xl mx-auto h-[50vh] overflow-hidden">
        <img
          alt={shop.shopOwnerDTO.title}
          src={`${host}/api/shop/view/${shop.shopOwnerDTO.filename}`}
          className="w-full h-full object-contain"
        />
      </div>
      {/* tab */}
      <div className="mt-6 grid grid-cols-1 gap-y-8 sm:grid-cols-2 sm:gap-x-4">
        <div className="sm:col-span-2">
          <TabGroup>
            <div className="border-b border-gray-200">
              <TabList className="flex space-x-2">
                <Tab
                  className="
                           px-6 py-3
                           text-lg font-semibold
                           border-2 border-yellow-500
                           text-gray-700
                           bg-white
                           rounded-t-md
                           hover:bg-yellow-50
                           data-[selected]:bg-yellow-500
                           data-[selected]:text-white
                           data-[selected]:border-yellow-500
                           outline-none
                         "
                >
                  노점 정보
                </Tab>

                <Tab
                  className="
                           px-6 py-3
                           text-lg font-semibold
                           border-2 border-yellow-500
                           text-gray-700
                           bg-white
                           rounded-t-md
                           hover:bg-yellow-50
                           data-[selected]:bg-yellow-500
                           data-[selected]:text-white
                           data-[selected]:border-yellow-500
                           outline-none
                         "
                >
                  노점 메뉴
                </Tab>

                <Tab
                  className="
                           px-6 py-3
                           text-lg font-semibold
                           border-2 border-yellow-500
                           text-gray-700
                           bg-white
                           rounded-t-md
                           hover:bg-yellow-50
                           data-[selected]:bg-yellow-500
                           data-[selected]:text-white
                           data-[selected]:border-yellow-500
                           outline-none
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
                  <dl className="p-6">
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
                    </dd>
                  </dl>
                  <dl className="p-6">
                    <dt className="text-xl text-gray-900">영업일</dt>
                    <dd className="text-lg text-gray-700">
                      <input
                        name="title"
                        type="text"
                        value={shop.shopOwnerDTO.days}
                        autoComplete="street-address"
                        className="block w-full rounded-md bg-white px-4 py-3 text-lg text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-indigo-600"
                      />
                    </dd>
                  </dl>
                  <dl className="p-6">
                    <dt className="text-xl text-gray-900">영업시간</dt>
                    <dd className="text-lg text-gray-700">
                      <input
                        name="title"
                        type="text"
                        value={`${shop.shopOwnerDTO.openTime} ~ ${shop.shopOwnerDTO.closeTime}`}
                        autoComplete="street-address"
                        className="block w-full rounded-md bg-white px-4 py-3 text-lg text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-indigo-600"
                      />
                    </dd>
                  </dl>
                  <dl className="p-6">
                    <dt className="text-lg text-gray-900">문의하기</dt>
                    <dd className="text-md text-gray-700">
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

              {/* 메뉴 탭 */}
              <TabPanel className="relative text-base text-gray-600 py-4 px-4 pt-20 rounded-lg mt-4">
                <h3 className="sr-only">Owner Menu</h3>
                {menuItems.length > 0 && menuFetch ? (
                  <DetailOwnerMenuComponent
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
                  className="absolute top-6 right-6 inline-flex items-center justify-center h-fit w-fit px-4 py-2 bg-white text-yellow-400 text-xl font-semibold rounded-[8px] mt-3 border-[2px] border-yellow-400 hover:bg-yellow-400 hover:text-white"
                >
                  메뉴 작성
                </button>
              </TabPanel>

              {/* 리뷰 탭 */}
              <TabPanel className="relative text-base text-gray-600 py-4 px-4 pt-20 rounded-lg mt-4">
                <h3 className="sr-only">Owner Reviews</h3>
                {review.length > 0 && reviewFetch ? (
                  <DetailOwnerReviewComponent
                    shopId={shopId}
                    shopDetailId={shop.shopOwnerDTO.shopOwnerId}
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
                  className="absolute top-6 right-6 inline-flex items-center justify-center h-fit w-fit px-4 py-2 bg-white text-yellow-400 text-xl font-semibold rounded-[8px] mt-3 border-[2px] border-yellow-400 hover:bg-yellow-400 hover:text-white"
                >
                  리뷰 작성
                </button>
              </TabPanel>
            </TabPanels>
          </TabGroup>
          {/* 버튼 */}
          <div className="flex justify-end space-x-4 mt-2">
            <button
              onClick={handleOwnerShopModify}
              className="h-fit w-fit px-4 py-2 bg-white text-blue-600 text-xl font-semibold rounded-[8px] mt-6 border-[2px] border-blue-600 hover:bg-blue-600 hover:text-white"
            >
              수정
            </button>
            <button
              onClick={handleOwnerShopDelete}
              className="h-fit w-fit px-4 py-2 bg-white text-red-500 text-xl font-semibold rounded-[8px] mt-6 border-[2px] border-red-500 hover:bg-red-500 hover:text-white"
            >
              삭제
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailOwnerComponent;
