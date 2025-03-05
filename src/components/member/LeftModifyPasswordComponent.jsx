import { useState, useRef, useEffect } from 'react';
import { getCookie } from '../../util/cookieUtil';
import { API_SERVER_HOST } from '../../api/todoApi';
import { putMemberModifyPassword } from '../../api/memberApi';
import useCustomLogin from '../../hooks/useCustomLogin';
import ResultModal from '../../components/common/ResultModal';

const host = API_SERVER_HOST;

const LeftModifyPasswordComponent = () => {
  const cookieMember = getCookie('member');

  const [email, setEmail] = useState('');
  const [profileFilename, setProfileFilename] = useState('');
  const [password, setPassword] = useState('');

  const [result, setResult] = useState(null);

  useEffect(() => {
    // 쿠키 정보를 (db에서 조회 -> 회원 정보 가져와서 )
    // 각 state에 setNick...사용해 값 체우기
    setEmail(cookieMember.email);
    setProfileFilename(cookieMember.profileFilename);
    setPassword(null);
  }, []);

  const { moveToPath, doLogout, exceptionHandle } = useCustomLogin();

  const handleClickModifyPassword = () => {
    const formData = new FormData();

    formData.append('email', email);
    formData.append('password', password);
    formData.append('newPassword', newPassword);

    console.log('modifyPassword - email: ', email);
    console.log('modifyPassword - password: ', password);
    console.log('modifyPassword - newPassword: ', newPassword);

    putMemberModifyPassword(email, formData)
      .then((data) => {
        console.log('회원 일반 정보 수정 data 확인: {}', data);
        setResult(data);
      })
      .catch((err) => exceptionHandle(err));
  };

  // 현 비밀번호 검증
  const [PasswordMessage, setPasswordMessage] = useState('');
  const [isPassword, setIsPassword] = useState(false);
  const onChangePassword = (e) => {
    const currentPassword = e.target.value;
    setPassword(currentPassword);
    const passwordRegExp =
      /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{5,15}$/;
    if (!passwordRegExp.test(currentPassword)) {
      setNewPasswordMessage(
        '숫자+영문자+특수문자 조합으로 5자리 이상 입력해주세요!'
      );
      setIsNewPassword(false);
    } else {
      setNewPasswordMessage('안전한 비밀번호 입니다.');
      setIsNewPassword(true);
    }
  };

  // 비밀번호 유효성 검사
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordMessage, setNewPasswordMessage] = useState('');
  const [isNewPassword, setIsNewPassword] = useState(false);
  const onChangeNewPassword = (e) => {
    const currentPassword = e.target.value;
    setNewPassword(currentPassword);
    const passwordRegExp =
      /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{5,15}$/;
    if (!passwordRegExp.test(currentPassword)) {
      setNewPasswordMessage(
        '숫자+영문자+특수문자 조합으로 5자리 이상 입력해주세요!'
      );
      setIsNewPassword(false);
    } else {
      setNewPasswordMessage('안전한 비밀번호 입니다.');
      setIsNewPassword(true);
    }
  };

  // 비밀번호 확인 유효성 검사
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [newPasswordConfirmMessage, setNewPasswordConfirmMessage] =
    useState('');
  const [isNewPasswordConfirm, setIsNewPasswordConfirm] = useState(false);
  const onChangeNewPasswordConfirm = (e) => {
    const currentPasswordConfirm = e.target.value;
    setNewPasswordConfirm(currentPasswordConfirm);
    if (newPassword !== currentPasswordConfirm) {
      setNewPasswordConfirmMessage('비밀번호가 똑같지 않습니다!');
      setIsNewPasswordConfirm(false);
    } else {
      setNewPasswordConfirmMessage('같은 비밀번호 확인되었습니다!');
      setIsNewPasswordConfirm(true);
    }
  };

  const closeModal = () => {
    doLogout();
    setResult(null);
    moveToPath(`/member/login`);
  };

  const closeModalFail = () => {
    setResult(null);
    moveToPath(`/member/modifyPassword/${email}`);
  };

  return (
    <>
      {result === '일치' ? (
        <ResultModal
          title={'비밀번호 수정 완료'}
          content={`${email}님 다시 로그인 해 주세요`}
          callbackFn={closeModal}
        />
      ) : result === '불일치' ? (
        <ResultModal
          title={'비밀번호 수정 불가'}
          content={`기존 비밀번호를 다시 확인해 주세요`}
          callbackFn={closeModalFail}
        />
      ) : (
        <></>
      )}

      <div className="grid grid-cols-1 gap-4">
        <section aria-labelledby="section-2-title">
          <h2 id="section-2-title" className="sr-only">
            Section Left
          </h2>
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-6">
              {/* Your content */}
              <form>
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
                      <label className="block text-sm/6 font-medium text-gray-900">
                        현 비밀번호 재입력
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
                        <p className="text-sm text-gray-900">
                          {PasswordMessage}
                        </p>
                      </div>
                    </div>

                    <div className="col-span-full">
                      <label className="block text-sm/6 font-medium text-gray-900">
                        새 비밀번호
                      </label>
                      <div className="mt-1">
                        <input
                          name="password"
                          type="password"
                          value={newPassword}
                          onChange={onChangeNewPassword}
                          required
                          autoComplete="current-password"
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                        <p className="text-sm text-gray-900">
                          {newPasswordMessage}
                        </p>
                      </div>
                    </div>

                    <div className="col-span-full">
                      <label className="block text-sm/6 font-medium text-gray-900">
                        새 비밀번호 확인
                      </label>
                      <div className="mt-1">
                        <input
                          name="password"
                          type="password"
                          value={newPasswordConfirm}
                          onChange={onChangeNewPasswordConfirm}
                          required
                          autoComplete="current-password"
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                        <p className="text-sm text-gray-900">
                          {newPasswordConfirmMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

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
                    onClick={handleClickModifyPassword}
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    비밀번호 변경완료
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default LeftModifyPasswordComponent;
