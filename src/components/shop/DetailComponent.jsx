import { Fragment, useEffect, useState } from 'react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import DetailUserComponent from './DetailUserComponent';
import DetailOwnerComponent from './DetailOwnerComponent';
import { getMap } from '../../api/mapApi';
import { Navigate, useNavigate } from 'react-router-dom';

/*
// shop state 초기화 객체
const initState = { == shop
  //back 에서 넘어오는 데이터(dto) 구조와 동일하게
  shopDTO: null,
  shopOwnerDTO: null,
  menuOwnerList: [],
  shopUserDTO: null,
  menuUserList: [],
};
*/

const DetailComponent = ({ shop, shopId }) => {
  console.log('***********DetailComponent***********');
  console.log(shop);
  console.log(shopId);

  const user = {
    name: '제보된 정보 없음',
    imageUrl: '/src/assets/shop/notReport.png',
  };
  const owner = {
    name: '인증된 정보 없음',
    imageUrl: '/src/assets/shop/notCert.png',
  };

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
    <div
      className="bg-white"
      style={{
        borderRadius: '20px',
        boxShadow: '8px 8px gray',
        marginBottom: '20px',
      }}
    >
      <main className="m-auto mt-4 px-4 py-4 sm:px-4 sm:pb-4 sm:pt-2 lg:max-w-7xl lg:px-16">
        <TabGroup className="lg:col-span-7">
          <div className="mx-auto sm:px-8 sm:py-6 lg:max-w-7xl lg:px-8">
            <TabList className="-mb-px flex space-x-8">
              {/* First tab: 제보된 정보 */}
              <Tab className="whitespace-nowrap border-b-2 border-transparent text-sm font-medium text-gray-700 hover:border-gray-300 hover:text-gray-800 data-[selected]:border-indigo-600 data-[selected]:text-indigo-600">
                제보된 정보
              </Tab>
              {/* Second tab: 인증된 정보 */}
              <Tab className="whitespace-nowrap border-b-2 border-transparent text-sm font-medium text-gray-700 hover:border-gray-300 hover:text-gray-800 data-[selected]:border-indigo-600 data-[selected]:text-indigo-600">
                인증된 정보
              </Tab>
            </TabList>
          </div>

          {/* TabPanels containing content for each tab */}
          <TabPanels as={Fragment}>
            {/* 첫 번째 탭: 제보된 정보 */}
            <TabPanel className="text-sm text-gray-500">
              {shop.shopDTO.userData ? (
                <DetailUserComponent
                  shop={shop}
                  shopId={shopId}
                  mapData={mapData}
                  storeLoc={storeLoc}
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
                    ></img>
                    <div className="content-center">
                      <button
                        type="button"
                        onClick={handleAddShopUSER}
                        className="mt-4 w-auto rounded-md border border-transparent bg-yellow-500 px-8 py-3 font-extrabold text-lg text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-700 focus:ring-offset-2 focus:ring-offset-gray-50"
                      >
                        제보 정보 추가하기
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </TabPanel>

            {/* 두 번째 탭: 인증된 정보 */}
            <TabPanel className="text-sm text-gray-500">
              {shop.shopDTO.ownerData ? (
                <DetailOwnerComponent
                  shop={shop}
                  shopId={shopId}
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
                    ></img>
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
    </div>
  );
};

export default DetailComponent;
