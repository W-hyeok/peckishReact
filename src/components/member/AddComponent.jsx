import React, { useState, useRef } from 'react';
import { postMemberAdd } from '../../api/memberApi';
import useCustomLogin from '../../hooks/useCustomLogin';
import { PhotoIcon } from '@heroicons/react/24/solid';
import ResultModal from '../../components/common/ResultModal';
import { useNavigate } from 'react-router-dom';

import fishLogo from '/src/assets/fish_logo.png';
import axios from 'axios';

const initState = {
  email: '',
  password: '',
  nickname: '',
  phone: '',
  profileImg: '',
  profileFilename: '',
  certiImg: '',
  certiFilename: '',
  memberType: '',
};

const AddComponent = () => {
  const uploadRef = useRef(); // html id속성 대신 사용
  const uploadRefCerti = useRef();
  const [member, setMember] = useState({ ...initState });
  const [result, setResult] = useState(null);

  const navigate = useNavigate();

  const { exceptionHandle } = useCustomLogin();

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
      setEmailMessage('사용 가능한 이메일 입니다.');
      setIsEmail(true);
    }
  };
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
  const [nickname, setNickname] = useState('');
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

  // MemberType
  const [memberType, setMemberType] = useState('USER');

  const onChangeMemberType = (e) => {
    const currentMemberType = e.target.value;
    setMemberType(currentMemberType);
  };

  const { moveToPath } = useCustomLogin();

  const [profileFile, setProfileFile] = useState(null);
  const [certfile, setCertfile] = useState(null);
  const [image, setImage] = useState(null);
  const [certimage, setCertimage] = useState(null);

  // 파일 선택 시 호출되는 함수
  const handleImageChange = () => {
    const profImg = uploadRef.current?.files[0]; // 파일을 참조

    if (profImg) {
      setProfileFile(profImg);
      const reader = new FileReader(); // FileReader 생성
      reader.onloadend = () => {
        setImage(reader.result); // 파일을 읽은 후 image 상태에 URL 저장
      };
      reader.readAsDataURL(profImg); // 파일을 Data URL 형식으로 읽기
    }
  };

  // 사업자 등록증 파일 선택 시 호출되는 함수
  const handleCertChange = () => {
    const certImg = uploadRefCerti.current?.files[0]; // 파일을 참조

    if (certImg) {
      setCertfile(certImg);
      const reader = new FileReader(); // FileReader 생성
      reader.onloadend = () => {
        setCertimage(reader.result); // 파일을 읽은 후 image 상태에 URL 저장
      };
      reader.readAsDataURL(certImg); // 파일을 Data URL 형식으로 읽기
    }
  };

  const handleClickSignup = () => {
    // 사진을 제대로 올렸는지 확인 과정 
    if (!profileFile) {
      console.error('프로필 사진 파일이 없습니다!');
      alert('프로필 사진 파일이 없습니다!');
      return; // 파일이 없으면 저장하지 않음
    }
    if (memberType === 'OWNER' && !certfile) {
      console.error('사업자 등록증 사진이 없습니다!');
      alert('사업자 등록증 사진이 없습니다!');
      return; // 파일이 없으면 저장하지 않음
    }

    const formData = new FormData();
    if (memberType === 'OWNER') {
      formData.append('certiImg', certfile);
      formData.append('businessNumber', businessNumber);
    }
    formData.append('profileImg', profileFile);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('nickname', nickname);
    formData.append('phone', phone);
    formData.append('memberType', memberType);

    console.log(email);
    console.log(formData);
    console.log(memberType);

    if (!isEmail) {
      setResult('failEmail');
    } else if (!isPassword || !isPasswordConfirm) {
      setResult('failPassword');
    } else if (!isNickname) {
      setResult('failNickname');
    } else if (!isPhone) {
      setResult('failPhone');
    } else {
      postMemberAdd(formData)
        .then((data) => {
          if (data.RESULT === 'existMember') {
            setResult('failExist');
          } else if (data.RESULT === 'existPhone') {
            setResult('failExistPhone');
          } else if (data.RESULT === 'existBusinessNumber') {
            setResult('failExistBusinessNumber');
          } else {
            setResult(data.RESULT);
          }
        })
        .catch((err) => exceptionHandle(err));
    }
  };

  const notificationMethods = [
    { id: 'USER', title: '일반회원' },
    { id: 'OWNER', title: '사업자회원' },
  ];

  const [businessNumber, setBusinessNumber] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const API_KEY =
    'aG6IoC0RqTa0qlI%2F1IYOFwZ6WYoBl75hFPreoQ7XfRLta6XWPS2g9r%2BY1ljasxvxdeC%2BEsDL8uoQ5v4LEwsBMg%3D%3D';

  const handleVerify = async (e) => {
    e.preventDefault();

    console.log('*** 사업자 번호: {}', businessNumber);

    try {
      const url = `https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=${API_KEY}`;
      const header = { headers: { 'Content-Type': 'application/json' } };
      const data = JSON.stringify({ b_no: [businessNumber] });
      const response = await axios.post(url, data, header);
      console.log(response.data.status_code);

      if (
        response.data.status_code === 'OK' &&
        response.data.data[0]?.b_stt === '계속사업자'
      ) {
        setIsVerified(true);
        alert('사업자 등록번호 확인이 완료되었습니다.');
      } else {
        alert('유효하지 않은 사업자 등록번호입니다.');
      }
    } catch (error) {
      console.error('API 요청 중 오류 발생:', error);
      alert('사업자 확인 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };


  const closeModal = () => {
    setResult(null);
    moveToPath('/member/login');
  };

  const closeModalFail = () => {
    setResult(null);
    moveToPath('/member/add');
  };

  return (
    <>
      {result &&
      result !== 'failEmail' &&
      result !== 'failPassword' &&
      result !== 'failNickname' &&
      result !== 'failPhone' &&
      result !== 'failExist' &&
      result !== 'failExistPhone' &&
      result !== 'failExistBusinessNumber' ? (
        <ResultModal
          title={'회원 가입 완료'}
          content={`${result}님, 가입을 축하합니다!!!`}
          callbackFn={closeModal}
        />
      ) : result === 'failEmail' ? (
        <ResultModal
          title={'회원 가입 실패'}
          content={`이메일을 다시 확인해 주세요 !`}
          callbackFn={closeModalFail}
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
      ) : result === 'failExist' ? (
        <ResultModal
          title={'회원 가입 실패'}
          content={`이미 가입된 이메일 주소입니다 !`}
          callbackFn={closeModalFail}
        />
      ) : result === 'failExistPhone' ? (
        <ResultModal
          title={'회원 가입 실패'}
          content={`동일한 연락처 회원이 존재합니다 !`}
          callbackFn={closeModalFail}
        />
      ) : result === 'failExistBusinessNumber' ? (
        <ResultModal
          title={'회원 가입 실패'}
          content={`이미 가입된 사업자 등록번호입니다. !`}
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
              src={fishLogo}
              className="mx-auto h-8 w-auto"
            />
            <h2 className="mt-1 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
              회원가입
            </h2>
          </div>

          <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-[480px]">
            <div className="bg-white px-6 py-6 shadow sm:rounded-lg sm:px-12">
              <div className="space-y-4">
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
                    비밀번호*
                  </label>
                  <div className="mt-1">
                    <input
                      name="password"
                      type="password"
                      value={password}
                      onChange={onChangePassword}
                      required
                      autoComplete="current-password"
                      placeholder="숫자+영문자+특수문자 5~15 글자 사이 입력해주세요!"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                    <p className="text-sm text-gray-900">{passwordMessage}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm/6 font-medium text-gray-900">
                    비밀번호 확인*
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
                      placeholder="닉네임은 2~5 사이 글자로 이용하세요"
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
                    프로필 사진*
                  </label>
                  <div className="mt-1 flex justify-center rounded-lg border border-solid border-gray-900/25 px-4 py-4">
                    <div className="text-center">
                      {image ? (
                        <img
                          src={image}
                          alt="Preview"
                          className="mx-auto rounded-lg max-w-full h-auto"
                          style={{ width: 'auto', height: 'auto' }} // 이미지 크기 조정
                        />
                      ) : (
                        <PhotoIcon
                          aria-hidden="true"
                          className="mx-auto size-14 text-gray-300"
                        />
                      )}
                      {!image && (
                        <>
                          <div className="mt-1 flex justify-center text-sm/4 text-gray-600">
                            <label className="relative cursor-pointer rounded-md bg-white font-base text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                              <span>프로필 사진 첨부 필수</span>
                              <input
                                type="file"
                                ref={uploadRef}
                                multiple={false}
                                name="profileImg"
                                className="sr-only"
                                onChange={handleImageChange}
                              />
                            </label>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {/* 회원 유형 및 사업자 등록증 첨부 */}
                <fieldset>
                  <label className="block text-sm/6 font-medium text-gray-900">
                    회원 유형
                  </label>
                  <div className="mt-1 space-y-6 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                    {notificationMethods.map((notificationMethod) => (
                      <div
                        key={notificationMethod.id}
                        className="flex items-center"
                      >
                        <input
                          defaultChecked={notificationMethod.id === 'USER'}
                          id={notificationMethod.id}
                          name="memberType"
                          type="radio"
                          value={notificationMethod.id}
                          onChange={onChangeMemberType}
                          className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
                        />
                        <label
                          htmlFor={notificationMethod.id}
                          className="ml-3 block text-sm/6 font-medium text-gray-900"
                        >
                          {notificationMethod.title}
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="col-span-full">
                    {memberType === 'OWNER' ? (
                      <>
                        <div className="mt-1 flex justify-center rounded-lg border border-solid border-gray-900/25 px-4 py-4">
                          <div className="text-center">
                            {certimage ? (
                              <img
                                src={certimage}
                                alt="Preview"
                                className="mx-auto rounded-lg max-w-full h-auto"
                                style={{ width: 'auto', height: 'auto' }} // 이미지 크기 조정
                              />
                            ) : (
                              <PhotoIcon
                                aria-hidden="true"
                                className="mx-auto size-14 text-gray-300"
                              />
                            )}
                            {!certimage && (
                              <>
                                <div className="mt-1 flex justify-center text-sm/4 text-gray-600">
                                  <label className="relative cursor-pointer rounded-md bg-white font-base text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                                    <span>+ 사업자 등록증 첨부 필수</span>
                                    <input
                                      type="file"
                                      ref={uploadRefCerti}
                                      multiple={false}
                                      name="certiImg"
                                      className="sr-only"
                                      onChange={handleCertChange}
                                    />
                                  </label>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="mt-6 justify-center text-sm/4 text-gray-600">
                          <label
                            htmlFor="businessNumber"
                            className="block mb-1"
                          >
                            사업자 등록번호* (등록번호 확인되어야 가입
                            가능합니다.)
                          </label>
                          <input
                            type="text"
                            id="businessNumber"
                            value={businessNumber}
                            placeholder="-은 생략하고 숫자만 입력하세요"
                            onChange={(e) => setBusinessNumber(e.target.value)}
                            required
                            className="w-full p-2 border rounded"
                            disabled={isVerified}
                          />
                        </div>
                        {!isVerified && (
                          <button
                            type="button"
                            onClick={handleVerify}
                            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                          >
                            사업자 등록번호 확인
                          </button>
                        )}
                        <div className="mt-6 flex items-center justify-center gap-x-6">
                          <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="rounded-md bg-orange-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                          >
                            취소
                          </button>
                          {isVerified && (
                            <button
                              type="button"
                              onClick={handleClickSignup}
                              className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                              가입 완료
                            </button>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="mt-1 hidden justify-center rounded-lg border border-solid border-gray-900/25 px-4 py-4">
                          <div className="text-center">
                            <div className="mt-0 flex justify-center text-sm/4 text-gray-600">
                              <label className="relative cursor-pointer rounded-md bg-white font-base text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                                <span>+ 사업자 등록증 첨부</span>
                                <input
                                  type="file"
                                  ref={uploadRefCerti}
                                  name="certiImg"
                                  className="sr-only"
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="mt-6 flex items-center justify-center gap-x-6">
                          <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="rounded-md bg-orange-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                          >
                            취소
                          </button>

                          <button
                            type="button"
                            onClick={handleClickSignup}
                            className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          >
                            가입 완료
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </fieldset>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default AddComponent;
