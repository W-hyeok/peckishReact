import React, { useState } from 'react';
import useCustomLogin from '../../hooks/useCustomLogin';
import ResultModal from '../common/ResultModal';

import { putTemporaryPassword } from '../../api/memberApi';
import { useNavigate } from 'react-router-dom';

const SearchPasswordComponent = () => {
  const { moveToLogin, moveToPath, exceptionHandle } = useCustomLogin();
  const [result, setResult] = useState(null);

  const navigate = useNavigate();

  // 이메일 유효성 검사
  const [email, setEmail] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [isEmail, setIsEmail] = useState(false);
  const onChangeEmail = (e) => {
    const currentEmail = e.target.value;
    setEmail(currentEmail);
    const emailRegExp =
      /^[A-Za-z0-9_]+[A-Za-z0-9]*[@]{1}[A-Za-z0-9]+[A-Za-z0-9]*[.]{1}[A-Za-z]{1,3}$/;

    if (!emailRegExp.test(currentEmail)) {
      setEmailMessage('이메일의 형식이 올바르지 않습니다!');
      setIsEmail(false);
    } else {
      setEmailMessage('바른 형식의 이메일 입니다.');
      setIsEmail(true);
    }
  };

  // 전화번호 유효성 검사
  const [phone, setPhone] = useState('');
  const [phoneMessage, setPhoneMessage] = useState('');
  const [isPhone, setIsPhone] = useState(false);
  const onChangePhone = (getNumber) => {
    const currentPhone = getNumber;
    setPhone(currentPhone);
    const phoneRegExp = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;

    if (!phoneRegExp.test(currentPhone)) {
      setPhoneMessage('올바른 전화번호 형식이 아닙니다!');
      setIsPhone(false);
    } else {
      setPhoneMessage('바른 형식의 전화 번호입니다!');
      setIsPhone(true);
    }
  };

  const addHyphen = (e) => {
    const currentNumber = e.target.value;
    setPhone(currentNumber);
    if (currentNumber.length == 3 || currentNumber.length == 8) {
      setPhone(currentNumber + '-');
      onChangePhone(currentNumber + '-');
    } else {
      onChangePhone(currentNumber);
    }
  };

  const enter = (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
      handleClickSearchPassword();
    }
  };

  const handleClickSearchPassword = () => {
    // const formSearchEmailData = new FormData();
    // formSearchEmailData.append('phone', phone);

    console.log('SearchPasswordComponent - email {}', email);
    console.log('SearchPasswordComponent - phone {}', phone);

    if (!isEmail || !isPhone) {
      setResult('failInput');
      console.log(result);
    } else {
      putTemporaryPassword(email, phone)
        .then((data) => {
          if (data !== null) {
            console.log('Password 찾기 return data 확인: {}', data);
            setResult(data);
          } else {
            console.log('Password 찾기 실패 !!');
            setResult('failSearchPassword');
          }
        })
        .catch((err) => {
          exceptionHandle(err);
          console.log('Password 찾기 실패 !!');
          setResult('failSearchPassword');
        });
    }
  };

  const closeModal = () => {
    setResult(null);
    moveToLogin();
  };

  const closeModalFail = () => {
    setResult(null);
    moveToPath('/member/searchPassword');
  };

  return (
    <>
      {result &&
      result !== 'failInput' &&
      result !== 'failSearchPassword' &&
      result !== 'exceptionError' ? (
        <ResultModal
          title={'비밀번호 찾기 성공'}
          content={`회원님 임시 비밀번호는 ${result} 입니다`}
          callbackFn={closeModal}
        />
      ) : result === 'failInput' ? (
        <ResultModal
          title={'비밀번호 찾기 입력 오류'}
          content={`이메일과 연락처를 다시 입력해 주세요.`}
          callbackFn={closeModalFail}
        />
      ) : result === 'failSearchPassword' ? (
        <ResultModal
          title={'비밀번호 찾기 실패'}
          content={`이메일/연락처와 동시에 일치하는 회원이 없습니다.`}
          callbackFn={closeModalFail}
        />
      ) : result === 'exceptionError' ? (
        <ResultModal
          title={'비밀번호 찾기 실패'}
          content={`입력된 이메일과 일치하는 회원이 없습니다.`}
          callbackFn={closeModalFail}
        />
      ) : (
        <></>
      )}
      <form>
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            alt="Your Company"
            src="/src/assets/fish_logo.png"
            className="mx-auto h-10 w-auto"
          />
          <h3 className="mt-1 text-center text-1x1/9 font-bold tracking-tight text-gray-900">
            비밀번호 찾기
          </h3>
          <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-[480px]">
            <div className="bg-white px-6 py-4 shadow sm:rounded-lg sm:px-12">
              <div className="space-y-2">
                <div>
                  <label className="block text-sm/6 font-medium text-gray-900">
                    이메일*
                  </label>
                  <div className="mt-1">
                    <input
                      name="email"
                      type="text"
                      value={email}
                      onChange={onChangeEmail}
                      required
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                    <p className="text-sm text-gray-900">{emailMessage}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm/6 font-medium text-gray-900">
                    연락처*
                  </label>
                  <div className="mt-1">
                    <input
                      name="phone"
                      type="text"
                      value={phone}
                      required
                      onChange={addHyphen}
                      onKeyDown={enter}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                    <p className="text-sm text-gray-900">{phoneMessage}</p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-center gap-x-6">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    onClick={handleClickSearchPassword}
                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    제출
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default SearchPasswordComponent;
