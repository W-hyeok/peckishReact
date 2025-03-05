import React, { act, useEffect, useRef, useState } from 'react';
import { ChevronDownIcon, PhotoIcon } from '@heroicons/react/24/outline';
import TimePicker from 'react-time-picker';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import useKakaoLoader from '../../hooks/useKakaoLoader';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { getOne, postShop, putOne } from '../../api/shopApi';
import ResultModal from '../common/ResultModal';
import useCustomMove from '../../hooks/useCustomMove';
import { getCookie } from '../../util/cookieUtil';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import { API_SERVER_HOST } from '../../api/todoApi';

// 지도 라이브러리 사용 위해 처음에 로드해야 함
const { kakao } = window;
const host = `${API_SERVER_HOST}`;

const initState = {
  shopDTO: null,
  shopOwnerDTO: null,
  menuOwnerList: [],
  shopUserDTO: null,
  menuUserList: [],
};

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

const center = {
  // 지도의 중심좌표
  lat: 33.450701,
  lng: 126.570667,
};

const ModifyUserComponent = ({ shopId, shopDetailId, infoType }) => {
  console.log('user', shop);
  console.log('user', shopId);
  console.log('user', shopDetailId);
  console.log('user', infoType);

  // 체크된 값들을 배열로 관리 (빈 배열로 초기화) -> 추후 데이터 전송시 쉼표로 연결해 문자열로 전송
  const [selectedDays, setSelectedDays] = useState([]);
  const [shopData, setShopData] = useState({ ...initState });
  const [result, setResult] = useState(null); //결과 모달
  const uploadRef = useRef(null); // html id속성 대신 사용
  const [shopfile, setShopfile] = useState(null); // shopfile 상태 추가
  const [image, setImage] = useState(null);

  // 오픈 시간과 마감 시간을 상태로 관리
  const [openTime, setOpenTime] = useState('09:00'); // 오픈: 기본값 09시
  const [closeTime, setCloseTime] = useState('18:00'); // 마감: 기본값 18시
  const [error, setError] = useState(''); // 오류 메시지 상태 추가
  const [loaded, setLoaded] = useState(false); // 데이터 로딩 체크

  // DB에서 데이터 조회
  useEffect(() => {
    getOne(shopId).then((data) => {
      const old = data.RESULT;
      console.log(data.RESULT);
      setShopData({ ...data.RESULT });
      setOpenTime(old.shopUserDTO.openTime);
      setCloseTime(old.shopUserDTO.closeTime);
      // 요일 처리
      const dayNamesArr = old.shopUserDTO.days.split(', ');
      const names = dayNamesArr.map(
        (dayname) => days.find((day) => day.name === dayname)?.id
      );
      setSelectedDays(names);
      setLoaded(true);
    });
  }, [shopId]);

  // ***** 지도 *****
  // useKakaoLoader();
  // 지도 좌표값 설정
  const [position, setPosition] = useState({
    // 지도의 초기 위치
    center: { lat: 37.575422861783345, lng: 126.57066130083415 },
    // 지도 위치 변경시 panto를 이용할지(부드럽게 이동)
    isPanto: true,
  });

  /*
  const [shoplat, setShoplat] = useState({});
  const [shoplng, setShoplng] = useState({});
 
  // 값을 업데이트하는 함수 예시
  const updateShopLocation = (position.center.lat, position.center.lng) => {
    // 새로운 위도(lat) 값으로 shoplat 업데이트
    setShoplat({ lat: position.center.lat });
    
    // 새로운 경도(lng) 값으로 shoplng 업데이트
    setShoplng({ lng: position.center.lng });
  };
  
*/

  // 검색한 위치의 중심 좌표
  const [searchAddress, setSearchAddress] = useState({
    lat: 37.575422861783345,
    lng: 126.57066130083415,
  });
  // 검색값 (텍스트)
  const [searchText, SetSearchText] = useState('');
  // 좌표를 주소로 변환 후 저장할 텍스트
  const [addtoText, setAddtoText] = useState('');
  // 주소를 좌표로 변환하는 함수
  const geocoder = new kakao.maps.services.Geocoder();
  // 장소를 좌표로 변환하는 함수
  const ps = new kakao.maps.services.Places();
  // 좌표를 주소로 변환하는 함수
  const coord2Address = (lat, lng, callback) => {
    const coords = new kakao.maps.LatLng(lat, lng);
    geocoder.coord2Address(coords.getLat(), coords.getLng, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const address = result[0].address.address_name;
        console.log(address);
        callback(address); // 주소를 콜백으로 반환
      } else {
        callback('주소를 못찾겠어용');
      }
    });
  };
  // 주소에 해당하는 마커 표시
  useEffect(() => {
    // 주소를 좌표로 변환하여 state에 저장
    let callback = function (result, status) {
      if (status === kakao.maps.services.Status.OK) {
        const newSearch = result[0];
        setPosition({
          center: { lat: newSearch.y, lng: newSearch.x },
        });
      }
    };
    geocoder.addressSearch(`${searchAddress}`, callback); // 주소 → 좌표
    ps.keywordSearch(`${searchAddress}`, callback); // 장소 → 좌표
    console.log(position.center.lat); // 위도
    console.log(position.center.lng); // 경도

    // // 좌표를 주소로 변환
    // const {lat, lng} = item;
    // coord2Address(lat, lng, (address) => {

    // })
  }, [searchAddress]); // 이거 없으면 안됨 (postition 있으면 무한 리렌더링되니까 절대 X!!!)
  // 현재 사용자 위치 받아오기 (geolocation)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPosition((prev) => ({
            ...prev,
            center: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
            isLoading: false,
          }));
        },
        (err) => {
          setPosition((prev) => ({
            ...prev,
            errMsg: err.message,
            isLoading: false,
          }));
        }
      );
    } else {
      setPosition((prev) => ({
        ...prev,
        errMsg: 'geolocation을 사용할수 없어요..',
        isLoading: false,
      }));
    }
  }, []);

  const handleInputChange = (e) => {
    const newData = e.target.value;
    console.log(newData);
    SetSearchText(newData);
  };
  const activeButton = () => {
    console.log('enter!');
    console.log('검색값: ', searchText);
    setSearchAddress(searchText);
    console.log('클릭 후: ', searchAddress);
  };
  const enter = (e) => {
    if (e.key === 'Enter') {
      activeButton();
    }
  };
  // ***** 지도 *****

  // handleCheckboxChange 함수: 체크박스를 클릭할 때마다 selectedDays 업데이트
  const handleCheckboxChange = (id, isChecked) => {
    if (isChecked) {
      setSelectedDays([...selectedDays, id]);
    } else {
      setSelectedDays(selectedDays.filter((day) => day !== id));
    }
  };

  // selectedDays 배열에서 id 값에 해당하는 name들을 가져오는 방법
  const selectedDayNames = selectedDays
    .sort()
    .map((id) => days.find((day) => day.id === id)?.name) // id에 해당하는 name 찾기
    .filter((name) => name) // undefined 값이 있을 수 있으므로 필터링
    .join(', '); // ,로 구분해서 문자열로 결합

  // select의 값 변경 시 호출되는 함수
  const handleSelectChange = (e) => {
    //shop.category(e.target.value); // 선택된 값을 상태에 저장
    shopData.shopUserDTO[e.target.name] = e.target.value;
    setShopData({ ...shopData });
  };

  // 파일 선택 시 호출되는 함수
  const handleImageChange = () => {
    const file = uploadRef.current?.files[0]; // 파일을 참조
    console.log(file);
    if (file) {
      setShopfile(file); // shopfile 상태에 파일 저장
      const reader = new FileReader(); // FileReader 생성
      reader.onloadend = () => {
        setImage(reader.result); // 파일을 읽은 후 image 상태에 URL 저장
      };
      reader.readAsDataURL(file); // 파일을 Data URL 형식으로 읽기
    }
  };

  //저장시 발생할 이벤트
  const handleClickSave = () => {
    // 수정시 넘어갈 formData
    const formData = new FormData();
    //DTO , state
    formData.append('shopfile', shopfile);
    formData.append('title', shopData.shopUserDTO.title);
    formData.append('location', shopData.shopUserDTO.location);
    formData.append('category', shopData.shopUserDTO.category);
    formData.append('days', selectedDayNames);
    formData.append('openTime', openTime);
    formData.append('closeTime', closeTime);
    formData.append('lat', position.center.lat);
    formData.append('lng', position.center.lng);

    //Back에 넘겨줄 정보들 putOne(매개변수)
    putOne(shopId, formData, shopDetailId, infoType)
      .then((data) => {
        console.log(data);
        setModify('Modified');
      })
      .catch((err) => console.log('전송실패', err));
  };

  //점포 삭제 이벤트
  const handleDelete = () => {
    deleteOne(shopId, infoType, shopDetailId).then((data) => {
      console.log(data);
      setResult('Deleted');
    });
  };

  const { moveToMain } = useCustomMove();

  const closeModal = () => {
    setResult(null); // result
    moveToMain('/'); // 등록 시 메인으로 이동
  };

  // 일반 input태그 값 작성시 실행되는 함수
  // 수정된 정보들
  const handleChangeShop = (e) => {
    shopData.shopUserDTO[e.target.name] = e.target.value;
    setShopData({ ...shopData });
  };

  // 기존이미지 삭제 delete 버튼 클릭 이벤트 핸들러
  const deleteOldImages = (filename) => {
    // 기존 이미지에서 삭제 버튼 클릭한 이미지 제외시키기
    //const resultFileNames = shopData.shop;
    // TODO - 화면에서 사라지게 수정하기기
  };

  // 오픈 시간 변경 함수
  const handleOpenTimeChange = (newOpenTime) => {
    if (newOpenTime >= closeTime) {
      setError('오픈 시간은 마감 시간보다 늦을 수 없어요.');
    } else {
      setError(''); // 오류 메시지 초기화
      setOpenTime(newOpenTime);
    }
  };

  // 마감 시간 변경 함수
  const handleCloseTimeChange = (newCloseTime) => {
    if (newCloseTime <= openTime) {
      setError('마감 시간은 오픈 시간 이후로 설정해야해요.');
    } else {
      setError(''); // 오류 메시지 초기화
      setCloseTime(newCloseTime);
    }
  };

  return (
    <div>
      <>
        {/* 결과 모달창 */}
        {result == 'Modified' ? (
          <ResultModal
            title={'상점 수정 성공'}
            content={`${shopData.shopUserDTO.shopId}번 수정 완료`}
            callbackFn={closeModal}
          />
        ) : result == 'Deleted' ? (
          <ResultModal
            title={'상점 삭제 성공'}
            content={`${shopData.shopUserDTO.shopId}번 삭제 완료`}
            callbackFn={closeModal}
          />
        ) : (
          <></>
        )}
        {/* 결과 모달창 끝 */}

        {/* 검색(엔터)용 버튼(히든) */}
        <button
          type="button"
          onClick={activeButton}
          className="hidden"
        ></button>

        {loaded ? (
          <form className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
            {/*첫번째 레이아웃*/}
            <div>
              <div>
                {/* 검색창 시작 */}
                <div className="bg-yellow-50 grid w-1/2 justify-self-center mb-3">
                  <input
                    onChange={handleInputChange}
                    onKeyDown={enter}
                    name="search"
                    type="search"
                    placeholder="주소/위치 검색..."
                    aria-label="Search"
                    className="peer col-start-1 row-start-1 block rounded-md bg-gray-200 py-1.5 pl-10 pr-3 text-sm/6 text-black outline-none placeholder:text-black
                            focus:bg-white focus:text-gray-900 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-white/40 focus:placeholder:text-gray-400"
                  />
                  <MagnifyingGlassIcon
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-black peer-focus:text-gray-400"
                  />
                </div>{' '}
                {/* 지도 부분 시작 */}
                <Map // 지도를 표시할 Container
                  id="map"
                  center={position.center}
                  isPanto={position.isPanto}
                  style={{
                    width: '100%',
                    height: '50vh',
                    borderRadius: '15px',
                    borderColor: 'blue',
                  }}
                  level={3} // 지도의 확대 레벨
                  onClick={(_, mouseEvent) => {
                    const latlng = mouseEvent.latLng;
                    setPosition({
                      center: { lat: latlng.getLat(), lng: latlng.getLng() },
                      isPanto: true,
                    });
                  }}
                >
                  <MapMarker position={position.center ?? center} />
                </Map>
                <p className="text-center pt-1 text-gray-600">
                  제보/등록할 점포의 위치를 클릭해서 지정해주세요!
                </p>
                <div id="clickLatlng" className="hidden">
                  {position &&
                    `위도: ${position.center.lat}, \r\n 경도: ${position.center.lng}`}
                </div>{' '}
                {/* 지도 끝 */}
                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                  {/* old images */}
                  <div className="bg-white col-span-full">
                    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
                      <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:grid-rows-2 sm:gap-x-6 lg:gap-8">
                        <div className="group relative aspect-[2/1] overflow-hidden rounded-lg sm:row-span-2 sm:aspect-square">
                          <img
                            alt={shopData.shopUserDTO.title}
                            src={`${host}/api/shop/view/${shopData.shopUserDTO.filename}`}
                            className="absolute size-full object-cover group-hover:opacity-75"
                          />
                          <div
                            aria-hidden="true"
                            className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50"
                          />
                          <div className="absolute inset-0 flex items-end p-6">
                            <button
                              type="button"
                              onClick={() => deleteOldImages(image)}
                              className="rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* 점포 사진 시작 */}
                  <div className="col-span-full">
                    <label className="block text-sm/6 font-medium text-gray-900">
                      점포 사진
                    </label>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                      <div className="text-center">
                        {image ? (
                          <img
                            src={image}
                            alt="Preview"
                            className="mx-auto rounded-lg max-w-full h-auto"
                            style={{ width: '400px', height: '300px' }} // 이미지 크기 조정
                          />
                        ) : (
                          <PhotoIcon
                            aria-hidden="true"
                            className="mx-auto size-12 text-gray-300"
                          />
                        )}
                        {!image && (
                          <>
                            <div className="mt-4 flex justify-center text-sm/6 text-gray-600">
                              <label className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                                <span>점포 사진 등록</span>
                                <input
                                  type="file"
                                  ref={uploadRef}
                                  accept="image/*"
                                  multiple={false}
                                  className="sr-only"
                                  onChange={handleImageChange}
                                />
                              </label>
                            </div>
                            <p className="text-xs/5 text-gray-500">
                              파일 크기 10MB까지 업로드 가능합니다.
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>{' '}
                  {/* 점포 사진 끝 */}
                </div>
              </div>
            </div>
            {/* Order summary 두번째 레이아웃 */}
            <div className="">
              <div className="mt-4 grid grid-cols-1 gap-y-8 sm:grid-cols-2 sm:gap-x-4">
                {/* 점포명 */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="address"
                    className="block text-sm/6 font-medium text-gray-700"
                  >
                    점포명
                  </label>
                  <div className="mt-2">
                    <input
                      name="title"
                      type="text"
                      value={shopData.shopUserDTO.title}
                      onChange={handleChangeShop}
                      className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>
                {/* 점포 주소 */}
                <div className="sm:col-span-2 mb-4">
                  <label
                    htmlFor="location"
                    className="block text-sm/6 font-medium text-gray-700"
                  >
                    점포 주소
                  </label>
                  <div className="mt-2">
                    <input
                      name="location"
                      value={shopData.shopUserDTO.location}
                      onChange={handleChangeShop}
                      type="text"
                      placeholder="신촌역 7번 출구 앞"
                      className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>
                <div className="col-span-full space-y-6">
                  {/*요일*/}
                  <div className="sm:col-span-2">
                    <fieldset>
                      <legend className="text-base text-gray-900">
                        영업일 선택: {selectedDayNames}
                      </legend>
                      <div className="mt-1 divide-y divide-gray-200 border-b border-t border-gray-200">
                        <div className="flex flex-wrap gap-2">
                          {' '}
                          {/* flexbox와 wrap 사용하여 가로로 배치 */}
                          {days.map((day) => (
                            <div
                              key={day.id}
                              className="flex items-center gap-1 pl-2"
                            >
                              <div className="min-w-0 flex-1 text-sm/6">
                                <label className="select-none font-medium text-gray-900">
                                  {day.name}
                                </label>
                              </div>
                              <div className="flex h-6 shrink-0 items-center">
                                <div className="group grid size-4 grid-cols-1">
                                  <input
                                    type="checkbox"
                                    checked={selectedDays.includes(day.id)}
                                    value={shopData.shopUserDTO.days}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        day.id,
                                        e.target.checked
                                      )
                                    }
                                    className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="mb-4">{/* 여백 */}</div>
                    </fieldset>
                  </div>
                  {/* 오픈시간과 마감시간을 한 줄에 배치 */}
                  <div className="sm:col-span-2 space-y-1 mt-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        {/* 오픈시간 */}
                        <label
                          htmlFor="city"
                          className="block text-sm/6 font-medium text-gray-700"
                        >
                          오픈시간
                        </label>
                        <TimePicker
                          onChange={handleOpenTimeChange} // 오픈 시간 변경 시 호출
                          value={openTime} // 현재 오픈 시간 값
                          disableClock // 시계 안보이게 하기
                        />
                      </div>

                      {/* 마감시간 */}
                      <div className="flex flex-col">
                        <label
                          htmlFor="city"
                          className="block text-sm/6 font-medium text-gray-700"
                        >
                          마감시간
                        </label>
                        <TimePicker
                          onChange={handleCloseTimeChange} // 마감 시간 변경 시 호출
                          value={closeTime} // 현재 마감 시간 값
                          disableClock // 시계 안보이게 하기
                        />
                      </div>
                    </div>
                  </div>
                  {/* 영업시간 오류 메시지 표시 */}
                  <div className="sm:col-span-2 space-y-2">
                    {error && <p style={{ color: 'red' }}>{error}</p>}{' '}
                    <div className="hidden">
                      <p>오픈 시간: {openTime}</p>
                      <p>마감 시간: {closeTime}</p>
                    </div>
                  </div>
                  {/*카테고리*/}
                  <div className="mt-6 sm:col-span-2 space-y-2">
                    <label
                      htmlFor="category"
                      className="block text-sm/6 font-medium text-gray-700"
                    >
                      카테고리
                    </label>
                    <div className="mt-2 grid grid-cols-1">
                      <select
                        id="category"
                        name="category"
                        value={shopData.shopUserDTO.category}
                        onChange={handleSelectChange}
                        autoComplete="category-name"
                        className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      >
                        <option>카테고리를 선택하세요</option>
                        <option value="bread">붕어빵</option>
                        <option value="snack">분식</option>
                        <option value="sweetPotato">군고구마</option>
                        <option value="hotteok">호떡</option>
                      </select>
                      <ChevronDownIcon
                        aria-hidden="true"
                        className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* 버튼 시작 */}
              <div className="px-4 py-6 mt-2 sm:px-6 flex justify-end">
                {/* 등록: 등록 성공 시 메인 페이지로 이동 */}
                <button
                  type="button"
                  onClick={handleClickSave}
                  className="w-auto rounded-md border border-transparent bg-yellow-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-yellow-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                >
                  등록
                </button>
                {/* 취소: 메인 페이지로 이동 */}
                <button
                  type="button"
                  onClick={moveToMain}
                  className="w-auto ml-1 rounded-md border border-transparent px-4 py-3 text-base font-medium text-black shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                >
                  취소
                </button>
              </div>{' '}
              {/* 버튼 끝 */}
            </div>{' '}
            {/* 두 번째 레이아웃 끝 */}
          </form>
        ) : (
          <></>
        )}
      </>
    </div>
  );
};

export default ModifyUserComponent;
