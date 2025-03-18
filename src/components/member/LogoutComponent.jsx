import { useState } from 'react';
import useCustomLogin from '../../hooks/useCustomLogin';
import ResultModal from '../common/ResultModal';
import { useNavigate } from 'react-router-dom';

import '../../css/common.css';

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
      <div className="flex min-h-full flex-col items-center justify-center sm:px-6 lg:px-8">
        <div className="mt-40 sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-2 text-center text-2xl font-bold tracking-tight text-gray-900">
            로그아웃 하시겠어요?
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
            onClick={handleClickLogout}
            className="negativeBtn"
          >
            확인
          </button>
        </div>
      </div>
    </>
  );
};

export default LogoutComponent;
