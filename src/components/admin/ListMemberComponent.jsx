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
                  className="py-3.5 pl-4 pr-3 text-left text-lg font-bold text-gray-900 sm:pl-0"
                >
                  이메일
                </th>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-lg font-bold text-gray-900 sm:pl-0"
                >
                  닉네임
                </th>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-lg font-bold text-gray-900 sm:pl-0"
                >
                  전화번호
                </th>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-lg font-bold text-gray-900 sm:pl-0"
                >
                  사업자 등록번호
                </th>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-lg font-bold text-gray-900 sm:pl-0"
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
                  <td className="py-3.5 pl-4 pr-3 text-left text-lg font-normal text-gray-900 sm:pl-0">
                    {member.email}
                  </td>
                  <td className="py-3.5 pl-4 pr-3 text-left text-lg font-normal text-gray-900 sm:pl-0">
                    {member.nickname}
                  </td>
                  <td className="py-3.5 pl-4 pr-3 text-left text-lg font-normal text-gray-900 sm:pl-0">
                    {member.phone}
                  </td>
                  <td className="py-3.5 pl-4 pr-3 text-left text-lg font-normal text-gray-900 sm:pl-0">
                    {member.businessNumber}
                  </td>
                  <td className="py-3.5 pl-4 pr-3 text-left text-lg font-normal text-gray-900 sm:pl-0">
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
