import React, { useEffect, useState } from 'react';
import useCustomMove from '../../hooks/useCustomMove';
import { getAdminMemberList } from '../../api/adminApi';
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

const ListMemberComponent = () => {
  const { page, size, moveToListmem, moveToRead, refresh } = useCustomMove();
  const [serverData, setServerData] = useState(initState);

  useEffect(() => {
    getAdminMemberList({ page, size: 10 }).then((data) => {
      console.log(data);
      setServerData(data);
    });
  }, [page, refresh]);

  const handlePageChange = (newPage) => {
    // 페이지 변경 시 데이터 조회
    getAdminMemberList({ page: newPage, size: 10 }).then((data) => {
      console.log(data);
      setServerData(data);
    });
  };

  return (
    <>
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                >
                  이메일
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  이름
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  회원상태
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {serverData.list.map((member) => (
                <tr
                  key={member.email}
                  onClick={() =>
                    member.memberStat === 2 && moveToRead(member.email)
                  }
                  className={`${member.memberStat === 2 ? 'hover:bg-purple-100 cursor-pointer bg-yellow-100' : ''}`}
                >
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                    {member.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {member.nickname}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {member.memberStat == 2
                      ? '승인대기'
                      : member.memberStat == 1
                        ? '일반회원'
                        : '탈퇴회원'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <PageComponent serverData={serverData} move={moveToListmem}></PageComponent>
    </>
  );
};

export default ListMemberComponent;
