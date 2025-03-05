import { useEffect, useState } from 'react';
import { getOneMember, modifyMemberStat } from '../../api/adminApi';
import useCustomMove from '../../hooks/useCustomMove';
import { useNavigate } from 'react-router-dom';

// todo state 초기화 객체
const initState = {
  email: '',
  nickname: '',
  memberStat: 0,
};

const ReadComponent = ({ email }) => {
  const [member, setMember] = useState(initState);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isConfirmModal, setIsConfirmModal] = useState(false);
  const { moveToList } = useCustomMove();
  const navigate = useNavigate();

  // API 서버에 email주고 해당 member 받아오기
  useEffect(() => {
    getOneMember(email).then((data) => {
      console.log(data);
      setMember(data);
    });
  }, [email]);

  const handleAction = (email) => {
    setIsConfirmModal(true);
    setModalMessage(
      member.memberStat === 1
        ? '승인을 취소하시겠습니까?'
        : '승인 하시겠습니까?'
    );
  };

  const confirmAction = () => {
    modifyMemberStat(email).then((data) => {
      setIsConfirmModal(false);
      setModalMessage(
        member.memberStat === 1
          ? '취소가 완료되었습니다'
          : '승인이 완료되었습니다'
      );
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        navigate('/admin/memberlist');
      }, 1500);
    });
  };

  const cancelAction = () => {
    setIsConfirmModal(false);
  };

  const handleGoToList = () => {
    navigate('/admin/memberlist'); // 목록으로 이동
  };

  // 1 일반회원가입
  // 2 사업자회원가입 관리자 승인 대기  -> 관리자 승인 = 1로 변경
  // 0 탈퇴

  return (
    <div className="relative">
      <div>
        <div className="px-4 sm:px-0">
          <h3 className="text-xl font-bold text-blue-800">대상 회원 상세</h3>
        </div>
        <div className="mt-6 border-t border-gray-100">
          <dl className="divide-y divide-gray-100">
            {makeDiv('이메일', member.email)}
            {makeDiv('이름', member.nickname)}
            {makeDiv(
              '회원상태',
              member.memberStat == 2
                ? '승인대기'
                : member.memberStat == 1
                  ? '일반회원'
                  : '탈퇴회원'
            )}
          </dl>
        </div>
        <div className="my-6 flex float-right gap-2">
          {member.memberStat === 2 && (
            <button
              type="button"
              onClick={() => handleAction(email)}
              className="rounded-md bg-blue-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              승인
            </button>
          )}
          {member.memberStat === 1 && (
            <button
              type="button"
              onClick={() => handleAction(email)}
              className="rounded-md bg-rose-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
            >
              승인취소
            </button>
          )}
          <button
            type="button"
            onClick={handleGoToList}
            className="rounded-md bg-gray-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
          >
            목록
          </button>
        </div>
      </div>

      {/* 확인 모달 */}
      {isConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          <div className="relative bg-white rounded-lg px-8 py-6 shadow-xl">
            <div className="flex flex-col items-center justify-center">
              <span className="text-xl font-semibold mb-4">{modalMessage}</span>
              <div className="flex gap-4">
                <button
                  onClick={confirmAction}
                  className="rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600"
                >
                  확인
                </button>
                <button
                  onClick={cancelAction}
                  className="rounded-md bg-gray-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-600"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 완료 모달 */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          <div className="relative bg-white rounded-lg px-8 py-6 shadow-xl">
            <div className="flex items-center justify-center">
              <svg
                className="h-12 w-12 text-green-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-xl font-semibold">{modalMessage}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const makeDiv = (title, value) => (
  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
    <dt className="text-sm/6 font-medium text-gray-900 bg-gray-100 p-2 rounded-md">
      {title}
    </dt>
    <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 bg-white p-2 border border-gray-200 rounded-md">
      {value}
    </dd>
  </div>
);

export default ReadComponent;
