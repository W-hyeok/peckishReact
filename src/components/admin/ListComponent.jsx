import React, { useEffect, useState } from 'react';
import useCustomMove from '../../hooks/useCustomMove';
import { getAdminList } from '../../api/adminApi';
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

const ListComponent = () => {
  const { page, moveToList, moveToRead, refresh } = useCustomMove();
  const size = 10;
  const [serverData, setServerData] = useState(initState);

  useEffect(() => {
    getAdminList({ page, size }).then((data) => {
      console.log(data);
      setServerData(data);
    });
  }, [page, refresh]);

  return (
    <>
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-gray-300">
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
                  회원 유형
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
                  연락처
                </th>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-lg font-bold text-gray-900 sm:pl-0"
                >
                  가입일자
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {serverData.list.map((member) => (
                <tr
                  key={member.email}
                  onClick={() => moveToRead(member.email)}
                  className="cursor-pointer"
                >
                  <td className="py-3.5 pl-4 pr-3 text-left text-lg font-normal text-gray-900 sm:pl-0">
                    {member.email}
                  </td>
                  <td className="py-3.5 pl-4 pr-3 text-left text-lg font-normal text-gray-900 sm:pl-0">
                    {member.roleNames[0] === 'ADMIN' ? (
                      <span className="text-blue-600">관리자</span>
                    ) : member.roleNames.length == 1 ? (
                      <span className="text-green-600">일반회원</span>
                    ) : (
                      <span className="text-red-600">사업자 회원</span>
                    )}
                  </td>
                  <td className="py-3.5 pl-4 pr-3 text-left text-lg font-normal text-gray-900 sm:pl-0">
                    {member.nickname}
                  </td>
                  <td className="py-3.5 pl-4 pr-3 text-left text-lg font-normal text-gray-900 sm:pl-0">
                    {member.phone}
                  </td>
                  <td className="py-3.5 pl-4 pr-3 text-left text-lg font-normal text-gray-900 sm:pl-0">
                    {new Date(member.regDate)
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
      <PageComponent serverData={serverData} move={moveToList}></PageComponent>
    </>
  );
};

export default ListComponent;
