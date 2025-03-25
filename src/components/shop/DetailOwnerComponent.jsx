import React, { useEffect } from 'react';
import { API_SERVER_HOST } from '../../api/todoApi';
import { Fragment, useState } from 'react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { StarIcon } from '@heroicons/react/20/solid';
import { useNavigate } from 'react-router-dom';
import locationStar from '../../assets/icon/location_star.png';
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
import { Link } from 'react-router-dom';

import { getReview, getOwnerRating, deleteReview } from '../../api/reviewApi';
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

// days 데이터 (예시)
const days = [
  { id: 1, name: '월요일' },
  { id: 2, name: '화요일' },
  { id: 3, name: '수요일' },
  { id: 4, name: '목요일' },
  { id: 5, name: '금요일' },
  { id: 6, name: '토요일' },
  { id: 7, name: '일요일' },
];

const DetailOwnerComponent = ({
  shop,
  shopDetailId,
  shopId,
  infoType,
  mapData,
  storeLoc,
  membercookie,
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

  // 노점 수정페이지로 이동
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

  // 요일 배열
  const daysData = (() => {
    const daylist = shop.shopOwnerDTO.days; // DB에서 가져온 값
    // raw가 문자열인 경우 처리
    if (typeof daylist === 'string') {
      // raw가 JSON 배열 형식(예: '["월","화","수"]')인지 확인
      if (daylist.trim().startsWith('[')) {
        try {
          return JSON.parse(daylist);
        } catch (e) {
          return daylist
            .replace(/^\[|\]$/g, '')
            .split(',')
            .map((item) => item.trim());
        }
      } else {
        return daylist.includes(',')
          ? daylist.split(',').map((item) => item.trim())
          : [daylist.trim()];
      }
    }
    // raw가 문자열이 아니면 그대로 반환
    return daylist;
  })();

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

  // 노점 수정
  const handleOwnerShopModify = () => {
    console.log('Owner Shop - Modify');
    moveToOwnerShopModify(shopId, shopDetailId);
  };

  // 노점 삭제
  const handleOwnerShopDelete = () => {
    console.log('노점 삭제 모달 보여줘라');
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

  console.log('owner작성자 - ', shop.shopOwnerDTO.email);
  console.log('로그인회원 - ', membercookie.email);

  // 관리 목록으로 Back
  const handelClickBack = () => {
    navigate('/main');
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
        {ratingAvg == '0.0' ? (
          <p className="text-base font-semibold text-red-500 mt-3 mb-5">
            첫 리뷰를 작성해주세요!
          </p>
        ) : (
          <></>
        )}
        <div className="flex justify-between items-center mt-2">
          <h1
            className="
                     text-2xl
                     sm:text-5xl
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
          <p className="text-sm text-gray-700">
            최근 수정: {useTimeStamp(shop.shopOwnerDTO.updateDate)}
          </p>
        </div>
      </div>

      {/* 사진 컨테이너 */}
      <div className="mt-4 w-full h-[30vh] overflow-hidden">
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
            <div className="ml-5 border-b border-gray-200">
              <TabList className="flex space-x-2">
                <Tab
                  className="
                           px-3 py-1.5
                           sm:px-6 py-3
                           smText
                           border-2 border-yellow-400
                           text-gray-700
                           bg-white
                           rounded-t-md
                           hover:bg-yellow-400
                           hover:text-white
                           data-[selected]:bg-yellow-400
                           data-[selected]:text-white
                           data-[selected]:border-yellow-400
                           outline-none
                         "
                >
                  노점 정보
                </Tab>

                <Tab
                  className="
                           px-3 py-1.5
                           sm:px-6 py-3
                           smText
                           border-2 border-yellow-400
                           text-gray-700
                           bg-white
                           rounded-t-md
                           hover:bg-yellow-400
                           hover:text-white
                           data-[selected]:bg-yellow-400
                           data-[selected]:text-white
                           data-[selected]:border-yellow-400
                           outline-none
                         "
                >
                  노점 메뉴
                </Tab>

                <Tab
                  className="
                           px-3 py-1.5
                           sm:px-6 py-3
                           smText
                           border-2 border-yellow-400
                           text-gray-700
                           bg-white
                           rounded-t-md
                           hover:bg-yellow-400
                           hover:text-white
                           data-[selected]:bg-yellow-400
                           data-[selected]:text-white
                           data-[selected]:border-yellow-400
                           outline-none
                         "
                >
                  노점 리뷰
                </Tab>
              </TabList>
            </div>

            <TabPanels as={Fragment}>
              {/* 정보 탭 */}
              <TabPanel className="text-base text-gray-600 py-4 px-4 rounded-lg mt-2 space-y-2">
                <div className="space-y-2">
                  <dl className="p-2">
                    <dt className="smText text-gray-900">위치</dt>
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
                                src: { locationStar },
                                size: {
                                  width: 48,
                                  height: 48,
                                },
                              }}
                              title="노점 위치에용"
                            />
                          )}
                        </KakaoMap>
                      </div>
                    </dd>
                  </dl>

                  <dl className="p-6">
                    <dt className="smText text-gray-900">영업일 & 영업시간</dt>
                    <dd className="smText text-gray-700">
                      <div
                        // input처럼 보이도록 스타일링한 div (textarea의 리사이즈 표시 제거)
                        className="block w-full rounded-md bg-white px-5 sm:px-4 py-3 smText outline outline-1 outline-gray-300 focus:outline focus:outline-2 focus:outline-indigo-600 mt-3"
                        // whiteSpace: 'pre-wrap'을 통해 개행 문자를 반영, userSelect를 false로 설정해 텍스트 선택 방지
                        style={{
                          whiteSpace: 'pre-wrap',
                          fontFamily: 'inherit',
                          userSelect: 'none',
                        }}
                      >
                        {days.map((day) => {
                          // DB의 daysData와 상수 배열의 day.name을 비교 (이제 DB 값은 "월", "화" 등 그대로 저장됨)
                          const isOpen = daysData.includes(day.name);
                          // 영업일이면 영업시간, 아니면 "휴무" 문자열 지정
                          const timeDisplay = isOpen
                            ? `${shop.shopOwnerDTO.openTime} - ${shop.shopOwnerDTO.closeTime}`
                            : '휴무';
                          return (
                            <div key={day.id}>
                              {/* 요일은 그대로 출력 (substring 사용 불필요) */}
                              <span>{day.name} </span>
                              {isOpen ? (
                                // 영업일인 경우 일반 텍스트로 영업시간 출력
                                <span>{timeDisplay}</span>
                              ) : (
                                // 영업일이 아닌 경우 "휴무"를 빨간 글씨로 출력 (Tailwind CSS 클래스 사용)
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

                  <dl className="p-6">
                    <dt className="sm:text-base text-sm text-gray-900">
                      문의하기
                    </dt>
                    <dd className="sm:text-base text-sm text-gray-700">
                      {membercookie.email !== shop.shopOwnerDTO.email && (
                        <button
                          type="button"
                          onClick={handleChat}
                          className="defaultBtn smText mt-3"
                        >
                          문의 하기
                        </button>
                      )}
                    </dd>
                  </dl>
                </div>
                {/* 버튼 */}
                <div className="flex justify-end space-x-4 mt-2">
                  {/* 돌아가기 버튼은 누구에게나 보이게 */}
                  <button
                    onClick={handelClickBack}
                    className="defaultBtn smText"
                  >
                    돌아가기
                  </button>
                  {/* 로그인 했을 때... */}
                  {membercookie.email ? (
                    <>
                      {' '}
                      {/* 쿠키 저장 email과 로그인한 아이디가 해당 작성자 email일 때 */}
                      {membercookie.email === shop.shopOwnerDTO.email ? (
                        <>
                          <button
                            onClick={handleOwnerShopModify}
                            className="positiveBtn smText"
                          >
                            수정
                          </button>

                          <button
                            onClick={handleOwnerShopDelete}
                            className="negativeBtn"
                          >
                            삭제
                          </button>
                        </>
                      ) : (
                        <></>
                      )}
                    </>
                  ) : (
                    // 비로그인 상태일 때...
                    <>
                      <Link to="/member/login" className="positiveBtn">
                        수정
                      </Link>
                      {/* 쿠키 저장 email과 로그인한 아이디가 User email일 때 */}
                      <Link to="/member/login" className="negativeBtn">
                        삭제
                      </Link>
                    </>
                  )}
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
                {/* 쿠키 저장 email과 로그인한 아이디가 해당 작성자 email일 때 */}
                {membercookie.email === shop.shopOwnerDTO.email && (
                  <button
                    type="button"
                    onClick={handleClickAddMenu}
                    className="absolute top-6 right-6 inline-flex items-center justify-center defaultBtn"
                  >
                    메뉴 작성
                  </button>
                )}
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
                  className="absolute top-6 right-6 inline-flex items-center justify-center defaultBtn"
                >
                  리뷰 작성
                </button>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </div>
      </div>
    </>
  );
};

export default DetailOwnerComponent;
