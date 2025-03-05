import { useState, useRef, useEffect } from 'react';
import { getCookie } from '../../util/cookieUtil';
import { API_SERVER_HOST } from '../../api/todoApi';
import { putMemberModifyInfo } from '../../api/memberApi';
import useCustomLogin from '../../hooks/useCustomLogin';
import ResultModal from '../../components/common/ResultModal';

const host = API_SERVER_HOST;

const LeftModifyInfoComponent = () => {
  const cookieMember = getCookie('member');

  const [email, setEmail] = useState('');
  const [profileFilename, setProfileFilename] = useState('');
  const [roleNames, setRoleNames] = useState('');

  const [nickname, setNickname] = useState('');
  const [nicknameMessage, setNicknameMessage] = useState('');
  const [isNickname, setIsNickname] = useState(false);

  const [phone, setPhone] = useState('');
  const [phoneMessage, setPhoneMessage] = useState('');
  const [isPhone, setIsPhone] = useState(false);

  const [memberType, setMemberType] = useState('');

  const uploadRefCerti = useRef();

  const [result, setResult] = useState(null);

  const { moveToPath, doLogout, exceptionHandle } = useCustomLogin();

  useEffect(() => {
    // 쿠키 정보를 (db에서 조회 -> 회원 정보 가져와서 )
    // 각 state에 setNick...사용해 값 체우기
    setEmail(cookieMember.email);
    setProfileFilename(cookieMember.profileFilename);
    setNickname(cookieMember.nickname);
    setPhone(cookieMember.phone);
    setMemberType(cookieMember.roleNames.length === 2 ? 'OWNER' : 'USER');
    setRoleNames(cookieMember.roleNames);
  }, []);

  const handleClickModifyInfo = () => {
    // 저장 요청
    const cerImg = uploadRefCerti.current.files[0];

    const formData = new FormData();
    if (cerImg) {
      formData.append('certiImg', cerImg);
    }

    formData.append('email', email);
    formData.append('nickname', nickname);
    formData.append('phone', phone);
    formData.append('memberType', memberType);

    console.log('modifyInfo - email: {}', email);
    console.log('modifyInfo - memberType: {}', memberType);

    putMemberModifyInfo(email, formData)
      .then((data) => {
        console.log('회원 일반 정보 수정 data 확인: {}', data);
        setResult(data);
      })
      .catch((err) => exceptionHandle(err));
  };

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

  const onChangeMemberType = (e) => {
    const currentMemberType = e.target.value;
    setMemberType(currentMemberType);
  };

  const notificationMethods = [
    { id: 'USER', title: '일반회원' },
    { id: 'OWNER', title: '사업자회원' },
  ];

  const closeModal = () => {
    doLogout();
    setResult(null);
    moveToPath(`/member/login`);
  };

  return (
    <>
      {result ? (
        <ResultModal
          title={'일반 정보 수정 완료'}
          content={`${result}님 다시 로그인 해 주세요`}
          callbackFn={closeModal}
        />
      ) : (
        <></>
      )}
      <form>
        <div className="grid grid-cols-1 gap-4">
          <section aria-labelledby="section-2-title">
            <h2 id="section-2-title" className="sr-only">
              Section Left
            </h2>
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-6">
                {/* Your content */}

                <div className="space-y-12">
                  <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6 ">
                    <div className="col-span-full flex items-center justify-center">
                      <div className="mt-2 flex items-center gap-x-3">
                        <img
                          alt={email}
                          src={`${host}/api/member/view/${profileFilename}`}
                          className="size-52 rounded-full"
                        />
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
                        닉네임
                      </label>
                      <div className="mt-1">
                        <input
                          name="nickname"
                          type="text"
                          value={nickname}
                          // value={nickname}
                          onChange={onChangeNickname}
                          required
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                        <p className="text-sm text-gray-900">
                          {nicknameMessage}
                        </p>
                      </div>
                    </div>

                    <div className="col-span-full">
                      <label className="block text-sm/6 font-medium text-gray-900">
                        연락처
                      </label>
                      <div className="mt-1">
                        <input
                          name="phone"
                          type="text"
                          value={phone}
                          onChange={addHyphen}
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                        <p className="text-sm text-gray-900">{phoneMessage}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 회원 유형 및 사업자 등록증 첨부 */}
                <fieldset>
                  <label className="block text-sm/6 font-medium text-gray-900 mt-4">
                    회원 유형
                  </label>
                  <div className="mt-1 space-y-6 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                    {notificationMethods.map((notificationMethod) => (
                      <div
                        key={notificationMethod.id}
                        className="flex items-center"
                      >
                        <input
                          defaultChecked={
                            notificationMethod.id ===
                            `${roleNames[roleNames.length - 1]}`
                          }
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
                    <div className="mt-2 flex justify-center rounded-lg border border-solid border-gray-900/25 px-4 py-4">
                      <div className="text-center">
                        <div className="mt-0 flex justify-center text-sm/4 text-gray-600">
                          <label className="relative cursor-pointer rounded-md bg-white font-base text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                            <span>+ 사업자 등록증 첨부</span>
                            <input
                              type="file"
                              ref={uploadRefCerti}
                              className="sr-only"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </fieldset>

                <div className="mt-6 flex items-center justify-center gap-x-6">
                  <button
                    type="button"
                    className="rounded-md bg-yellow-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => moveToPath(`/member/read/${email}`)}
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    onClick={handleClickModifyInfo}
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    수정완료
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </form>
    </>
  );
};

export default LeftModifyInfoComponent;
