import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { modifyMember } from '../../api/adminApi';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import ResultModal from '../common/ResultModal';
import useCustomMove from '../../hooks/useCustomMove';

const initState = {
  email: '',
  nickname: '',
  memberStat: 0,
};

const ModifyComponent = () => {
  const [member, setMember] = useState(...initState);
  const loginInfo = useSelector((state) => state.loginSlice);
  const { moveToLogin } = useCustomLogin();

  // 모달창 open 여부
  const [result, setResult] = useState(null);

  // 페이지 이동
  const { moveToList, moveToRead } = useCustomMove();

  // email로 member 조회 해오기
  // useEffect(() => {
  //   getOne(email).then((data) => setMember(data));
  //   console.log(member);
  // }, [email]);

  useEffect(() => {
    setMember({ ...loginInfo, password: 'ABCD' });
  }, [loginInfo]);

  const handleChangeMember = (e) => {
    member[e.target.name] = e.target.value;
    setMember({ ...member });
  };

  const handleChangeSelect = (e) => {
    const value = e.target.value;
    member.completed = value === 'Y';
    setMember({ ...member });
  };

  const handleClickDelete = () => {
    deleteOne(email).then((data) => {
      console.log('delete!!', data);
      setResult('Deleted');
    });
  };
  // const handleClickModify = () => {
  //   putOne(member).then((data) => {
  //     console.log('modify!!', data);
  //     setResult('Modified');
  //   });
  // };
  const handleClickModify = () => {
    modifyMember(member).then((result) => {
      console.log('modify!!', data);
      setResult('Modified');
    });
  }; 

  // 모달 닫힐때 이벤트 처리
  const closeModal = () => {
    if (result === 'Deleted') {
      // 리스트로 이동
      moveToList();
    } else {
      // 상세페이지로 이동
      moveToRead(email);
    }
  };

  return (
    <>
      {result ? (
        <ResultModal
          title={'회원권한수정'}
          content={회원권한수정완료}
          callbackFn={closeModal}
        />
      ) : (
        <></>
      )}
      <form>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base/7 font-semibold text-gray-900">저장</h2>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label
                  htmlFor="email"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Email
                </label>
                <div className="mt-2">
                  <input
                    readOnly
                    id="email"
                    name="email"
                    type="text"
                    value={member.email}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>
              <div className="sm:col-span-4">
                <label
                  htmlFor="title"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Nickname
                </label>
                <div className="mt-2">
                  <input
                    id="nickname"
                    name="nickname"
                    type="text"
                    value={member.nickname}
                    onChange={handleChangeMember}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="memberStat"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  MemberStat
                </label>
                <div className="mt-2">
                  <input
                    readOnly
                    id="memberStat"
                    name="memberStat"
                    type="text"
                    value={member.memberStat}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            onClick={handleClickDelete}
            className="rounded-md bg-rose-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            삭제
          </button>
          <button
            type="button"
            onClick={handleClickModify}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            저장
          </button>
        </div>
      </form>
    </>
  );
};

export default ModifyComponent;
