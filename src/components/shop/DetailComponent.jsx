import { Fragment, useEffect, useState } from 'react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import DetailUserComponent from './DetailUserComponent';
import DetailOwnerComponent from './DetailOwnerComponent';
import { getMap } from '../../api/mapApi';
import { Navigate, useNavigate } from 'react-router-dom';
import '../../css/common.css';
import { getCookie } from '../../util/cookieUtil';
import useCustomMove from '../../hooks/useCustomMove';

const DetailComponent = ({ shop, shopId }) => {
  const cookieMember = getCookie('member')
    ? getCookie('member')
    : { email: null };
  console.log('***********DetailComponent***********');
  console.log(shop);
  console.log(shopId);

  const USER = 'USER';
  const OWNER = 'OWNER';

  const user = {
    name: '제보된 정보 없음',
    imageUrl: '/src/assets/shop/notReport.png',
  };
  const owner = {
    name: '인증된 정보 없음',
    imageUrl: '/src/assets/shop/notCert.png',
  };

  const { moveToLogin, moveToMain } = useCustomMove();
  const [mapData, setMapData] = useState(''); // 위도, 경도 정보...가 포함된 맵 데이터
  const [storeLoc, setStoreLoc] = useState({
    center: { lat: '', lng: '' },
    isPanto: true,
  }); // 현위치

  useEffect(() => {
    getMap(shopId).then((data) => {
      setMapData(data); // 맵 데이터
      setStoreLoc((store) => ({
        ...store,
        center: {
          lat: data.lat,
          lng: data.lng,
        },
      }));
      console.log('mapData: ', data);
      console.log('위도:', data.lat);
      console.log('경도:', data.lng);
    });
  }, [shopId]);

  const navigate = useNavigate();
  const handleAddShopOWNER = () => {
    navigate({ pathname: `/shop/add/${shopId}/OWNER` });
  };
  const handleAddShopUSER = () => {
    navigate({ pathname: `/shop/add/${shopId}/USER` });
  };

  // USER
  return (
    <main className="m-auto mt-4 px-4 gap-4 sm:px-4 sm:pb-4 sm:pt-2 lg:max-w-7xl lg:px-16">
      <TabGroup className="lg:col-span-7">
        <div className="mx-auto sm:px-8 sm:py-6 lg:max-w-7xl lg:px-8">
          <TabList className="flex w-[400px]">
            {/* 사용자 제보 노점 탭 */}
            <Tab
              className="
      flex-1 
      text-center 
      py-3 
      text-lg 
      text-gray-600 
      font-medium 
      hover:bg-gray-50 
      data-[selected]:bg-yellow-50 
      data-[selected]:text-yellow-600 
      data-[selected]:border-b-4 
      data-[selected]:border-yellow-500
      data-[selected]:font-semibold
      transition-colors
    "
            >
              사용자 제보 노점
            </Tab>

            {/* 사장님 등록 노점 탭 */}
            <Tab
              className="flex-1 text-center py-3 text-lg text-gray-600 font-medium  hover:bg-gray-50  data-[selected]:bg-yellow-50  data-[selected]:text-yellow-600 data-[selected]:border-b-4  data-[selected]:border-yellow-500
      data-[selected]:font-semibold
      transition-colors
    "
            >
              사장님 등록 노점
            </Tab>
          </TabList>
        </div>

        {/* TabPanels containing content for each tab */}
        <TabPanels as={Fragment}>
          {/* 상점이 존재하지 않는다면?  */}
          {shop.shopDTO.exist ? <></> : <></>}
          {/* 첫 번째 탭: 제보된 정보 */}
          <TabPanel className="p-6 text-sm text-gray-500">
            {shop.shopDTO.userData ? (
              <DetailUserComponent
                shop={shop}
                shopId={shopId}
                shopDetailId={shop.shopUserDTO.shopUserId}
                infoType={USER}
                mapData={mapData}
                storeLoc={storeLoc}
                cookieMember={cookieMember}
                moveToLogin={moveToLogin}
                moveToMain={moveToMain}
              />
            ) : (
              <div className="flex justify-center items-center">
                <div className="text-center">
                  <img
                    alt="missjebo"
                    src={user.imageUrl}
                    height={'60%'}
                    width={'60%'}
                    className="m-auto"
                  />
                  <div className="content-center">
                    <button
                      type="button"
                      onClick={handleAddShopUSER}
                      className="defaultBtn"
                    >
                      제보 정보 추가하기
                    </button>
                  </div>
                </div>
              </div>
            )}
          </TabPanel>

          {/* 두 번째 탭: 인증된 정보 */}
          <TabPanel className="p-6 text-sm text-gray-500">
            {shop.shopDTO.ownerData ? (
              <DetailOwnerComponent
                shop={shop}
                shopDetailId={shop.shopOwnerDTO.shopOwnerId}
                shopId={shopId}
                infoType={OWNER}
                mapData={mapData}
                storeLoc={storeLoc}
              />
            ) : (
              <div className="flex justify-center items-center">
                <div className="text-center">
                  <img
                    alt="misscertificated"
                    src={owner.imageUrl}
                    height={'60%'}
                    width={'60%'}
                    className="m-auto"
                  />
                  <div className="content-center">
                    <button
                      type="button"
                      onClick={handleAddShopOWNER}
                      className="mt-4 w-auto rounded-md border border-transparent bg-yellow-500 px-8 py-3 font-extrabold text-lg text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-700 focus:ring-offset-2 focus:ring-offset-gray-50"
                    >
                      인증 정보 추가하기
                    </button>
                  </div>
                </div>
              </div>
            )}
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </main>
  );
};

export default DetailComponent;
