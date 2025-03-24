import React, { useEffect, useRef, useState } from 'react';
import { ChevronDownIcon, PhotoIcon } from '@heroicons/react/24/outline';
import TimePicker from 'react-time-picker';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import useKakaoLoader from '../../hooks/useKakaoLoader';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { postShop } from '../../api/shopApi';
import ResultModal from '../common/ResultModal';
import useCustomMove from '../../hooks/useCustomMove';
import { getCookie, setCookie } from '../../util/cookieUtil';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../../css/translate.css';

// 지도 라이브러리 사용을 위해 처음에 로드
const { kakao } = window;

const initState = {
  shopfile: null,
  title: '',
  location: '',
  days: [],
  openTime: '',
  closeTime: '',
  category: '',
  lat: '',
  lng: '',
  certificate: false,
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

const AddComponent = () => {
  //email정보 쿠키에서 꺼내오기기
  const memberCookie = getCookie('member');
  const tmpOwned = getCookie('tmpOwned');
  //console.log(memberCookie.email);

  const loginState = useSelector((state) => state.loginSlice);
  const checkRole = loginState.roleNames;
  //console.log('*********', loginState.roleNames);

  useEffect(() => {
    if (checkRole === 'USER') {
      console.log('I am USER');
    } else if (checkRole === 'OWNER') {
      console.log('I am OWNER');
    }
  }, [checkRole]);

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
        // 검색값이 없을 떄(= 기본값일 때) 실행 방지
        // 방지 안하면 자꾸 부산으로 감
        if (searchText != '') {
          setPosition({
            center: { lat: newSearch.y, lng: newSearch.x },
          });
        }
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
    //console.log(newData);
    SetSearchText(newData);
  };

  const activeButton = () => {
    console.log('enter!');
    console.log('검색값:', searchText);
    setSearchAddress(searchText);
    console.log('클릭 후:', searchAddress);
  };
  const enter = (e) => {
    if (e.key === 'Enter') {
      activeButton();
    }
  };

  // 체크된 값들을 배열로 관리 (빈 배열로 초기화) -> 추후 데이터 전송시 쉼표로 연결해 문자열로 전송
  const [selectedDays, setSelectedDays] = useState([]);
  const [shop, setShop] = useState({ ...initState });
  const [result, setResult] = useState(null); //결과 모달
  const uploadRef = useRef(null); // html id속성 대신 사용
  const [shopfile, setShopfile] = useState(null); // shopfile 상태 추가
  const [image, setImage] = useState(null);

  // 오픈 시간과 마감 시간을 상태로 관리
  const [openTime, setOpenTime] = useState('09:00'); // 오픈: 기본값 09시
  const [closeTime, setCloseTime] = useState('18:00'); // 마감: 기본값 18시
  const [error, setError] = useState(''); // 오류 메시지 상태 추가

  // handleCheckboxChange 함수: 체크박스를 클릭할 때마다 selectedDays 업데이트
  const handleCheckboxChange = (id, isChecked) => {
    if (isChecked) {
      setSelectedDays([...selectedDays, id]);
    } else {
      setSelectedDays(selectedDays.filter((day) => day !== id));
    }
  };

  // 유저, 사장인지
  const handleCheckboxCertificate = (isChecked) => {
    // 체크박스 체크 시 owned 체크
    if (memberCookie.owned == true) {
      alert('인증된 점포가 이미 존재합니다.');
      setShop({ ...shop, certificate: false });
      return;
    } else if (isChecked) {
      setShop({ ...shop, certificate: true });
    } else {
      setShop({ ...shop, certificate: false });
    }
  };

  // selectedDays 배열에서 id 값에 해당하는 name들을 가져오는 방법
  const selectedDayNames = selectedDays
    .map((id) => days.find((day) => day.id === id)?.name) // id에 해당하는 name 찾기
    .filter((name) => name) // undefined 값이 있을 수 있으므로 필터링
    .join(', '); // ,로 구분해서 문자열로 결합

  // select의 값 변경 시 호출되는 함수
  const handleSelectChange = (e) => {
    //shop.category(e.target.value); // 선택된 값을 상태에 저장
    setShop({ ...shop, category: e.target.value });
  };
  // 파일 선택 시 호출되는 함수
  const handleImageChange = () => {
    const file = uploadRef.current?.files[0]; // 파일을 참조 (input 파일 데이터 꺼내기: files는 배열이고 사진은 하나니깐 [0]방에서 한개 꺼내기기)
    if (file) {
      setShopfile(file); // shopfile 상태에 파일 저장
      const reader = new FileReader(); // FileReader 생성
      reader.onloadend = () => {
        setImage(reader.result); // 파일을 읽은 후 image 상태에 URL 저장
      };
      reader.readAsDataURL(file); // 파일을 Data URL 형식으로 읽기
    }
  };
  const { moveToMain, moveToShop } = useCustomMove();

  //저장시 발생할 이벤트
  const handleClickSave = () => {
    // shopfile 상태가 제대로 설정되었는지 확인
    // 유효성 검사
    if (!shopfile) {
      console.error('사진을 등록해주세요.');
      alert('사진을 넣어주세요');
      return;
    }
    if (!shop.title) {
      console.error('제목을 입력해주세요');
      alert('제목을 입력해주세요');
      return;
    }
    if (!shop.location) {
      console.error('위치를 입력해주세요');
      alert('위치를 입력해주세요');
      return;
    }
    if (!shop.category) {
      console.error('카테고리를 선택해주세요');
      alert('카테고리를 선택해주세요');
      return;
    }
    if (!days) {
      console.error('요일 선택해주세요');
      alert('요일을 선택해주세요');
      return;
    }
    if (memberCookie.owned === true) {
      alert('인증된 점포가 이미 존재합니다.');
      return;
    }

    // const shopfile = uploadRef.current.files[0];
    console.log('사진 파일은:', shopfile);
    console.log('제목:', shop.title);
    console.log('위치는:', shop.location);
    console.log('경도:', position.center.lng);
    console.log('위도:', position.center.lat);
    console.log('선택된 요일:', selectedDayNames);
    console.log('영업시작 시간:', openTime);
    console.log('영업시간 종료:', closeTime);
    console.log('카테고리:', shop.category);
    console.log('owner 정보 여부 : ', shop.certificate); // true/false
    if (shop.certificate) {
      setCookie('tmpOwned', true, 1);
    }
    //등록시 넘어올 formdata
    const formData = new FormData();
    //DTO , state
    formData.append('shopfile', shopfile);
    formData.append('title', shop.title);
    formData.append('location', shop.location);
    formData.append('category', shop.category);
    formData.append('days', selectedDayNames);
    formData.append('openTime', openTime);
    formData.append('closeTime', closeTime);
    formData.append('lat', position.center.lat);
    formData.append('lng', position.center.lng);
    formData.append('certificate', shop.certificate ? true : false);
    formData.append('email', memberCookie.email);

    postShop(formData)
      .then((data) => {
        console.log(data);
        setResult(data.RESULT);
      })
      .catch((err) => console.log(err));
  };

  const closeModal = () => {
    setResult(null); // result
    moveToShop(result); // 등록 시 점포 상세페이지로 이동
  };

  // 일반 input태그 값 작성시 실행되는 함수
  const handleChangeShop = (e) => {
    shop[e.target.name] = e.target.value;
    setShop({ ...shop });
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
    <>
      {/* 결과 모달창 */}
      {result ? (
        <ResultModal
          title={'상점 등록 성공'}
          content={`${result}번 등록 완료`}
          callbackFn={closeModal}
        />
      ) : (
        <></>
      )}
      {/* 결과 모달창 끝 */}

      <button type="button" onClick={activeButton} className="hidden"></button>
      <form className="mx-auto w-full max-w-4xl px-4 py-6">
        <div></div>
        <div className="">
          <div>
            <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              {/* 점포 사진 영역 */}
              <div className="col-span-full mb-8">
                <label className="block text-base font-medium text-gray-900">
                  점포 사진 <span className="text-red-500">*</span>
                </label>
                <div className="mt-2 flex justify-center rounded-lg border bg-white border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    {image ? (
                      <img
                        src={image}
                        alt="Preview"
                        className="mx-auto rounded-lg max-w-full h-auto"
                        style={{ width: '400px', height: '300px' }}
                      />
                    ) : (
                      <PhotoIcon
                        aria-hidden="true"
                        className="mx-auto size-12 text-gray-300"
                      />
                    )}
                    <div className="mt-4 flex justify-center text-sm text-gray-600">
                      <label className="relative cursor-pointer rounded-md bg-white font-semibold text-red-500  hover:text-amber-500">
                        <span>{image ? '사진 변경' : '점포 사진 등록'}</span>
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
                    <p className="text-xs text-gray-500">
                      파일 크기 10MB까지 업로드 가능합니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* 점포명 영역 */}
          <div className="sm:col-span-2 mb-8">
            <label
              htmlFor="title"
              className="block text-base font-medium text-gray-900"
            >
              점포명 <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <input
                name="title"
                type="text"
                value={shop.title}
                onChange={handleChangeShop}
                placeholder="더조은 분식"
                autoComplete="street-address"
                className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-indigo-600 sm:text-sm"
              />
            </div>
          </div>
          {/* 지도 시작 */}
          <div className="bg-yellow-50 grid w-1/2 justify-self-center mb-3">
            <input
              onChange={handleInputChange}
              onKeyDown={enter}
              name="search"
              type="search"
              placeholder="주소/위치 검색..."
              aria-label="Search"
              className="peer col-start-1 row-start-1 block rounded-md bg-gray-200 py-1.5 pl-10 pr-3 smText text-black outline-none placeholder:text-black focus:bg-white focus:text-gray-900 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-white/40 focus:placeholder:text-gray-400"
            />
            <MagnifyingGlassIcon
              aria-hidden="true"
              className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-black peer-focus:text-gray-400"
            />
          </div>
          <Map
            id="map"
            center={position.center}
            isPanto={position.isPanto}
            style={{
              width: '100%',
              height: '50vh',
              borderRadius: '15px',
              borderColor: 'blue',
            }}
            level={3}
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
          <p className="text-center smText pt-1 text-gray-600">
            <span className="text-red-500">*</span>제보/등록할 점포의 위치를
            클릭해서 지정해주세요!
          </p>
          <div id="clickLatlng" className="hidden">
            {position &&
              `위도: ${position.center.lat}, \r\n 경도: ${position.center.lng}`}
          </div>
          {/* 지도 끝  */}
          {/* 점포 주소 영역 */}
          <div className="sm:col-span-2 mb-8">
            <label
              htmlFor="location"
              className="block text-base text-gray-900"
            >
              점포 주소 <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <input
                name="location"
                value={shop.location}
                onChange={handleChangeShop}
                type="text"
                placeholder="신촌역 7번 출구 앞"
                className="block w-full rounded-md bg-white px-3 py-2 smText text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-indigo-600 sm:text-sm"
              />
            </div>
          </div>
          <div className="col-span-full space-y-6">
            <div className="sm:col-span-2">
              <fieldset>
                <legend className="text-base text-gray-900">
                  영업일 <span className="text-red-500">*</span>
                </legend>
                <div className="mt-1">
                  <div className="flex flex-wrap gap-2">
                    {days.map((day) => (
                      <div
                        key={day.id}
                        className="flex items-center gap-1 pl-2"
                      >
                        <div className="min-w-0 flex-1 text-sm">
                          <label className="select-none font-medium text-gray-900">
                            {day.name}
                          </label>
                        </div>
                        <div className="flex h-6 shrink-0 items-center">
                          <div className="group grid size-4 grid-cols-1">
                            <input
                              type="checkbox"
                              checked={selectedDays.includes(day.id)}
                              value={shop.days}
                              onChange={(e) =>
                                handleCheckboxChange(day.id, e.target.checked)
                              }
                              className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mb-4"></div>
              </fieldset>
            </div>
            {/* 오픈/마감 시간 영역 */}
            {/* <div className="sm:col-span-2 space-y-1 mt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label
                    htmlFor="openTime"
                    className="block text-sm font-medium text-gray-700"
                  >
                    오픈시간 <span className="text-red-500">*</span>
                  </label>
                  <TimePicker
                    className="w-full bg-white rounded-md border px-4 py-2 text-base text-gray-900"
                    onChange={handleOpenTimeChange}
                    value={openTime}
                    disableClock
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="closeTime"
                    className="block text-sm font-medium text-gray-700"
                  >
                    마감시간 <span className="text-red-500">*</span>
                  </label>
                  <TimePicker
                    className="w-full bg-white rounded-md border px-4 py-2 text-base text-gray-900"
                    onChange={handleCloseTimeChange}
                    value={closeTime}
                    disableClock
                  />
                </div>
              </div>
            </div> */}
            {/* 오픈시간과 마감시간을 한 줄에 배치 */}
            <div className="sm:col-span-2 space-y-1 mt-2 smText">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  {/* 오픈시간 */}
                  <label
                    htmlFor="city"
                    className="block text-base text-gray-900"
                  >
                    오픈시간
                  </label>
                  <TimePicker
                    className="bg-white"
                    onChange={handleOpenTimeChange} // 오픈 시간 변경 시 호출
                    value={openTime} // 현재 오픈 시간 값
                    disableClock // 시계 안보이게 하기
                  />
                </div>

                {/* 마감시간 */}
                <div className="flex flex-col">
                  <label
                    htmlFor="city"
                    className="block text-base text-gray-900"
                  >
                    마감시간
                  </label>
                  <TimePicker
                    className="bg-white"
                    onChange={handleCloseTimeChange} // 마감 시간 변경 시 호출
                    value={closeTime} // 현재 마감 시간 값
                    disableClock // 시계 안보이게 하기
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-2 space-y-2 smText">
              {error && <p className="text-red-500">{error}</p>}
              <div className="hidden">
                <p>오픈 시간: {openTime}</p>
                <p>마감 시간: {closeTime}</p>
              </div>
            </div>
            {/* 카테고리 선택 영역 */}
            <div className="mt-6 sm:col-span-2 space-y-2">
              <label
                htmlFor="category"
                className="block text-base text-gray-900"
              >
                카테고리
              </label>
              <div className="mt-2 relative">
                <select
                  id="category"
                  name="category"
                  value={shop.category}
                  onChange={handleSelectChange}
                  autoComplete="category-name"
                  className="w-full appearance-none rounded-md bg-white py-2 pl-3 pr-12 smText text-gray-900 focus:outline focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                >
                  <option>카테고리를 선택하세요</option>
                  <option value="bread">붕어빵</option>
                  <option value="snack">분식</option>
                  <option value="sweetPotato">군고구마</option>
                  <option value="hotteok">호떡</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDownIcon
                    className="h-5 w-5 text-gray-500"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
            {/* '사업자 인증' 버튼 */}
            {/* 일반 유저 및 사업자+인증 이력 있을 시 체크 불가, 문구 달라짐 */}
            {checkRole == 'USER' ? (
              <>
                <div className="flex h-auto shrink-0 items-center space-x-4">
                  <div className="group grid size-4 grid-cols-1">
                    <input
                      name="certificate"
                      type="checkbox"
                      disabled
                      className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                    />
                  </div>
                  <div className="flex text-lg">
                    <label className="select-none text-base text-gray-900">
                      내 점포 인증하기
                      <br/>
                      <span className="sm:text-base text-xs text-gray-600">
                        (회원정보 수정 - 사업자 정보 추가 필요)
                      </span>
                    </label>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* checkRole == USER가 아니면(OWNER면) 표시 */}
                {/* 쿠키에 owned가 true거나 직전에 등록한 적이 있어서 tmpOwned가 true면 아래 출력 */}
                {memberCookie.owned == true || tmpOwned == true ? (
                  <div className="flex h-auto shrink-0 items-center space-x-4">
                    <div className="group grid size-4 grid-cols-1">
                      <input
                        name="certificate"
                        type="checkbox"
                        disabled
                        className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                      />
                    </div>
                    <div className="flex text-lg">
                      <label className="select-none font-medium text-gray-500">
                        내 점포 인증하기
                        <span className="text-gray-400">
                          (이미 점포를 인증하셨습니다.)
                        </span>
                      </label>
                    </div>
                  </div>
                ) : (
                  // 셋 다 아니면 이하 표시
                  <div className="flex h-auto shrink-0 items-center space-x-4">
                    <div className="group grid size-4 grid-cols-1">
                      <input
                        name="certificate"
                        value={shop.certificate}
                        onChange={(e) =>
                          handleCheckboxCertificate(e.target.checked)
                        }
                        type="checkbox"
                        className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                      />
                    </div>
                    <div className="flex text-lg">
                      <label className="select-none smText text-gray-900">
                        내 점포 인증하기
                        <span className="text-gray-400">
                          (해당 점포의 사장님일 경우 체크해주세요.)
                        </span>
                      </label>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        {/* 버튼 시작 */}
        <div className="flex justify-end space-x-4 mt-2">
          <button
            type="button"
            onClick={handleClickSave}
            className="positiveBtn smText"
          >
            등록
          </button>
          <button
            type="button"
            onClick={moveToMain}
            className="negativeBtn smText"
          >
            취소
          </button>
        </div>
      </form>
    </>
  );
};

export default AddComponent;
