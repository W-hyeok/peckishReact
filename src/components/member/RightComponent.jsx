import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
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
      name: '제보한 가게',
      href: `/member/read/${email}`,
      current: true,
    },
    {
      name: '방문한 가게',
      href: `/member/read/${email}`,
      current: false,
    },
    {
      name: '즐겨찾는 가게 ',
      href: `/member/read/${email}`,
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
    <div className="grid grid-cols-1 gap-4 lg:col-span-2">
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
                className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-orange-200 shadow py-2 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
              >
                {tabs.map((tab) => (
                  <option key={tab.name}>{tab.name}</option>
                ))}
              </select>
            </div>
            <div className="hidden sm:block">
              <div className="border-b border-gray-300">
                <nav
                  aria-label="Tabs"
                  className="-mb-px flex  bg-orange-200 shadow"
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
                          ? 'border-indigo-500 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 hover:bg-orange-100',
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

          <div className="overflow-hidden rounded-lg bg-orange-200 shadow">
            <table className="w-full p-6">
              {/* Your content */}
              <tbody>
                <tr role="list" className="divide-y divide-orange-100">
                  {shops.map((shop, index) => (
                    <td
                      key={index}
                      className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-orange-100 sm:px-6 lg:px-8"
                      onClick={() => {
                        clickList(shop.shopId);
                      }}
                    >
                      <div className="flex min-w-0 justify-center gap-x-2">
                        <img
                          alt={shop.title}
                          src={`${host}/${shop.filename}`}
                          className="size-16 flex-none rounded-e-full bg-gray-50"
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
            <div className="grid grid-cols-1 sm:hidden">
              {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
              <select
                defaultValue={tabs.find((tab) => tab.current).name}
                aria-label="Select a tab"
                className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-orange-200 shadow py-2 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
              >
                {tabs.map((tab) => (
                  <option key={tab.name}>{tab.name}</option>
                ))}
              </select>
            </div>
            <div className="hidden sm:block">
              <div className="border-b border-gray-300">
                <nav
                  aria-label="Tabs"
                  className="-mb-px flex  bg-orange-200 shadow"
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
                          ? 'border-indigo-500 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 hover:bg-orange-100',
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
        </section>
      )}
    </div>
  );
};

export default RightComponent;
