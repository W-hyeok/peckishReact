import { useEffect, useState } from 'react';
import { getOneMember } from '../../api/adminApi';
import useCustomMove from '../../hooks/useCustomMove';

// todo state 초기화 객체
const initState = {
  email: '',
  nickname: '',
  memberStat: 0,
};

const ReadMemberComponent = ({ email }) => {
  const [member, setMember] = useState(initState);

  const { moveToList, moveToModify } = useCustomMove();

  // API 서버에 email주고 해당 member 받아오기
  useEffect(() => {
    getOneMember(email).then((data) => {
      console.log(data);
      setMember(data);
    });
  }, [email, refresh]);

  const clickstat = (email) => {
    modifyMemberStat(email).then((data) => {
      setRefresh(!refresh);
    });
  };
  // 1 일반회원가입
  // 2 사업자회원가입 관리자 승인 대기  -> 관리자 승인 = 1로 변경
  // 0 탈퇴

  return (
    <div>
      <div className="px-4 sm:px-0">
        <h3 className="text-base/7 font-semibold text-gray-900">
          대상 회원
        </h3>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          {makeDiv('Email', member.email)}
          {makeDiv('Nickname', member.nickname)}
          {makeDiv(
            'memberStat',
            member.memberStat == 2
              ? '승인대기'
              : member.memberStat == 1
                ? '일반회원'
                : '탈퇴회원'
          )}
        </dl>
      </div>
      <div className="my-6 flex float-right">
        <button
          type="button"
          onClick={() => moveToList()}
          className="rounded-md mr-2 bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          사업자 목록
        </button>
        <button
          type="button"
          onClick={() => clickstat(email)}
          className="rounded-md bg-rose-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          승인
        </button>
      </div>
    </div>
  );
};

const makeDiv = (title, value) => (
  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
    <dt className="text-sm/6 font-medium text-gray-900">{title}</dt>
    <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
      {value}
    </dd>
  </div>
);

export default ReadMemberComponent;
