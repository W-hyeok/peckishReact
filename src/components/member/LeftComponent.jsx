import useCustomMove from '../../hooks/useCustomMove';
import { useEffect, useState } from 'react';
import { getOneMember } from '../../api/memberApi';
import { API_SERVER_HOST } from '../../api/todoApi';
import { getCookie } from '../../util/cookieUtil';
import '../../css/common.css';

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
      {/* <section aria-labelledby="section-2-title"> */}
        <h1 id="section-2-title" className="mt-4 text-center text-2xl font-bold tracking-tight text-gray-900">
          마이 페이지
        </h1>
        <div className="p-6">
          <form>
            {/* <div className="space-y-12"> */}
              {/* <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 "> */}
                <div className="col-span-full flex items-center justify-center mt-0 mb-4">
                    <img
                      alt={cookieMember.email}
                      src={`${host}/api/member/view/${cookieMember.profileFilename}`}
                      className="size-64 rounded-lg"
                    />
                </div>
              {/* </div> */}
              {/* </div> */}

            <div className="mt-2 mb-2 flex items-center justify-center gap-x-8">
              <button
                type="button"
                onClick={() => moveToModifyInfo(cookieMember.email)}
                className="defaultBtn"
              >
                개인정보 수정
              </button>
              <button
                type="button"
                onClick={() => moveToModifyPassword(cookieMember.email)}
                className="defaultBtn"
              >
                비밀번호 변경
              </button>
            </div>
          </form>
        </div>
      {/* </section> */}
    </div>
  );
};

export default LeftComponent;
