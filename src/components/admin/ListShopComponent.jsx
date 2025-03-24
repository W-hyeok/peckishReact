import React, { useEffect, useState } from 'react';
import useCustomMove from '../../hooks/useCustomMove';
import { getAdminShopList } from '../../api/adminApi';
import PageComponent from '../common/PageComponent';

const initState = {
  list: [],
  pageNumList: [],
  pageRequestDTO: null,
  prev: false,
  next: false,
  totalCount: 0,
  prevPage: 0,
  nextPage: 0,
  totalPage: 0,
  current: 0,
};

const ListShopComponent = () => {
  const { page, size, moveToListshop, moveToShop, moveToRead, refresh } =
    useCustomMove();
  const [serverData, setServerData] = useState(initState);

  useEffect(() => {
    getAdminShopList({ page, size }).then((data) => {
      console.log(data);
      setServerData(data);
    });
  }, [page, size, refresh]);

  return (
    <>
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-nowrap text-xs font-thin text-gray-900 sm:pl-0"
                >
                  No
                </th>
                {/* <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-lg font-bold text-gray-900 sm:pl-0"
                >
                  노점 이름
                </th> */}
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-nowrap text-xs font-thin text-gray-900 sm:pl-0"
                >
                  운영여부
                </th>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-nowrap text-xs font-thin text-gray-900 sm:pl-0"
                >
                  제보/인증 여부
                </th>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-nowrap text-xs font-thin text-gray-900 sm:pl-0"
                >
                  이메일
                </th>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-nowrap text-xs font-thin text-gray-900 sm:pl-0"
                >
                  등록일
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {serverData.list.map((shop) => (
                <tr
                  key={shop.shopId}
                  onClick={() => moveToShop(shop.shopId)}
                  className="cursor-pointer"
                >
                  <td className="py-3.5 pl-4 pr-3 text-left text-nowrap text-xs font-thin text-gray-900 sm:pl-0">
                    {shop.shopId}
                  </td>
                  {/* <td className="py-3.5 pl-4 pr-3 text-left text-lg font-normal text-gray-900 sm:pl-0">
                    {shop.title}
                  </td> */}
                  <td className="py-3.5 pl-4 pr-3 text-left text-nowrap text-xs font-thin text-gray-900 sm:pl-0">
                    {shop.isExist ? <span>폐업중</span> : <span>운영중</span>}
                  </td>
                  <td className="py-3.5 pl-4 pr-3 text-left text-nowrap text-xs font-thin text-gray-900 sm:pl-0">
                    <span
                      className={`inline-flex rounded-lg text-nowrap text-md sm:text-xs font-thin ${
                        shop.certificate ? 'text-red-900' : 'text-blue-800'
                      }`}
                    >
                      {shop.certificate ? '사업자 인증' : '소비자 제보'}
                    </span>
                  </td>
                  <td className="py-3.5 pl-4 pr-3 text-left text-nowrap text-xs font-thin text-gray-900 sm:pl-0">
                    {shop.email}
                  </td>
                  <td className="py-3.5 pl-4 pr-3 text-left text-nowrap text-xs font-thin text-gray-900 sm:pl-0">
                    {new Date(shop.regDate)
                      .toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })
                      .replace(/\. /g, '/')
                      .replace('.', '')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <PageComponent
        serverData={serverData}
        move={moveToListshop}
      ></PageComponent>
    </>
  );
};

export default ListShopComponent;
