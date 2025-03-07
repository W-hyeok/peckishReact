import { useEffect, useState } from 'react';
import { deleteOneMember } from '../../api/memberApi';
import ResultModal from '../common/ResultModal';
import { useNavigate } from 'react-router-dom';
import useCustomLogin from '../../hooks/useCustomLogin';
import { getCookie } from '../../util/cookieUtil';

import fishLogo from '/src/assets/fish_logo.png';

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
        <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <img
              alt="Your Company"
              src={fishLogo}
              className="mx-auto h-10 w-auto"
            />
            <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
              미련없이 탈퇴 하시겠어요?
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
            <div className="bg-white px-6 py-6 shadow sm:rounded-lg sm:px-12">
              <div className="mt-2 flex items-center justify-center gap-x-6">
                <button
                  type="button"
                  className="flex w-1/2 justify-center rounded-md bg-yellow-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
                  onClick={() => navigate(-1)}
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleClickLeave}
                  className="flex w-1/2 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  회원탈퇴
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default LeaveComponent;
