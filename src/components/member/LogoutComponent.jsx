import { useState } from 'react';
import useCustomLogin from '../../hooks/useCustomLogin';
import ResultModal from '../common/ResultModal';
import { Navigate, useNavigate } from 'react-router-dom';

const LogoutComponent = () => {
  const { doLogout, moveToPath } = useCustomLogin();
  const [result, setResult] = useState(null);

  const navigate = useNavigate();

  const handleClickLogout = () => {
    doLogout();
    setResult(true);
  };

  const closeModal = () => {
    setResult(null);
    moveToPath('/');
  };

  return (
    <>
      {result ? (
        <ResultModal
          title={'로그아웃 완료'}
          content={`로그아웃이 정상적으로 처리되었습니다`}
          callbackFn={closeModal}
        />
      ) : (
        <></>
      )}
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            alt="Your Company"
            src="/src/assets/fish_logo.png"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            로그아웃 하시겠어요?
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
                onClick={handleClickLogout}
                className="flex w-1/2 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogoutComponent;
