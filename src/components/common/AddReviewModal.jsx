import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import React from 'react';
import Star from '../review/Star';
import { getCookie } from '../../util/cookieUtil';
import ResultModal from './ResultModal';
import { postReview } from '../../api/reviewApi';

const initState = {
  content: '',
  rating: 0, // 별점 추가
};

const AddReviewModal = ({
  shopId,
  shopDetailId,
  infoType,
  title,
  content,
  callbackFn,
}) => {
  const [open, setOpen] = useState(true);
  const [review, setReview] = useState({ ...initState });
  const [result, setResult] = useState(false); // ResultModal을 열기 위한 상태
  const [errorMessage, setErrorMessage] = useState(''); // 오류 메시지를 저장할 상태

  // email 정보 쿠키에서 꺼내오기
  const memberCookie = getCookie('member');
  const writerEmail = memberCookie?.email || ''; // 쿠키에서 이메일을 가져옵니다.

  // 모달 닫기
  const handleClose = () => {
    setOpen(false);
    if (callbackFn) {
      callbackFn();
    }
  };

  // Enter 키 입력 처리
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // 기본 엔터 키 동작 방지 (줄바꿈 X)
      handleSave(); // 리뷰 저장 실행
    }
  };

  // 리뷰 저장
  const handleSave = () => {
    // 유효성 검사
    if (review.rating === 0) {
      setErrorMessage('별점을 선택해주세요.');
      return;
    }

    if (!review.content.trim()) {
      setErrorMessage('리뷰 내용을 작성해주세요.');
      return;
      // 공백 제거 후 content 내용이 비어있다면
      // 리뷰 내용이 비어 있으면 저장되지 않도록 처리
    }

    // 유효성 검사 통과 시
    setErrorMessage(''); // 오류 메시지 초기화
    console.log('저장된 리뷰:', review);

    // 리뷰 저장할 내용을 담은 formData
    const formData = new FormData();

    formData.append('rating', review.rating);
    formData.append('content', review.content);
    formData.append('email', writerEmail);

    // 리뷰 저장 api 요청
    postReview(shopId, shopDetailId, infoType, formData)
      .then((data) => {
        console.log('리뷰저장버튼 클릭', data);
        setResult(true);
        console.log('DB 저장완료');
      })
      .catch((err) => console.log('전송실패', err));
  };

  // ResultModal 닫기
  const closeModal = () => {
    setResult(false); // ResultModal 닫을 때 result를 false로 설정
    handleClose();
    console.log('리뷰 저장확인 모달 닫기');
  };

  // 별점 변경 핸들러
  const handleRatingChange = (rating) => {
    console.log('새로운 별점 : ', rating);
    setReview((prevReview) => ({
      ...prevReview,
      rating: rating,
    }));
  };

  // 리뷰 내용 변경 핸들러
  const handleChangeReview = (e) => {
    setReview({ ...review, content: e.target.value });
  };

  return (
    <>
      {result && (
        <ResultModal
          title={'리뷰 등록 성공'}
          content={`${memberCookie.email}님 리뷰가 등록되었습니다`}
          callbackFn={closeModal}
        />
      )}

      <Dialog open={open} onClose={handleClose} className="relative z-10">
        <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto flex justify-center items-center">
          <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl sm:w-full sm:max-w-sm sm:p-6">
            <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-blue-100">
              <PencilSquareIcon className="size-6 text-blue-600" />
            </div>
            <div className="mt-3 text-center sm:mt-5">
              <DialogTitle
                as="h3"
                className="text-base font-semibold text-gray-900"
              >
                {title}
              </DialogTitle>
              <p className="mt-2 text-sm text-gray-500">{content}</p>
            </div>

            {/* 별점 */}
            <div className="flex flex-col items-center mt-4">
              <Star
                rating={review.rating}
                onRatingChange={handleRatingChange}
              />
            </div>

            {/* 작성자 */}
            <div className="mt-4">
              <label
                htmlFor="writer"
                className="block text-sm font-medium text-gray-900"
              >
                작성자
              </label>
              <input
                id="writer"
                name="writer"
                type="text"
                value={writerEmail} // 쿠키에서 가져온 이메일 값 사용
                readOnly
                className="block w-full rounded-md bg-gray-100 px-3 py-1.5 text-base text-gray-900 outline-none"
              />
            </div>

            {/* 리뷰 내용 */}
            <div className="mt-4">
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-900"
              >
                리뷰 내용
              </label>
              <textarea
                id="content"
                name="content"
                rows={3}
                value={review.content}
                onChange={handleChangeReview}
                onKeyDown={handleKeyDown}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300 placeholder-gray-400 focus:border-indigo-600"
              ></textarea>
            </div>

            {/* 오류 메시지 */}
            {errorMessage && (
              <div className="mt-2 text-sm text-red-500">{errorMessage}</div>
            )}

            {/* 버튼 */}
            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={handleClose} // 모달 닫기
                className="w-1/2 mr-2 py-2 rounded-md bg-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-400"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSave} // 리뷰 저장
                className="w-1/2 py-2 rounded-md bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                저장
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default AddReviewModal;
