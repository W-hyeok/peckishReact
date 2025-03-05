import React, { useState } from 'react';
import useCustomLogin from '../../hooks/useCustomLogin';
import ResultModal from '../common/ResultModal';

import { getOneMemberByPhone } from '../../api/memberApi';
import { useNavigate } from 'react-router-dom';

const SearchEmailComponent = () => {
  const { moveToLogin, moveToPath, exceptionHandle } = useCustomLogin();
  const [result, setResult] = useState(null);

  const navigate = useNavigate();

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
      handleClickSearchEmail();
    }
  };

  const handleClickSearchEmail = () => {
    console.log('searchEmail - phone {}', phone);

    if (!isPhone) {
      setResult('failInput');
      console.log(result);
    } else {
      getOneMemberByPhone(phone)
        .then((data) => {
          if (data !== null) {
            console.log('이메일 찾기 return data 확인: {}', data);
            setResult(data);
          } else {
            console.log('이메일 찾기 실패 ');
            setResult('failSearchEmail');
          }
        })
        .catch((err) => {
          exceptionHandle(err);
          console.log('이메일 찾기 실패 ');
          setResult('failSearchEmail');
        });
    }
  };

  const closeModal = () => {
    setResult(null);
    moveToLogin();
  };

  const closeModalFail = () => {
    setResult(null);
    moveToPath('/member/searchEmail');
  };

  return (
    <>
      {result && result !== 'failInput' && result !== 'failSearchEmail' ? (
        <ResultModal
          title={'이메일 주소 찾기 성공'}
          content={`회원님 주소는 ${result.email} 입니다`}
          callbackFn={closeModal}
        />
      ) : result === 'failInput' ? (
        <ResultModal
          title={'이메일 주소 찾기 입력 오류'}
          content={`입력한 연락처를 다시 확인해 주세요.`}
          callbackFn={closeModalFail}
        />
      ) : result === 'failSearchEmail' ? (
        <ResultModal
          title={'이메일 주소 찾기 실패'}
          content={`입력하신 연락처와 일치하는 회원이 없습니다.`}
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
            이메일 주소 찾기
          </h3>
          <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-[480px]">
            <div className="bg-white px-6 py-4 shadow sm:rounded-lg sm:px-12">
              <div className="space-y-2">
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
                    onClick={handleClickSearchEmail}
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

export default SearchEmailComponent;
