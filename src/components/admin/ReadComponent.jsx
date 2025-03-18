import { useEffect, useState } from 'react';
import {
  getOneMember,
  modifyMemberStat,
  modifyMemberStat4,
} from '../../api/adminApi';
import useCustomMove from '../../hooks/useCustomMove';
import { useNavigate } from 'react-router-dom';
import { API_SERVER_HOST } from '../../api/todoApi';
import { getOneMemberByBusinessNumber } from '../../api/memberApi';
import axios from 'axios';
import '../../css/common.css';

const host = API_SERVER_HOST;

// todo state 초기화 객체
const initState = {
  email: '',
  phone: '',
  businessNumber: '',
  memberStat: 0,
};

const ReadComponent = ({ email }) => {
  const [member, setMember] = useState(initState);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isConfirmModal, setIsConfirmModal] = useState(false);
  const [isConfirmModalReturn, setIsConfirmModalReturn] = useState(false);
  const { moveToList } = useCustomMove();
  const navigate = useNavigate();

  // API 서버에 email주고 해당 member 받아오기
  useEffect(() => {
    getOneMember(email).then((data) => {
      console.log('어드민 Read Component 확인: {}', data);
      setMember(data);
    });
  }, [email]);

  const [bizNumber, setBizNumber] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const API_KEY =
    'aG6IoC0RqTa0qlI%2F1IYOFwZ6WYoBl75hFPreoQ7XfRLta6XWPS2g9r%2BY1ljasxvxdeC%2BEsDL8uoQ5v4LEwsBMg%3D%3D';

  const handleVerify = async (e) => {
    e.preventDefault();
    console.log('#@#@#@#@#@#@#: {}', member.businessNumber);
    setBizNumber(member.businessNumber);
    console.log('*** 사업자 번호: {}', bizNumber);

    try {
      const url = `https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=${API_KEY}`;
      const header = { headers: { 'Content-Type': 'application/json' } };
      const data = JSON.stringify({ b_no: [member.businessNumber] });
      const response = await axios.post(url, data, header);
      console.log(response.data.status_code);

      if (
        response.data.status_code === 'OK' &&
        response.data.data[0]?.b_stt === '계속사업자'
      ) {
        setIsVerified(true);
        alert('정상적인 사업자 등록번호로 확인되었습니다.');
      } else {
        alert('유효하지 않은 사업자 등록번호입니다.');
      }
    } catch (error) {
      console.error('API 요청 중 오류 발생:', error);
      alert('사업자 확인 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleVerifyExistDB = async (e) => {
    e.preventDefault();

    try {
      getOneMemberByBusinessNumber(member.businessNumber).then((data) => {
        console.log('#@$!#!##%$%$#%$#: {}', data);

        if (data.length == 1) {
          alert('이 등록번호로 등록된 회원은 없습니다.');
        } else {
          alert('이 사업자 등록번호는 이미 사용중인 번호입니다.');
        }
      });
    } catch (error) {
      console.error('사업자 등록번호 중복 검사 요청 중 오류 발생:', error);
      alert('등록번호 중복 검사 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

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

  const handleActionReturn = (email) => {
    setIsConfirmModalReturn(true);
    setModalMessage('반려 하시겠습니까?');
  };

  const confirmActionReturn = () => {
    modifyMemberStat4(email).then((data) => {
      setIsConfirmModal(false);
      setModalMessage('반려가 완료되었습니다');
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

  const cancelActionReturn = () => {
    setIsConfirmModalReturn(false);
  };

  const handleGoToList = () => {
    navigate('/admin/memberlist'); // 목록으로 이동
  };

  // 1 일반회원가입
  // 2 사업자회원가입 관리자 승인 대기  -> 관리자 승인 = 1로 변경
  // 4 사업자회원가입 관리자 승인 대기  -> 관리자 반려 = 4로 변경
  // 0 탈퇴

  return (
    <div className="relative">
      <div>
        <div className="px-4 sm:px-0">
          <h3 className="text-xl font-bold text-blue-800">대상 회원 상세</h3>
        </div>
        <div className="mt-2 border-t border-gray-300">
          <dl className="divide-y divide-gray-300">
            {makeDiv('이메일', member.email)}
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
            사업자 등록증
          </dt>
          <dd className="mt-0 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 bg-white p-2 border border-gray-300 rounded-md">
            <img
              alt={member.email}
              src={`${host}/api/member/view/${member.certiFilename}`}
              className="max-h-80 w-auto"
            />
          </dd>
        </div>
        <div className="flex float-right gap-2 mb-4">
          {member.memberStat === 2 && (
            <>
              <button
                type="button"
                onClick={handleVerify}
                className="defaultBtn"
              >
                사업자 등록번호 유효성 검증
              </button>
              <button
                type="button"
                onClick={handleVerifyExistDB}
                className="defaultBtn"
              >
                동일 사업자 등록번호 확인
              </button>
              <button
                type="button"
                onClick={() => handleAction(email)}
                className="positiveBtn"
                // className="rounded-md bg-blue-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                승인
              </button>
              <button
                type="button"
                onClick={() => handleActionReturn(email)}
                className="negativeBtn"
              >
                반려
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="defaultBtn"
              >
                목록으로
              </button>
            </>
          )}
          {member.memberStat === 1 && (
            <>
              <button
                type="button"
                value={member.businessNumber}
                onClick={() => handleAction(email)}
                className="negativeBtn"
              >
                승인취소
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="defaultBtn"
              >
                목록으로
              </button>
            </>
          )}
          {member.memberStat === 4 && (
            <>
              <button
                type="button"
                onClick={() => handleAction(email)}
                className="positiveBtn"
                // className="rounded-md bg-blue-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                재승인
              </button>
              <button
                type="button"
                onClick={() => handleActionReturn(email)}
                className="negativeBtn"
              >
                반려
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="defaultBtn"
              >
                목록으로
              </button>
            </>
          )}
        </div>
      </div>

      {/* 확인 모달 : 사업자 등록 승인을 위한 프로세스 */}
      {isConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          <div className="relative bg-white rounded-lg px-8 py-6 shadow-xl">
            <div className="flex flex-col items-center justify-center">
              <span className="text-xl font-semibold mb-4">{modalMessage}</span>
              <div className="flex gap-4">
                <button onClick={confirmAction} className="positiveBtn">
                  확인
                </button>
                <button onClick={cancelAction} className="negativeBtn">
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 확인 모달 : 사업자 등록 반려를 위한 프로세스*/}
      {isConfirmModalReturn && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          <div className="relative bg-white rounded-lg px-8 py-6 shadow-xl">
            <div className="flex flex-col items-center justify-center">
              <span className="text-xl font-semibold mb-4">{modalMessage}</span>
              <div className="flex gap-4">
                <button onClick={confirmActionReturn} className="positiveBtn">
                  확인
                </button>
                <button onClick={cancelActionReturn} className="negativeBtn">
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
  <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
    <dt className="text-sm/6 font-medium text-gray-900 bg-gray-100 p-2 rounded-md">
      {title}
    </dt>
    <dd className="mt-0 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 bg-white p-2 border border-gray-300 rounded-md">
      {value}
    </dd>
  </div>
);

export default ReadComponent;
