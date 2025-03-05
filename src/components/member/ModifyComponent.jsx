import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { putMemberModifyKakao } from '../../api/memberApi';
import useCustomLogin from '../../hooks/useCustomLogin';
import ResultModal from '../common/ResultModal';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { putMemberModifyInfo } from '../../api/memberApi';

// const initState = {
//   email: '',
//   password: '',
//   nickname: '',
//   phone: '',
//   profileImg: '',
// };

const ModifyComponent = () => {
  const uploadRef = useRef(); //
  // const [member, setMember] = useState(initState);
  const loginInfo = useSelector((state) => state.loginSlice);

  const [email, setEmail] = useState('');
  const { moveToLogin, moveToPath, doLogout, exceptionHandle } =
    useCustomLogin();
  const [result, setResult] = useState(null);

  useEffect(() => {
    setEmail(loginInfo.email);
    setPassword('abcdef');
    setNickname(loginInfo.nickname);
    setPhone(loginInfo.phone);
  }, [loginInfo]);

  // 비밀번호 유효성 검사
  const [password, setPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [isPassword, setIsPassword] = useState(false);
  const onChangePassword = (e) => {
    const currentPassword = e.target.value;
    setPassword(currentPassword);
    const passwordRegExp =
      /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{5,15}$/;
    if (!passwordRegExp.test(currentPassword)) {
      setPasswordMessage(
        '숫자+영문자+특수문자 조합으로 5자리 이상 입력해주세요!'
      );
      setIsPassword(false);
    } else {
      setPasswordMessage('안전한 비밀번호 입니다.');
      setIsPassword(true);
    }
  };
  // 비밀번호 확인 유효성 검사
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordConfirmMessage, setPasswordConfirmMessage] = useState('');
  const [isPasswordConfirm, setIsPasswordConfirm] = useState(false);
  const onChangePasswordConfirm = (e) => {
    const currentPasswordConfirm = e.target.value;
    setPasswordConfirm(currentPasswordConfirm);
    if (password !== currentPasswordConfirm) {
      setPasswordConfirmMessage('비밀번호가 똑같지 않습니다!');
      setIsPasswordConfirm(false);
    } else {
      setPasswordConfirmMessage('같은 비밀번호 확인되었습니다!');
      setIsPasswordConfirm(true);
    }
  };
  // 닉네임 유효성 검사
  const [nickname, setNickname] = useState('Temporary Nickname');
  const [nicknameMessage, setNicknameMessage] = useState('');
  const [isNickname, setIsNickname] = useState(false);
  const onChangeNickname = (e) => {
    const currentNickname = e.target.value;
    setNickname(currentNickname);

    if (currentNickname.length < 2 || currentNickname.length > 5) {
      setNicknameMessage('닉네임은 2글자 이상 5글자 이하로 입력해주세요!');
      setIsNickname(false);
    } else {
      setNicknameMessage('사용가능한 닉네임 입니다.');
      setIsNickname(true);
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
      setPhoneMessage('올바른 형식이 아닙니다!');
      setIsPhone(false);
    } else {
      setPhoneMessage('사용 가능한 번호입니다!');
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

  const handleChange = (e) => {
    member[e.target.name] = e.target.value;
    setMember({ ...member });
  };

  const handleClickModify = () => {
    console.log('카카오 logInfo 확인: {}', loginInfo);

    // 저장 요청
    const profImg = uploadRef.current.files[0];

    const formKakaoData = new FormData();
    if (profImg) {
      formKakaoData.append('profileImg', profImg);
    }

    formKakaoData.append('email', email);
    formKakaoData.append('password', password);
    formKakaoData.append('nickname', nickname);
    formKakaoData.append('phone', phone);
    formKakaoData.append('profileImg', profImg);

    console.log('modifyKakao - email: {}', email);
    console.log('modifyKakao - nickname: {}', nickname);

    if (!isPassword || !isPasswordConfirm) {
      setResult('failPassword');
    } else if (!isNickname) {
      setResult('failNickname');
    } else if (!isPhone) {
      setResult('failPhone');
    } else {
      putMemberModifyKakao(email, formKakaoData)
        .then((data) => {
          console.log('카카오 회원 수정 data 확인: {}', data);
          setResult(data);
        })
        .catch((err) => exceptionHandle(err));
    }
  };

  const closeModal = () => {
    setResult(null);
    moveToLogin();
  };

  const closeModalFail = () => {
    setResult(null);
    moveToPath('/member/modify');
  };

  return (
    <>
      {result &&
      result !== 'failPassword' &&
      result !== 'failNickname' &&
      result !== 'failPhone' ? (
        <ResultModal
          title={'카카오 회원정보 수정 완료 !'}
          content={'다시 로그인 해 주세요~~~'}
          callbackFn={closeModal}
        />
      ) : result === 'failPassword' ? (
        <ResultModal
          title={'회원 가입 실패'}
          content={`비밀번호를 다시 확인해 주세요 !`}
          callbackFn={closeModalFail}
        />
      ) : result === 'failNickname' ? (
        <ResultModal
          title={'회원 가입 실패'}
          content={`닉네임을 다시 확인해 주세요 !`}
          callbackFn={closeModalFail}
        />
      ) : result === 'failPhone' ? (
        <ResultModal
          title={'회원 가입 실패'}
          content={`연락처를 다시 확인해 주세요 !`}
          callbackFn={closeModalFail}
        />
      ) : (
        <></>
      )}
      <form>
        <div className="flex min-h-full flex-1 flex-col justify-center py-1 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <img
              alt="Your Company"
              src="/src/assets/fish_logo.png"
              className="mx-auto h-8 w-auto"
            />
            <h3 className="mt-1 text-center text-1xl/9 font-bold tracking-tight text-gray-900">
              카카오 회원 정보 수정
            </h3>
            <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-[480px]">
              <div className="bg-white px-6 py-4 shadow sm:rounded-lg sm:px-12">
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm/6 font-medium text-gray-900">
                      이메일
                    </label>
                    <div className="mt-1">
                      <input
                        name="email"
                        type="text"
                        value={email}
                        readOnly
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm/6 font-medium text-gray-900">
                      새 비밀번호*
                    </label>
                    <div className="mt-1">
                      <input
                        name="password"
                        type="password"
                        value={password}
                        onChange={onChangePassword}
                        required
                        autoComplete="current-password"
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                      <p className="text-sm text-gray-900">{passwordMessage}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm/6 font-medium text-gray-900">
                      새 비밀번호 확인*
                    </label>
                    <div className="mt-1">
                      <input
                        name="password"
                        type="password"
                        value={passwordConfirm}
                        onChange={onChangePasswordConfirm}
                        required
                        autoComplete="current-password"
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                      <p className="text-sm text-gray-900">
                        {passwordConfirmMessage}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm/6 font-medium text-gray-900">
                      닉네임*
                    </label>
                    <div className="mt-1">
                      <input
                        name="nickname"
                        type="text"
                        value={nickname}
                        onChange={onChangeNickname}
                        required
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                      <p className="text-sm text-gray-900">{nicknameMessage}</p>
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
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                      <p className="text-sm text-gray-900">{phoneMessage}</p>
                    </div>
                  </div>

                  {/* profile 사진 첨부 */}
                  <div className="col-span-full">
                    <label className="block text-sm/6 font-medium text-gray-900">
                      프로필 사진
                    </label>
                    <div className="mt-1 flex justify-center rounded-lg border border-solid border-gray-900/25 px-4 py-4">
                      <div className="text-center">
                        <PhotoIcon
                          aria-hidden="true"
                          className="mx-auto size-14 text-gray-300"
                        />
                        <div className="mt-1 flex justify-center text-sm/4 text-gray-600">
                          <label className="relative cursor-pointer rounded-md bg-white font-base text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                            <span>사진 첨부</span>
                            <input
                              type="file"
                              ref={uploadRef}
                              name="profileImg"
                              className="sr-only"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button
                      type="button"
                      onClick={handleClickModify}
                      className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      수정완료
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default ModifyComponent;
