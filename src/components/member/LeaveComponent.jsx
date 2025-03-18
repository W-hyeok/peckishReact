import { useEffect, useState } from 'react';
import { deleteOneMember } from '../../api/memberApi';
import ResultModal from '../common/ResultModal';
import { useNavigate } from 'react-router-dom';
import useCustomLogin from '../../hooks/useCustomLogin';
import { getCookie } from '../../util/cookieUtil';

import '../../css/common.css';

const LeaveComponent = () => {
  const cookieMember = getCookie('member');

  const [email, setEmail] = useState(null);
  useEffect(() => {
    setEmail(cookieMember.email);
  }, [email]);

  const [result, setResult] = useState(null);

  const navigate = useNavigate();
  const { moveToPath, doLogout } = useCustomLogin();

  // 회원 탈퇴
  const handleClickLeave = () => {
    deleteOneMember(email).then((data) => {
      console.log('회원 탈퇴 data 확인: {}', data);
      if (data) {
        setResult('success');
      } else {
        setResult('failure');
      }
    });
  };

  const closeModal = () => {
    setResult(null);
    doLogout();
    moveToPath(`/`);
  };

  return (
    <>
      {result ? (
        <ResultModal
          title={'회원탈퇴 완료!!'}
          content={`다음에 다시 만나요~~`}
          callbackFn={closeModal}
        />
      ) : (
        <></>
      )}
      <form>
        <div className="flex min-h-full flex-col items-center justify-center sm:px-6 lg:px-8">
          <div className="mt-40 sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-2 text-center text-2xl font-bold tracking-tight text-gray-900">
              탈퇴 하시겠습니까?
            </h2>
          </div>
          <div className="mt-2 flex items-center justify-center gap-x-6">
            <button
              type="button"
              className="positiveBtn"
              onClick={() => navigate(-1)}
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleClickLeave}
              className="negativeBtn"
            >
              확인
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default LeaveComponent;
