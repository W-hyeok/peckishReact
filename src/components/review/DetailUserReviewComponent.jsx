import { StarIcon } from '@heroicons/react/24/solid';
import React from 'react';

const DetailUserReviewComponent = ({
  shopId,
  shopDetailId,
  infoType,
  review,
  handleClickReview,
  ratingAvg,
}) => {
  return (
    <div className="max-h-96 overflow-y-auto scrollbar2 relative">
      {review?.length > 0 ? (
        review.map((reviewUser) => (
          <div
            key={reviewUser.reviewId}
            className="flex space-x-4 text-sm text-gray-500"
          >
            {/* 프로필 이미지 */}
            <div className="flex-none py-5">
              <img
                alt="작성자 프로필 사진"
                src={reviewUser.profileFilename || '/default-profile.png'}
                className="size-10 rounded-full bg-gray-100"
              />
            </div>

            {/* 리뷰 내용 */}
            <div className="flex-1 py-5 border-t border-gray-200">
              <h3 className="font-medium text-gray-900">{reviewUser.email}</h3>
              <p>
                <time dateTime={reviewUser.datetime}>{reviewUser.date}</time>
              </p>

              {/* 별점 표시 */}
              <div className="mt-2 flex items-center gap-x-0.5">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <StarIcon
                    key={rating}
                    className={`size-5 ${
                      reviewUser.rating > rating
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                {/* 평균 별점 숫자 */}
                <span className="text-sm font-medium text-gray-700">
                  ({ratingAvg?.toFixed(1) || '0.0'})
                </span>
              </div>

              <p className="sr-only">{reviewUser.rating} out of 5 stars</p>

              {/* 리뷰 내용 */}
              <div
                dangerouslySetInnerHTML={{ __html: reviewUser.content }}
                className="mt-2 text-sm text-gray-500"
              />
            </div>
          </div>
        ))
      ) : (
        <p className="text-center mt-2 text-gray-600 text-base">
          리뷰를 작성해주세요!
        </p>
      )}

      {/* 리뷰 작성 버튼 - 하단 고정 */}
      <div className="sticky bottom-0 left-0 w-full bg-white shadow-md py-3 flex justify-center">
        <button
          type="button"
          onClick={handleClickReview}
          className="inline-flex items-center justify-center rounded-md border border-transparent bg-yellow-500 px-8 py-3 text-base font-medium text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-700 focus:ring-offset-2 focus:ring-offset-gray-50 transition-all duration-300"
        >
          리뷰 작성
        </button>
      </div>
    </div>
  );
};

export default DetailUserReviewComponent;
