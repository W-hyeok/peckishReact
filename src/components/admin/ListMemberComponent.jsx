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
      console.log('멤버리스트 data 확인: {}', data);
      setServerData(data);
    });
  };

  return (
    <>
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-gray-500">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  이메일
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  닉네임
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  전화번호
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  사업자 등록번호
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
                  className={`${member.memberStat === 2 ? 'hover:bg-red-200 cursor-pointer bg-red-300' : ''}`}
                >
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {member.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {member.nickname}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {member.phone}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {member.businessNumber}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {member.memberStat == 2
                      ? '승인 대기'
                      : member.memberStat == 1
                        ? '활동 가능 회원'
                        : '탈퇴 회원'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <PageComponent
        serverData={serverData}
        move={moveToListmem}
      ></PageComponent>
    </>
  );
};

export default ListMemberComponent;
