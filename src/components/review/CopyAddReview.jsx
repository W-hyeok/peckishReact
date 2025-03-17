import React, { useState } from 'react';
import Star from '../review/Star';
import { postReview } from '../../api/reviewApi';
import ResultModal from '../common/ResultModal';

const initState = {
  content: '',
  rating: 0,
};

const AddReviewComponent = ({
  memberCookie,
  shopId,
  shopDetailId,
  infoType,
  handleSave, // 부모에서 전달받은 refreshData 함수
}) => {
  const [open, setOpen] = useState(true);
  const [reviewform, setReviewForm] = useState({ ...initState });
  const [result, setResult] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleClose = () => {
    setOpen(false);
  };

  const closeModal = () => {
    setResult(false);
    handleClose();
    console.log('리뷰 저장확인 모달 닫기');
  };

  const handleChangeReview = (e) => {
    setReviewForm({ ...reviewform, content: e.target.value });
  };

  const handleRatingChange = (rating) => {
    console.log('새로운 별점 : ', rating);
    setReviewForm((prevReview) => ({
      ...prevReview,
      rating: rating,
    }));
  };

  // 내부 리뷰 저장 함수
  const handleReviewSave = () => {
    if (reviewform.rating === 0) {
      setErrorMessage('별점을 선택해주세요.');
      return;
    }
    if (!reviewform.content.trim()) {
      setErrorMessage('리뷰 내용을 작성해주세요.');
      return;
    }
    setErrorMessage('');
    console.log('저장된 리뷰:', reviewform);

    const formData = new FormData();
    formData.append('rating', reviewform.rating);
    formData.append('content', reviewform.content);
    formData.append('email', memberCookie?.email || '');

    postReview(shopId, shopDetailId, infoType, formData)
      .then((data) => {
        console.log('리뷰저장버튼 클릭', data);
        setResult(true);
        setReviewForm({ ...initState });
        // 리뷰 저장 성공 후 부모의 refreshData 호출
        if (handleSave) {
          handleSave(data.Result);
        }
        console.log('DB 저장완료');
      })
      .catch((err) => console.log('전송실패', err));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleReviewSave();
    }
  };

  return (
    <>
      {result && (
        <ResultModal
          title={'리뷰 등록 성공'}
          content={`${memberCookie?.email || '사용자'}님 리뷰가 등록되었습니다`}
          callbackFn={closeModal}
        />
      )}
      <div className="flex flex-col items-center mt-4">
        <Star rating={reviewform.rating} onRatingChange={handleRatingChange} />
      </div>
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
          value={reviewform.content}
          onChange={handleChangeReview}
          onKeyDown={handleKeyDown}
          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300 placeholder-gray-400 focus:border-indigo-600"
        ></textarea>
      </div>
      {errorMessage && (
        <div className="mt-2 text-sm text-red-500">{errorMessage}</div>
      )}
      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={handleClose}
          className="w-1/2 mr-2 py-2 rounded-md bg-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-400"
        >
          취소
        </button>
        <button
          type="button"
          onClick={handleReviewSave}
          className="w-1/2 py-2 rounded-md bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          저장
        </button>
      </div>
    </>
  );
};

export default AddReviewComponent;
