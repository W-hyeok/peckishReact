import { useState, useRef, useEffect } from 'react';
import { getCookie } from '../../util/cookieUtil';
import { API_SERVER_HOST } from '../../api/todoApi';
import { putMemberModifyInfo } from '../../api/memberApi';
import useCustomLogin from '../../hooks/useCustomLogin';
import ResultModal from '../../components/common/ResultModal';
import { PhotoIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../css/common.css';
import profileMod from '/src/assets/icon/profile_mod.png';

const host = API_SERVER_HOST;

const LeftModifyInfoComponent = () => {
  const cookieMember = getCookie('member');
  const navigate = useNavigate();
  const uploadRef = useRef(); // 프로필 사진 변경 추가 #1

  const [email, setEmail] = useState('');
  const [profileFilename, setProfileFilename] = useState('');
  const [imageName, setImageName] = useState(''); // 프로필 사진 변경 추가 #2
  const [roleNames, setRoleNames] = useState('');

  const [nickname, setNickname] = useState('');
  const [nicknameMessage, setNicknameMessage] = useState('');
  const [isNickname, setIsNickname] = useState(false);

  const [phone, setPhone] = useState('');
  const [phoneMessage, setPhoneMessage] = useState('');
  const [isPhone, setIsPhone] = useState(false);

  const [businessNumber, setBusinessNumber] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const [result, setResult] = useState(null);

  const { moveToPath, doLogout, exceptionHandle } = useCustomLogin();

  useEffect(() => {
    // 쿠키 정보를 (db에서 조회 -> 회원 정보 가져와서 )
    // 각 state에 setNick...사용해 값 체우기
    setEmail(cookieMember.email);
    setProfileFilename(cookieMember.profileFilename);
    let path = host + '/api/member/view/' + cookieMember.profileFilename; // 프로필 사진 변경 추가 #3
    setImageName(path); // 프로필 사진 변경 추가 #4
    setNickname(cookieMember.nickname);
    setPhone(cookieMember.phone);
    setBusinessNumber(cookieMember.businessNumber);
    setMemberType(cookieMember.roleNames.length === 2 ? 'OWNER' : 'USER');
    setRoleNames(cookieMember.roleNames);
  }, []);

  // 닉네임 유효성 검사
  const onChangeNickname = (e) => {
    const currentNickname = e.target.value;
    setNickname(currentNickname);

    if (currentNickname.length < 2 || currentNickname.length > 5) {
      setNicknameMessage('2~5 글자 사이로 입력해주세요!');
      setIsNickname(false);
    } else {
      setNicknameMessage('사용가능한 닉네임 입니다.');
      setIsNickname(true);
    }
  };

  // 전화번호 유효성 검사
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
  const [memberType, setMemberType] = useState('');

  const onChangeMemberType = (e) => {
    const currentMemberType = e.target.value;
    console.log('****####**: {}', currentMemberType);
    setMemberType(currentMemberType);
  };

  const [profileFile, setProfileFile] = useState(null);
  const [image, setImage] = useState(null);

  // 파일 선택 시 호출되는 함수
  const handleImageChange = () => {
    const profImg = uploadRef.current?.files[0]; // 파일을 참조

    if (profImg) {
      setProfileFile(profImg);
      const reader = new FileReader(); // FileReader 생성
      reader.onloadend = () => {
        //setImage(reader.result); // 파일을 읽은 후 image 상태에 URL 저장
        setImageName(reader.result);
      };
      reader.readAsDataURL(profImg); // 파일을 Data URL 형식으로 읽기
    }
  };

  const uploadRefCerti = useRef();

  const [certfile, setCertfile] = useState(null);
  const [certimage, setCertimage] = useState(null);

  // 사업자 등록증 파일 선택 시 호출되는 함수
  const handleCertChange = () => {
    const certImg = uploadRefCerti.current?.files[0]; // 파일을 참조

    if (certImg) {
      setCertfile(certImg); // shopfile 상태에 파일 저장
      const reader = new FileReader(); // FileReader 생성
      reader.onloadend = () => {
        setCertimage(reader.result); // 파일을 읽은 후 image 상태에 URL 저장
      };
      reader.readAsDataURL(certImg); // 파일을 Data URL 형식으로 읽기
    }
  };

  const handleClickModifyInfo = () => {
    if (memberType === 'OWNER' && !certfile) {
      console.error('사업자 등록증 사진이 없습니다!');
      alert('사업자 등록증 사진이 없습니다!');
      return; // 파일이 없으면 저장하지 않음
    }

    // 저장 요청
    const formData = new FormData();

    if (memberType === 'OWNER') {
      formData.append('certiImg', certfile);
      formData.append('businessNumber', businessNumber);
    }
    formData.append('profileImg', profileFile); //  프로필 사진 변경 추가 #5
    formData.append('email', email);
    formData.append('nickname', nickname);
    formData.append('phone', phone);
    formData.append('memberType', memberType);

    console.log('modifyInfo - email: {}', email);
    console.log('modifyInfo - memberType: {}', memberType);

    putMemberModifyInfo(email, formData)
      .then((data) => {
        if (data.RESULT === 'existPhone') {
          setResult('failExistPhone');
        } else if (data.RESULT === 'existBusinessNumber') {
          setResult('failExistBusinessNumber');
        } else {
          setResult(data);
        }
      })
      .catch((err) => exceptionHandle(err));
  };

  const notificationMethods = [
    { id: 'USER', title: '일반회원' },
    { id: 'OWNER', title: '사업자회원' },
  ];

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
        alert('정상적인 사업자 등록번호로 확인되었습니다.');
      } else {
        alert('유효하지 않은 사업자 등록번호입니다.');
      }
    } catch (error) {
      console.error('API 요청 중 오류 발생:', error);
      alert('사업자 확인 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const closeModal = () => {
    doLogout();
    setResult(null);
    moveToPath(`/member/login`);
  };

  const closeModalFail = () => {
    setResult(null);
    moveToPath(`/member/modifyInfo/${email}`);
  };

  return (
    <>
      {result && result !== 'failExistBusinessNumber' ? (
        <ResultModal
          title={'일반 정보 수정 완료'}
          content={`${result}님 다시 로그인 해 주세요`}
          callbackFn={closeModal}
        />
      ) : result === 'failExistBusinessNumber' ? (
        <ResultModal
          title={'정보 수정 실패'}
          content={`이미 가입된 사업자 등록번호입니다. !`}
          callbackFn={closeModalFail}
        />
      ) : (
        <></>
      )}
      <form>
        <div className="grid grid-cols-1 gap-4">
          <h1
            id="section-2-title"
            className="mt-4 text-center text-2xl font-bold tracking-tight text-gray-900"
          >
            정보 수정 페이지
          </h1>
          {/* <div className="overflow-hidden rounded-lg bg-white shadow"> */}
          {/* <div className="p-6"> */}
          {/* <div className="space-y-12"> */}
          <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 ">
            <div className="grid col-span-full flex items-center justify-center">
              <div className="mt-2 flex items-center gap-x-3">
                <img
                  alt={email}
                  src={imageName} // 프로필 사진 변경 추가 #6
                  className="size-64 rounded-lg"
                />
              </div>
              <div className="mt-4 flex justify-center text-sm text-gray-600">
                <label className="relative cursor-pointer rounded-md bg-white font-base text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                  <img
                    src={profileMod} // 프로필 사진 변경 추가 #7
                    className="mx-auto mb-2 size-8 text-gray-500"
                  />
                  <span>사진 변경</span>
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
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
            <div className="col-span-full">
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                이메일
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  readOnly={true}
                  className="block w-full rounded-md bg-gray-200 px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div className="col-span-full">
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
            <div className="col-span-full">
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
          </div>
          {/* </div> */}

          {/* 회원 유형 및 사업자 등록증 첨부 */}
          <fieldset>
            <label className="block text-sm/6 font-medium text-gray-900">
              회원 유형
            </label>
            <div className="mt-1 space-y-6 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
              {notificationMethods.map((notificationMethod) => (
                <div key={notificationMethod.id} className="flex items-center">
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
                    <label htmlFor="businessNumber" className="block mb-1">
                      *사업자 등록번호 확인 후 가입 가능
                    </label>
                    <input
                      type="text"
                      id="businessNumber"
                      name="businessNumber"
                      value={businessNumber}
                      placeholder='"-" 은 생략하고 숫자만 입력하세요"'
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
                      className="negativeBtn"
                    >
                      취소
                    </button>
                    {isVerified && (
                      <button
                        type="button"
                        onClick={handleClickModifyInfo}
                        className="positiveBtn"
                      >
                        완료
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
                  <div className="mt-2 flex items-center justify-center gap-x-6">
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="negativeBtn"
                    >
                      취소
                    </button>

                    <button
                      type="button"
                      onClick={handleClickModifyInfo}
                      className="positiveBtn"
                    >
                      수정
                    </button>
                  </div>
                </>
              )}
            </div>
          </fieldset>
          {/* </div> */}
          {/* </div> */}
          {/* </section> */}
        </div>
      </form>
    </>
  );
};

export default LeftModifyInfoComponent;
