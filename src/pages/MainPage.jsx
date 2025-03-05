import { Outlet } from 'react-router-dom';
import BasicLayout from '../layouts/BasicLayout';
import HeaderFilter from '../layouts/HeaderFilter';
import MapComponent from '../components/common/MapComponent';
import ListComponent from '../components/shop/ListComponent';
import MapComponent2 from '../components/common/MapComponent2';
import { useEffect, useState } from 'react';
import useCustomMove from '../hooks/useCustomMove';
import { getCookie } from '../util/cookieUtil';

const MainPage = () => {
  const [cookieMember, setCookieMember] = useState(''); // 쿠키 정보 가져오기
  const [data, setData] = useState(''); // 검색 클릭(히든) 전달
  const [searchAddress, setSearchAddress] = useState(''); // 검색값 전달

  const [parentData, setParentData] = useState('all'); // filterData 상태값 전닫
  const [childData, setChildData] = useState('all');

  // 인증 상태값
  const [certData, setCertData] = useState(0);
  const [transCertData, setTransCertData] = useState(0);

  // 영업 상태값
  const [openData, setOpenData] = useState(0);
  const [transOpenData, setTransOpenData] = useState(0);

  // 주소값 변경
  const handleChangeAddress = (newData) => {
    setData(newData);
  };

  // 검색 클릭(hidden)
  const handleButtonClick = () => {
    setSearchAddress(data);
  };

  // 마커 클릭
  const handleMarkerClick = () => {
    console.log('마커 클릭');
  };

  // 필터 클릭 handleFilterClick → (HeadFilter)onFilterClick
  const handleFilterClick = (e) => {
    console.log('(MainPage) 필터 클릭');
    console.log('(MainPage)', e);
    setParentData(e);
    setChildData(e);
  };

  // 제보/인증 클릭
  const handleCertFilter = (e) => {
    console.log('(MainPage) 제보/인증');
    console.log('(MainPage)', e);
    setCertData(e);
    setTransCertData(e);
  };

  // 영업중 클릭
  const handleOpenFilter = (e) => {
    console.log('(MainPage) 필터 클릭: 영업 중');
    console.log('(MainPage)', e);
    setOpenData(e);
    setTransOpenData(e);
  };

  // 위로가기 버튼
  const MoveToTop = () => {
    // top:0 >> 맨위로  behavior:smooth >> 부드럽게 이동할수 있게 설정하는 속성
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 제보/등록 버튼용 useCustomMove
  const { moveToPost, moveToLogin } = useCustomMove();

  // 쿠키 정보 가져오기 (가게 제보/등록 구분 위함) (useEffect으로 감싸야 자동 렌더링됨)
  useEffect(() => {
    // 쿠키가 있으면(getCookie('member')값이 있으면) 진행...
    if (getCookie('member')) {
      getCookie('member');
      setCookieMember(getCookie('member'));
      // 없으면 아무것도 리턴하지 않음
    } else {
      return;
    }
    // 무한 렌더링 방지를 위해(페이지 로드 시 한 번만 렌더링) 의존성 배열 추가
  }, []);
  return (
    <BasicLayout>
      <div>
        <HeaderFilter
          onChangeAddress={handleChangeAddress}
          onEnter={handleButtonClick}
          onFilterClick={handleFilterClick}
          onCertClick={handleCertFilter}
          onOpenClick={handleOpenFilter}
          filterData={parentData}
          certData={certData}
          openData={openData}
        />
        <main className="bg-[#f9dfb1]">
          {/* <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8"> */}
          <div className="mx-10">
            {/* Main 3 column grid */}
            <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-5 lg:gap-4">
              {/* Left column */}
              <div className="grid grid-cols-1 gap-4 lg:col-span-3">
                <section aria-labelledby="section-1-title">
                  <h2 id="section-1-title" className="sr-only">
                    지도에용
                  </h2>
                  <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="">
                      {/* 지도 들어갈 부분 */}
                      <MapComponent
                        data={searchAddress}
                        onButtonClick={handleButtonClick}
                        onMarkerClick={handleMarkerClick}
                        transFilterData={childData}
                        transCertData={transCertData}
                        transOpenData={transOpenData}
                      />
                    </div>
                  </div>
                </section>
              </div>

              {/* 오른쪽 영역 */}
              <div className="grid grid-cols-1 gap-4 lg:col-span-2">
                <section aria-labelledby="section-2-title">
                  <h2 id="section-2-title" className="sr-only">
                    점포 목록
                  </h2>
                  <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="">
                      {/* 목록 페이지 */}
                      <MapComponent2
                        data={searchAddress}
                        transFilterData={childData}
                        transCertData={transCertData}
                        transOpenData={transOpenData}
                        cookieMember={cookieMember}
                      />
                    </div>
                  </div>
                </section>
              </div>
            </div>
            {/* 하단 버튼(이미지)(위로가기, 제보/등록)) */}
            <div
              style={{
                position: 'fixed',
                margin: '40px',
                marginBottom: '20px',
                bottom: '0',
                right: '0',
                display: 'flex',
                justifyContent: 'center',
                width: '3%',
                zIndex: '10',
              }}
            >
              {/* 위로가기 버튼 */}
              <img
                src="./src/assets/icon/upArrow.png"
                onClick={MoveToTop}
                style={{ marginRight: '5px' }}
              />
              {/* 제보/등록 버튼 (비로그인 시 로그인 페이지로 이동) */}
              <img
                src="./src/assets/icon/regist.png"
                onClick={cookieMember ? moveToPost : moveToLogin}
              />
            </div>
          </div>
        </main>
      </div>
    </BasicLayout>
  );
};

export default MainPage;
