import { useState } from 'react';
import { Link } from 'react-router-dom';
import useCustomLogin from '../../hooks/useCustomLogin';
import KakaoLoginComponent from './KakaoLoginComponent';
import ResultModal from '../common/ResultModal';
// import { set } from 'react-datepicker/dist/date_utils';

import fishLogo from '/src/assets/fish_logo.png';

const initState = {
  email: '',
  password: '',
};

const LoginComponent = () => {
  const [loginParam, setLoginParam] = useState({ ...initState });

  const { doLogin, doLogout, moveToPath } = useCustomLogin();

  const [result, setResult] = useState(null);
  const [email, setEmail] = useState(null);
  const { exceptionHandle } = useCustomLogin();

  const handleChange = (e) => {
    loginParam[e.target.name] = e.target.value;
    setLoginParam({ ...loginParam });
  };

  const handleClickLogin = () => {
    doLogin(loginParam).then((data) => {
      console.log('login data 확인(moon~~~~): {}', data.memberStat);
      if (data.memberStat == 1) {
        setResult('login_success');
      } else if (data.memberStat == 0) {
        setResult('login_failure_0');
        doLogout();
      } else if (data.memberStat == 2) {
        setResult('login_failure_2');
        doLogout();
      } else {
        console.log('비밀번호 불일치 ');
        setResult('fail');
      }
      setEmail(data.email);
    });
  };

  const closeModal = () => {
    setResult(null);
    moveToPath(`/member/read/${email}`);
  };

  const closeModalError = () => {
    setResult(null);
    moveToPath(`/member/login`);
  };

  // 엔터 시 버튼 클릭 효과
  const enter = (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
      console.log('Key 눌렸는지 enter 안의 출력문 출력~~~~~~~~~~~');
      handleClickLogin();
    }
  };

  return (
    <>
      {result ? (
        result === 'login_success' ? (
          <ResultModal
            title={'로그인 완료'}
            content={`${email}님 입장하셨습니다.`}
            callbackFn={closeModal}
          />
        ) : result === 'login_failure_0' ? (
          <ResultModal
            title={'로그인 실패'}
            content={`${email}님은 탈퇴한 회원입니다.`}
            callbackFn={closeModalError}
          />
        ) : result === 'login_failure_2' ? (
          <ResultModal
            title={'로그인 실패'}
            content={`${email}님은 관리자 승인 대기중입니다`}
            callbackFn={closeModalError}
          />
        ) : (
          <ResultModal
            title={'로그인 실패'}
            content={`아이디와 비밀번호 다시 확인 바랍니다.`}
            callbackFn={closeModalError}
          />
        )
      ) : (
        <></>
      )}

      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            alt="Your Company"
            src={fishLogo}
            className="mx-auto h-8 w-auto"
          />
          <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            로그인 해 주세요
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <div className="space-y-6">
              <div>
                <label className="block text-sm/6 font-medium text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    name="email"
                    type="text"
                    value={loginParam.email}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm/6 font-medium text-gray-900">
                  비밀번호
                </label>
                <div className="mt-2">
                  <input
                    name="password"
                    type="password"
                    value={loginParam.password}
                    onChange={handleChange}
                    onKeyDown={enter}
                    required
                    autoComplete="current-password"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm/6">
                  <Link
                    to="/member/searchEmail"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    이메일 찾기
                  </Link>
                </div>
                <div className="text-sm/6">
                  <Link
                    to="/member/add"
                    className="font-semibold text-orange-600 hover:text-orange-500"
                  >
                    회원가입
                  </Link>
                </div>
                <div className="text-sm/6">
                  <Link
                    to="/member/searchPassword"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    비밀번호 찾기
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleClickLogin}
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Login
                </button>
              </div>
            </div>

            {/* 소셜로그인 */}
            <KakaoLoginComponent />
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginComponent;
