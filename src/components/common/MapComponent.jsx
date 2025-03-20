import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Map as KakaoMap,
  KakaoMapMarkerClustererContext,
  Map,
  MapMarker,
  MapTypeControl,
  MarkerClusterer,
  Toolbox,
  useMap,
} from 'react-kakao-maps-sdk';
import { getMapList } from '../../api/mapApi';
import useCustomMove from '../../hooks/useCustomMove';
import PermissionModal from './PermissionModal';
import activeBooth from '../../assets/icon/location_star.png';
import inactiveBooth from '../../assets/icon/location_star_off.png';
import curloc from '../../assets/icon/curloc.png';
import myLocation from '../../assets/icon/curloc3.png';
import research from '../../assets/icon/researchCur.png';
import searchLoc from '../../assets/icon/searchLoc.png';
import whereami from '../../assets/icon/whereami.png';
import mapCenterIcon from '../../assets/icon/mapCenter.png';
import redDot from '../../assets/icon/location-red.png';
import currentLocation from '../../assets/icon/currentLocation_faca15.png';
import currentLocatiion2 from '../../assets/icon/current-location-final.png';
import { EyeIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { API_SERVER_HOST } from '../../api/todoApi';
const { kakao } = window;
const host = `${API_SERVER_HOST}`;

function MapComponent({
  data,
  onButtonClick,
  handleMarkerClick,
  transFilterData,
  transCertData,
  transOpenData,
}) {
  const [serverData, setServerData] = useState([]); // 서버에서 받을 데이터
  const [isOpenData, setIsOpenData] = useState([]); // 서버데이터 중 open = true
  const [isCloseData, setIsCloseData] = useState([]); // 서버데이터 중 open = close
  const [renderingMarker, setRenderingMarker] = useState([]); // ...데이터 중 렌더링 할 것들
  const [selectedMarker, setSelectedMarker] = useState('');
  const [cate, setCate] = useState('all'); // 카테고리, 기본 all
  // const [role, setRole] = useState(0); // user: 1(true), owner: 2(false), 기본값 0 ('구분 없음')
  const [open, setOpen] = useState(''); // true: 1, 기본값: 0(준비중 포함)
  const [permission, setPermission] = useState('');
  const { moveToShop } = useCustomMove(); // 해당 가게 정보로 이동
  const [result, setResult] = useState(null);
  const [curLocBtn, setCurLocBtn] = useState(false); // 현재 위치로 이동 버튼 분기처리용
  const [popOpened, setPopOpened] = useState(false);
  const outerBtn = () => {
    setPopOpened(!popOpened);
    setSelectedMarker(''); // 선택된 마커 초기화
  };

  const [mapCenter, SetMapCenter] = useState({
    center: { lat: '', lng: '' },
  });

  // 버튼 노출 유무
  const [showButton, setShowButton] = useState(false);

  // 지도의 영역 (= 마커 렌더링 범위)
  // 기본 위치 신촌
  const [mapLoc, setMapLoc] = useState({
    level: 0,
    position: { lat: '37.55522248964399', lng: '126.93696829042793' },
    bound: {
      northLat: '37.55735246851425',
      eastlng: '126.9441701630105',
      southLat: '37.55264943622574',
      westlng: '126.92786600278056',
    },
  });

  // 마커 렌더링 제한 여부
  const [rendering, setRendering] = useState(false);

  // 현재 위치
  const [curLoc, setCurLoc] = useState({
    // 지도의 초기 위치
    center: { lat: '', lng: '' },
    // 지도 위치 변경시 panto를 이용할지(부드럽게 이동)
    isPanto: false,
  });

  // 지도 기본 위치 설정
  const [state, setState] = useState({
    // 지도의 초기 위치
    center: { lat: '37.55522248964399', lng: '126.93696829042793' },
    // 지도 위치 변경시 panto를 이용할지(부드럽게 이동)
    isPanto: true,
  });

  // 검색한 위치의 중심 좌표
  const [searchAddress, setSearchAddress] = useState('');

  // 권한 정보 확인 (permission api)
  useEffect(() => {
    navigator.permissions
      .query({ name: 'geolocation' })
      .then(function (status) {
        console.log('위치 권한 상태: ', status.state);
        // 위치 권한 정보 업데이트
        // 정보: grant(허용) / denied(거부) / prompt(요청)
        setPermission(status.state);
        status.onChange = function () {
          console.log('위치 권한 상태 변경!', this.state);
        };
      });
  }, [status.state]);

  // 현재 사용자 위치 받아오기 (geolocation)
  useEffect(() => {
    if (navigator.geolocation) {
      setPermission('granted');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // 위치 상태값(state) 설정
          setState((prev) => ({
            ...prev,
            center: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
            isLoading: false,
          }));
          // 현재 위치 상태값(curLoc) 설정
          setCurLoc((prev) => ({
            ...prev,
            center: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
            isLoading: false,
          }));
        },
        (err) => {
          setState((prev) => ({
            ...prev,
            errMsg: err.message,
            isLoading: false,
          }));
        }
      );
    } else {
      setState((prev) => ({
        ...prev,
        errMsg: 'geolocation 사용 불가',
        isLoading: false,
      }));
    }
  }, []);

  // 카테고리별 조회
  useEffect(() => {
    // 최초로 한 번은 데이터 불러오기
    if (renderingMarker.length == 0 && serverData.length == 0) {
      getMapList(transFilterData).then((data) => {
        console.log('cate:', cate);
        console.log('현재 영역: ', mapLoc.bound);
        console.log('transFilterData: ', transFilterData);
        // setRole(transCertData); // 인증값
        setServerData(data); // 점포 목록 데이터 (전체)
        console.log('serverData: ', serverData);
        // 렌더링할 마커 (조건: 전체 목록(data 혹은 serverData) 중 화면 범위(ne/sw)에 들어오는 것)
        // 재검색 버튼이 없거나 카테고리 값이 all이 아닐 경우(= 카테고리를 선택한 경우)
        setRenderingMarker(
          data.filter(
            (e) =>
              e.lat > mapLoc.bound.southLat &&
              e.lat < mapLoc.bound.northLat &&
              e.lng > mapLoc.bound.westlng &&
              e.lng < mapLoc.bound.eastlng
          )
        );
        console.log('렌더링되는 마커: ', renderingMarker);
        setCate(transFilterData); // 카테고리값

        // 렌더링할 마커 중에서 영업 중
        // 렌더링할 마커가 없으면 data에서 가져오기(초기 마커용)
        if (renderingMarker.length != 0) {
          setIsOpenData(renderingMarker.filter((e) => e.status == 'opened')); // (...영업 중)
          console.log('isOpenData: ', isOpenData);
          // 렌더링할 마커 중에서 준비 중
          setIsCloseData(renderingMarker.filter((e) => e.status == 'closed')); // (...준비 중)
          console.log('isCloseData: ', isCloseData);
        } else {
          setIsOpenData(data.filter((e) => e.status == 'opened')); // (...영업 중)
          console.log('isOpenData: ', isOpenData);
          // 렌더링할 마커 중에서 준비 중
          setIsCloseData(data.filter((e) => e.status == 'closed')); // (...준비 중)
          console.log('isCloseData: ', isCloseData);
        }
        if (isOpenData) {
          setOpen(transOpenData); // 영업값
        }
      });
      // 이후 데이터들은 렌더링된 마커가 있을 때만 불러오기
    } else if (renderingMarker.length > 0) {
      getMapList(transFilterData).then((data) => {
        console.log('cate:', cate);
        console.log('현재 영역: ', mapLoc.bound);
        console.log('transFilterData: ', transFilterData);
        // setRole(transCertData); // 인증값
        setServerData(data); // 점포 목록 데이터 (전체)
        console.log('serverData: ', serverData);
        // 렌더링할 마커 (조건: 전체 목록(data 혹은 serverData) 중 화면 범위(ne/sw)에 들어오는 것)
        // 재검색 버튼이 없거나 카테고리 값이 all이 아닐 경우(= 카테고리를 선택한 경우)
        setRenderingMarker(
          data.filter(
            (e) =>
              e.lat > mapLoc.bound.southLat &&
              e.lat < mapLoc.bound.northLat &&
              e.lng > mapLoc.bound.westlng &&
              e.lng < mapLoc.bound.eastlng
          )
        );
        console.log('렌더링되는 마커: ', renderingMarker);
        setCate(transFilterData); // 카테고리값

        // 렌더링할 마커 중에서 영업 중
        // 렌더링할 마커가 없으면 data에서 가져오기(초기 마커용)
        if (renderingMarker.length != 0) {
          setIsOpenData(renderingMarker.filter((e) => e.status == 'opened')); // (...영업 중)
          console.log('isOpenData: ', isOpenData);
          // 렌더링할 마커 중에서 준비 중
          setIsCloseData(renderingMarker.filter((e) => e.status == 'closed')); // (...준비 중)
          console.log('isCloseData: ', isCloseData);
        } else {
          setIsOpenData(data.filter((e) => e.status == 'opened')); // (...영업 중)
          console.log('isOpenData: ', isOpenData);
          // 렌더링할 마커 중에서 준비 중
          setIsCloseData(data.filter((e) => e.status == 'closed')); // (...준비 중)
          console.log('isCloseData: ', isCloseData);
        }
        if (isOpenData) {
          setOpen(transOpenData); // 영업값
        }
      });
    }
  }, [transFilterData, cate, transOpenData, rendering, showButton]);

  // 주소에 해당하는 마커 표시
  useEffect(() => {
    // 주소를 좌표로 변환하는 함수
    const geocoder = new kakao.maps.services.Geocoder();

    // 장소를 좌표로 변환하는 함수
    const ps = new kakao.maps.services.Places();

    // 주소를 좌표로 변환하여 state에 저장
    let callback = function (result, status) {
      if (status === kakao.maps.services.Status.OK) {
        const newSearch = result[0];
        // 넘어온 검색값(data)이 있을 때만 state값 설정 (초기 설정(부산) 방지)
        if (data) {
          setState({
            center: { lat: newSearch.y, lng: newSearch.x },
          });
          SetMapCenter({
            center: { lat: newSearch.y, lng: newSearch.x },
          });
        }
      }
    };
    geocoder.addressSearch(`${searchAddress}`, callback); // 주소 → 좌표
    ps.keywordSearch(`${searchAddress}`, callback); // 장소 → 좌표
    console.log('현재 위도:', curLoc.center.lat); // 위도
    console.log('현재 경도:', curLoc.center.lng); // 경도
  }, [searchAddress]); // 이거 없으면 안됨

  useEffect(() => {
    if (data) {
      setSearchAddress(data);
    }
  }, [data]);

  // 마커: 영업 중
  const OpenMarkerContainer = ({
    position,
    content,
    index,
    onClick,
    isClicked,
  }) => {
    const map = useMap();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      if (isClicked) {
        console.log('isClicked?', isClicked);
        setIsVisible(false);
        setSelectedMarker('');
      }
    }, [isClicked]);

    return (
      <>
        {/* 조건부 렌더링: status = opened */}
        {renderingMarker && isOpenData && (
          <MapMarker
            position={position}
            onClick={() => {
              setIsVisible(!isVisible);
            }}
            // onMouseOver={() => setIsVisible(true)}
            // onMouseOut={() => setIsVisible(false)}
            image={{
              // 그냥 객체로는 못 가져오고, ${} 형태로 가져와야 함
              src: `${activeBooth}`,
              // 마커이미지 주소
              size: {
                width: 50,
                height: 55,
              }, // 마커이미지의 크기입니다
            }}
          >
            {isVisible && (
              /* 자동 생성되는 부모 요소의 border 덮어쓰기 위해 outline 설정, 4 이상이어야 가려짐 */
              <div className="relative p-2 rounded-lg bg-white outline outline-4 outline-yellow-300">
                <div className="flex items-start">
                  {content}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // 부모 onClick 전파 방지
                      setIsVisible(false); // 해당 마커의 내용만 숨김
                    }}
                    className="mt-1.5"
                  >
                    <XMarkIcon className="close size-6" title="닫기" />
                  </button>
                </div>
              </div>
            )}
          </MapMarker>
        )}
      </>
    );
  };

  // 마커: 영업 준비 중
  const CloseMarkerContainer = ({ position, content, onClick, isClicked }) => {
    const map = useMap();
    const [isVisible, setIsVisible] = useState(false); // 마커 정보 노출 여부 (기본 false)

    const handleMarkerClick = () => {
      onClick(); // 부모 컴포넌트에서 전달된 onClick 함수 호출
    };

    return (
      <>
        {/* 조건부 렌더링: status = closed */}
        {/* 반드시 조건 뒤에 연산자를 붙여야 함, 그렇지 않으면 함수로 인식함 */}
        {/* 'opened'만 썼다가 함수로 인식(바로 뒤에 '(' 가 옴)해서 문제 생겼음 */}
        {renderingMarker && isCloseData && transOpenData !== 'opened' && (
          <MapMarker
            position={position}
            onClick={() => {
              setIsVisible(!isVisible);
            }}
            // onMouseOver={() => setIsVisible(true)}
            // onMouseOut={() => setIsVisible(false)}
            image={{
              // 그냥 객체로는 못 가져오고, ${} 형태로 가져와야 함
              src: `${inactiveBooth}`,
              // 마커이미지 주소
              size: {
                width: 40,
                height: 43,
              }, // 마커이미지의 크기입니다
            }}
          >
            {isVisible && (
              <div className="relative p-2 rounded-lg bg-white outline outline-4 outline-gray-400">
                <div className="flex items-start">
                  {content}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // 부모 onClick 전파 방지
                      setIsVisible(false); // 해당 마커의 내용만 숨김
                    }}
                    className="mt-1.5"
                  >
                    <XMarkIcon className="close size-6" title="닫기" />
                  </button>
                </div>
              </div>
            )}
          </MapMarker>
        )}
      </>
    );
  };

  const closeModal = () => {
    setResult(null);
  };

  // 현위치로 이동 버튼 (좌상단)
  const EventButtonContainer = () => {
    const map = useMap();
    const mapCenter = map.getCenter();
    const mapLatLng = {
      lat: mapCenter.getLat(),
      lng: mapCenter.getLng(),
    };
    const goBack = () => {
      // 위치 권한 있을(granted) 떄만 실행
      if (permission == 'granted') {
        const newLatLng = new kakao.maps.LatLng(
          curLoc.center.lat,
          curLoc.center.lng
        );
        map.panTo(newLatLng);
        setCurLocBtn(true);
        console.log('이동한 현재 위치:', mapLatLng);
      } else {
        return setResult('asdf');
      }
    };
    return (
      <>
        {result === 'asdf' ? (
          <PermissionModal callbackFn={closeModal} />
        ) : (
          <></>
        )}
        <button
          onClick={goBack}
          style={{
            position: 'absolute', // 지도 위에 버튼 깔기 위해 설정
            zIndex: '3', // 최소 지도 레이어(1)보다 높아야 함
            margin: '10px',
            width: '50px',
          }}
          className=""
        >
          {!curLocBtn ? (
            <img
              className="rounded-full w-auto h-auto shadow-md hover:bg-yellow-500 hover:shadow-yellow-500 hover:shadow-xl"
              src={currentLocatiion2}
              title="현재 위치로 이동"
            />
          ) : (
            <img
              className="rounded-full w-auto h-auto shadow-yellow-500 shadow-md"
              src={currentLocatiion2}
              title="현재 위치로 이동"
            />
          )}
        </button>
      </>
    );
  };

  // 현 위치에서 재검색 이벤트
  const searchCurLoc = () => {
    setRenderingMarker(
      serverData.filter(
        (e) =>
          e.lat > mapLoc.bound.southLat &&
          e.lat < mapLoc.bound.northLat &&
          e.lng > mapLoc.bound.westlng &&
          e.lng < mapLoc.bound.eastlng
      )
    );
    // 재검색 버튼 false로 변경하여 숨기기
    setShowButton(false);
    // Rendering true로 변경
    setRendering(true);
    // 지도 중심 마커 표시
    SetMapCenter({
      center: {
        lat: mapLoc.position.lat,
        lng: mapLoc.position.lng,
      },
    });
  };

  // 현 위치에서 재검색 버튼 컨테이너
  const EventResearchContainer = () => {
    return (
      <>
        {showButton && (
          <button
            onClick={searchCurLoc}
            style={{
              position: 'absolute', // 지도 위에 버튼 깔기 위해 설정
              zIndex: '3', // 최소 지도 레이어(1)보다 높아야 함
              marginTop: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              boxShadow: '0 2px 2px 2px rgba(0,0,0,0.4)',
            }}
            className="rounded-3xl bg-white border-[2px] border-blue-600 text-blue-600 font-semibold px-4 py-2 h-fit w-fit hover:bg-blue-600 hover:text-white"
          >
            현 위치에서 검색
          </button>
        )}
      </>
    );
  };

  return (
    <>
      <div id="mapwrap" className="">
        {/* 카카오맵 */}
        <Map
          center={state.center} // state값에 따라 지도 중심 설정 (state: 페이지 로딩, 검색 시 변동)
          isPanto={state.isPanto}
          style={{
            width: '100%',
            height: '100vh',
            position: 'relative', // 지도 위에 버튼 깔기 위해 설정
            float: 'right', // 상동
          }}
          level={3}
          // 지도 영역 변경 감지
          onBoundsChanged={(e) => {
            const level = e.getLevel();
            const bound = e.getBounds();
            const latLng = e.getCenter();
            setMapLoc({
              level: level,
              position: {
                lat: latLng.getLat(),
                lng: latLng.getLng(),
              },
              bound: {
                northLat: bound.getNorthEast().getLat(),
                eastlng: bound.getNorthEast().getLng(),
                southLat: bound.getSouthWest().getLat(),
                westlng: bound.getSouthWest().getLng(),
              },
            });
            // console.log('지도 영역: ', mapLoc.bound);
            setShowButton(true);
            setCurLocBtn(false);
          }}
        >
          {/* <DrawingManager> */}
          {/* <Toolbox /> */}

          {/* 현재 내 위치 마커. 모든 마커는 반드시 맵 다음에 와야 함 */}
          {!curLoc.isLoading && (
            <MapMarker
              position={curLoc.center} // curLoc 값에 따라 마커 설정 (고정)
              image={{
                src: `${redDot}`,
                size: {
                  width: 55,
                  height: 55,
                },
              }}
              title="나는 여기에 있어용"
            />
          )}
          {/* 지도의 중심 마커. 모든 마커는 반드시 맵 다음에 와야 함 */}
          {!mapCenter.isLoading && (
            <MapMarker
              position={mapCenter.center} // curLoc 값에 따라 마커 설정 (고정)
              image={{
                src: `${currentLocation}`,
                size: {
                  width: 40,
                  height: 40,
                },
              }}
              title="현재 지도의 중심입니다."
            />
          )}
          {/* 내 위치 버튼 */}
          <EventButtonContainer />

          {/* 현 위치에서 재검색 버튼 */}
          <EventResearchContainer />

          {/* 맵 마커 목록: 영업 중 */}
          <MarkerClusterer
            averageCenter={true}
            minLevel={5}
            calculator={[10, 30, 50]}
            styles={[
              {
                // calculator 각 사이 값 마다 적용될 스타일을 지정한다
                width: '30px',
                height: '30px',
                background: 'rgba(240, 236, 20, 1)',
                borderRadius: '15px',
                color: '#000',
                textAlign: 'center',
                fontWeight: 'bold',
                lineHeight: '31px',
                boxShadow: '0 2px 2px 3px rgba(0,0,0,0.4)',
              },
            ]}
          >
            {renderingMarker.map((data, index) => {
              if (data.status == 'opened') {
                return (
                  <OpenMarkerContainer
                    index={index}
                    isClicked={selectedMarker === index}
                    key={`OpenMarkerContainer-${data.lat}-${data.lng}`}
                    position={{ lat: data.lat, lng: data.lng }}
                    // 마커 마우스 올리면 나타나는 화면 div
                    content={
                      <div className="wrap p-2">
                        <div className="info">
                          <div className="title flex min-w-max">
                            <div className="font-semibold">
                              {data.title} /{' '}
                              {
                                data.category === 'bread'
                                  ? '붕어빵'
                                  : data.category === 'snack'
                                    ? '분식'
                                    : data.category === 'hotteok'
                                      ? '호떡'
                                      : data.category === 'sweetPotato'
                                        ? '군고구마'
                                        : data.category // 조건에 맞지 않으면(예외) 원래 값 출력
                              }
                            </div>
                          </div>
                          <hr className="mb-2" />
                          <div className="body">
                            <img
                              src={`${host}/api/shop/view/${data.filename}`}
                              className="size-24 rounded-md mb-2"
                            />
                            <div className="desc min-w-max">
                              <div className="ellipsis">{data.location}</div>
                              <div>
                                <button
                                  onClick={() => {
                                    console.log('shopId: ', data.shopId);
                                    moveToShop(data.shopId);
                                  }}
                                  target="_blank"
                                  className="link text-blue-400 text-sm"
                                  rel="noreferrer"
                                >
                                  자세히 보기
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    }
                  />
                );
              } else {
                return (
                  <CloseMarkerContainer
                    index={index}
                    isClicked={selectedMarker === index}
                    key={`CloseMarkerContainer-${data.lat}-${data.lng}`}
                    position={{ lat: data.lat, lng: data.lng }}
                    // 마커 마우스 올리면 나타나는 화면 div
                    content={
                      <div className="wrap p-2">
                        <div className="info">
                          <div className="title flex min-w-max">
                            <div className="bg-gray-300">
                              {data.title} /{' '}
                              {
                                data.category === 'bread'
                                  ? '붕어빵'
                                  : data.category === 'snack'
                                    ? '분식'
                                    : data.category === 'hotteok'
                                      ? '호떡'
                                      : data.category === 'sweetPotato'
                                        ? '군고구마'
                                        : data.category // 조건에 맞지 않으면(예외) 원래 값 출력
                              }
                            </div>
                          </div>
                          <hr className="my-1" />
                          <div className="body">
                            <img
                              src={`${host}/api/shop/view/${data.filename}`}
                              className="size-24"
                            />
                            <div className="desc min-w-max">
                              <div className="ellipsis">{data.location}</div>
                              <div>
                                <button
                                  onClick={() => {
                                    console.log('shopId: ', data.shopId);
                                    moveToShop(data.shopId);
                                  }}
                                  target="_blank"
                                  className="link text-blue-400 text-sm"
                                  rel="noreferrer"
                                >
                                  자세히 보기
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    }
                  />
                );
              }
            })}
          </MarkerClusterer>
        </Map>
        <button onClick={onButtonClick} className="hidden"></button>
      </div>
    </>
  );
}

export default MapComponent;
