import { API_SERVER_HOST } from '../../api/todoApi';
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCookie } from '../../util/cookieUtil';
import useCustomMove from '../../hooks/useCustomMove';
import { getMapListFromMyProfile } from '../../api/memberApi';
import { getShopList } from '../../api/memberApi';

const host = `${API_SERVER_HOST}/api/shop/view`;

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const RightComponent = ({ email }) => {
  const tabs = [
    {
      name: '제보한 노점',
      href: `/member/read/${email}`,
      current: true,
    },
    {
      name: '문의 내역',
      href: `/roomList`,
      current: false,
    },

  ];

  const clickTabs = (click) => {
    tabs.map((tab) =>
      tab.name === click ? (tab.current = true) : (tab.current = false)
    );
  };

  const [cookieEmail, setCookieEmail] = useState(null);
  const [shops, setShops] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };


  useEffect(() => {
    getShopList(email).then((data) => {
      console.log('RightComponent에서 돌아온 데이터 확인: {}', data);
      setShops(data);
      setCookieEmail(email);
    });
  }, [cookieEmail, email]);

  const { moveToShopFromMyProfile } = useCustomMove();

  // 경로에서 받은 shopId
  const clickList = (shopId) => {
    console.log('목록 클릭: ', shopId);
    // 커스텀 훅: 상세 페이지로 이동
    moveToShopFromMyProfile(shopId);
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {shops.length > 0 ? (
        <section aria-labelledby="section-1-title">
          <h2 id="section-1-title" className="sr-only">
            Section Right
          </h2>
          <div>
            <div className="grid grid-cols-1 sm:hidden">
              <select
                defaultValue={tabs.find((tab) => tab.current).name}
                aria-label="Select a tab"
                className="col-start-1 row-start-1 w-full appearance-none bg-white shadow py-2 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
              >
                {tabs.map((tab) => (
                  <option key={tab.name}>{tab.name}</option>
                ))}
              </select>
            </div>
            <div className="hidden sm:block">
              <div className="border-b border-gray-300">
                <nav aria-label="Tabs" className="-mb-px flex bg-white shadow">
                  {tabs.map((tab) => (
                    <Link
                      key={tab.name}
                      to={tab.href}
                      onClick={() => {
                        clickTabs(tab.name);
                      }}
                      // aria-current={tab.current ? 'page' : undefined}
                      className={classNames(
                        tab.current
                          ? 'border-indigo-500 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 hover:bg-white',
                        'w-1/3 border-b-2 px-1 py-4 text-center text-sm font-medium'
                      )}
                    >
                      {tab.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          <div className="overflow-hidden bg-white shadow">
            <table className="w-full p-6">
              {/* Your content */}
              <tbody>
                <tr role="list" className="divide-y divide-white-100">
                  {shops.map((shop, index) => (
                    <td
                      key={index}
                      className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-white sm:px-6 lg:px-8"
                      onClick={() => {
                        clickList(shop.shopId);
                      }}
                    >
                      <div className="flex min-w-0 justify-center gap-x-2">
                        <img
                          alt={shop.title}
                          src={`${host}/${shop.filename}`}
                          className="size-16 flex-none rounded-lg bg-gray-50"
                        />
                      </div>
                      <div className="min-w-0 flex-auto justify-center">
                        <div
                          className="text-m/6 font-semibold text-gray-900"
                          style={{
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {shop.title}
                        </div>
                        <div
                          className="mt-1 text-s/4 text-gray-500"
                          style={{
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {shop.location}
                        </div>
                      </div>

                      <div className="flex items-end justify-center">
                        <div className="hidden sm:flex sm:flex-col sm:items-end text-m/6 font-semibold text-gray-900">
                          {
                            shop.category === 'bread'
                              ? '붕어빵'
                              : shop.category === 'snack'
                                ? '분식'
                                : shop.category === 'hotteok'
                                  ? '호떡'
                                  : shop.category === 'sweetPotato'
                                    ? '군고구마'
                                    : data.category // 조건에 맞지 않으면 원래 값 출력
                          }
                          {shop.open === true ? (
                            <div className="mt-1 text-s/4 text-gray-500">
                              영업 중
                            </div>
                          ) : (
                            <div className="mt-1 text-s/4 text-gray-500">
                              영업 시작 전
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <section aria-labelledby="section-1-title">
          <div>
            <div className="grid grid-cols-1 sm:hidden relative">
              {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
              <select
                defaultValue={tabs.find((tab) => tab.current).name}
                aria-label="Select a tab"
                onClick={handleToggle}
                onChange={(e) => {
                  const selectedTab = tabs.find((tab) => tab.name === e.target.value);
                  if (selectedTab) {
                    window.location.href = selectedTab.href; // 선택된 탭의 URL로 이동
                  }
                }}
                className="w-full appearance-none bg-amber-100 shadow py-2 pl-3 pr-10 text-base text-amber-900 outline outline-1 -outline-offset-1 outline-amber-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-amber-500 rounded-lg"
              >
                {tabs.map((tab) => (
                  <option key={tab.name} className="rounded-lg bg-amber-100 hover:bg-amber-200 w-full"
                  // style={{
                  //   width: "100%", // 드롭다운 너비 강제 지정
                  // }}
                  >
                    {tab.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg
                  className="w-4 h-4 text-amber-900 transition-transform duration-200"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                  style={{
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <div className="hidden sm:block">
              <div>
                <nav
                  aria-label="Tabs"
                  className="flex bg-amber-100 border  border-amber-300 rounded-lg"
                >
                  {tabs.map((tab) => (
                    <Link
                      key={tab.name}
                      to={tab.href}
                      onClick={() => {
                        clickTabs(tab.name);
                      }}
                      // aria-current={tab.current ? 'page' : undefined}
                      className={classNames(
                        tab.current
                        ? 'border-amber-500 text-amber-900 hover:border-amber-300 hover:bg-amber-200 border-b-2 rounded-bl-lg rounded-br-sm hover:rounded-lg'
                        : 'border-transparent text-amber-700 hover:border-amber-300 hover:bg-amber-200 ',
                      'w-1/2 py-4 text-center text-sm font-medium transition-colors duration-200'
                      )}
                    >
                      {tab.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default RightComponent;
