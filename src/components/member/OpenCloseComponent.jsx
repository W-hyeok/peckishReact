import { useState } from 'react';
import useCustomLogin from '../../hooks/useCustomLogin';
import ResultModal from '../common/ResultModal';
import { useParams } from 'react-router-dom';
import { getCookie } from '../../util/cookieUtil';
import { doOpen, doClose } from '../../api/memberApi';

const cookieMember = getCookie('member')
  ? getCookie('member')
  : { email: null };

const OpenCloseComponent = () => {
  const { email } = useParams();
  const { moveToPath } = useCustomLogin();

  const [result, setResult] = useState(2);

  const handleClickOpen = () => {
    doOpen(email);
    setResult(1);
  };

  const handleClickClose = () => {
    doClose(email);
    setResult(0);
  };

  const closeModal = () => {
    setResult(2);
    // moveToPath(`/shop/detailMoon/${cookieMember.email}`);
    moveToPath(`/`);
  };

  const closeModalForClose = () => {
    setResult(2);
    // moveToPath(`/member/logout`);
    moveToPath(`/`);
  };

  return (
    <>
      {result == 2 ? (
        <></>
      ) : result == 1 ? (
        <ResultModal
          title={'영업이 시작되었습니다!'}
          content={`오늘 하루도 돈 많이 버세요~~~~`}
          callbackFn={closeModal}
        />
      ) : (
        <ResultModal
          title={'영업이 종료되었습니다!'}
          content={`오늘 하루도 수고 많으셨어요~~~~`}
          callbackFn={closeModalForClose}
        />
      )}
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            alt="Your Company"
            src="/src/assets/fish_logo.png"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            영업 개시와 종료 중 하나를 선택해 주세요 !
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-6 shadow sm:rounded-lg sm:px-12">
            <div className="mt-2 flex items-center justify-center gap-x-6">
              <button
                type="button"
                className="flex w-1/2 justify-center rounded-md bg-yellow-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
                onClick={handleClickOpen}
              >
                영업 개시
              </button>
              <button
                type="button"
                onClick={handleClickClose}
                className="flex w-1/2 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                영업 종료
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OpenCloseComponent;
