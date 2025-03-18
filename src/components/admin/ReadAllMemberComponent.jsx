import { useEffect, useState } from 'react';
import { getOneMember } from '../../api/adminApi';
import useCustomMove from '../../hooks/useCustomMove';
import { useNavigate } from 'react-router-dom';
import { API_SERVER_HOST } from '../../api/todoApi';
import { getOneMemberByBusinessNumber } from '../../api/memberApi';
import '../../css/common.css';

const host = API_SERVER_HOST;

const initState = {
  email: '',
  phone: '',
  businessNumber: '',
  memberStat: 0,
};

const ReadAllMemberComponent = ({ email }) => {
  const [member, setMember] = useState(initState);

  const { moveToList, moveToModify } = useCustomMove();
  const navigate = useNavigate();

  // API 서버에 email주고 해당 member 받아오기
  useEffect(() => {
    getOneMember(email).then((data) => {
      console.log('어드민 Read Component 확인: {}', data);
      setMember(data);
    });
  }, [email]);

  const clickstat = (email) => {
    modifyMemberStat(email).then((data) => {
      setRefresh(!refresh);
    });
  };

  // 1 일반회원가입
  // 2 사업자회원가입 관리자 승인 대기  -> 관리자 승인 = 1로 변경
  // 4 사업자회원가입 관리자 승인 대기  -> 관리자 반려 = 4로 변경
  // 0 탈퇴

  return (
    <div className="relative">
      <div>
        <div className="px-4 sm:px-0">
          <h3 className="text-xl font-bold text-blue-800">회원 상세 정보</h3>
        </div>
        <div className="mt-2 border-t border-gray-300">
          <dl className="divide-y divide-gray-300">
            {makeDiv('이메일', member.email)}
            {makeDiv('닉네임', member.nickname)}
            {makeDiv('연락처', member.phone)}
            {makeDiv('사업자 등록번호', member.businessNumber)}
            {makeDiv(
              '회원상태',
              member.memberStat == 2
                ? '승인대기'
                : member.memberStat == 1
                  ? '활동중 회원'
                  : member.memberStat == 4
                    ? '승인 반려'
                    : '탈퇴회원'
            )}
          </dl>
        </div>
        <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm/6 font-medium text-gray-900 bg-gray-100 p-2 rounded-md">
            프로필
          </dt>
          <dd className="mt-0 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 bg-white p-2 border border-gray-300 rounded-md">
            <img
              alt={member.email}
              src={`${host}/api/member/view/${member.profileFilename}`}
              className="max-h-40 w-auto"
            />
          </dd>
        </div>
        <div className="my-6 flex float-right">
          <button
            type="button"
            onClick={() => moveToList()}
            className="defaultBtn"
          >
            목록으로
          </button>
        </div>
      </div>
    </div>
  );
};

const makeDiv = (title, value) => (
  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
    <dt className="text-sm/6 font-medium text-gray-900 bg-gray-100 p-2 rounded-md">
      {title}
    </dt>
    <dd className="mt-0 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 bg-white p-2 border border-gray-300 rounded-md">
      {value}
    </dd>
  </div>
);

export default ReadAllMemberComponent;
