import useCustomMove from '../../hooks/useCustomMove';
import { useEffect, useState } from 'react';
import { getOneMember } from '../../api/memberApi';
import { API_SERVER_HOST } from '../../api/todoApi';
import { getCookie } from '../../util/cookieUtil';

const host = API_SERVER_HOST;

const initState = {
  email: '',
  nickname: '',
  phone: '',
  profileFilename: '',
};

const LeftComponent = () => {
  const {
    page,
    size,
    refresh,
    moveToModify,
    moveToModifyInfo,
    moveToModifyPassword,
  } = useCustomMove();

  const [member, setMember] = useState(initState);

  const cookieMember = getCookie('member');

  useEffect(() => {
    getOneMember(cookieMember.email).then((data) => {
      setMember(data);
    });
  }, [cookieMember.email]);

  console.log('LeftComponent에서 확인: {}', member.profileFilename);

  return (
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
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 ">
                  <div className="col-span-full flex items-center justify-center">
                    <div className="mt-2 flex items-center gap-x-3">
                      <img
                        alt={cookieMember.email}
                        src={`${host}/api/member/view/${cookieMember.profileFilename}`}
                        className="size-52 rounded-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="col-span-full">
                    <label
                      htmlFor="email"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      이메일
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={cookieMember.email}
                        readOnly={true}
                        autoComplete="email"
                        className="block w-full rounded-md bg-white px-3 py-1 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label
                      htmlFor="nickname"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      닉네임
                    </label>
                    <div className="mt-1">
                      <input
                        id="nickname"
                        name="nickname"
                        value={cookieMember.nickname}
                        type="text"
                        readOnly={true}
                        autoComplete="nickname"
                        className="block w-full rounded-md bg-white px-3 py-1 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label
                      htmlFor="phone"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      연락처
                    </label>
                    <div className="mt-1">
                      <input
                        id="phone"
                        name="phone"
                        value={cookieMember.phone}
                        type="text"
                        readOnly={true}
                        autoComplete="phone"
                        className="block w-full rounded-md bg-white px-3 py-1 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-x-6">
                <button
                  type="button"
                  onClick={() => moveToModifyInfo(cookieMember.email)}
                  className="rounded-md bg-yellow-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  개인정보 수정
                </button>
                <button
                  type="button"
                  onClick={() => moveToModifyPassword(cookieMember.email)}
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  비밀번호 변경
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LeftComponent;
