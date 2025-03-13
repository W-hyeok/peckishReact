import { StarIcon } from '@heroicons/react/24/solid';
import React, { useState, useEffect } from 'react';
import { useTimeStamp } from '../../hooks/useTimeAgo';
import { Menu, MenuButton, MenuItem } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import { getCookie } from '../../util/cookieUtil';

const DetailUserReviewComponent = ({
  review = [],
  handleClickReview,
  handleReviewRemove,
  ratingAvg,
}) => {
  const memberCookie = getCookie('member');
  const [showAll, setShowAll] = useState(false); // 더보기

  const timestamps = review.map((r) => useTimeStamp(r.updateDate));

  if (!review.length) {
    return (
      <div className="text-center mt-2 text-gray-600 text-base">
        아직 등록된 리뷰가 없습니다. 첫 번째 리뷰를 작성해보세요!
      </div>
    );
  }

  // showAll ? 전체 리뷰 표시 : 리뷰 3개만 표시
  const displayedReviews = showAll ? review : review.slice(0, 3);

  return (
    <div className="scrollbar2 relative">
      {displayedReviews.map((reviewUser, index) => (
        <div
          key={reviewUser.reviewId}
          className="flex space-x-3 text-sm text-gray-500 py-4 border-t border-gray-200"
        >
          <div className="flex-none">
            <img
              alt="작성자 프로필 사진"
              src={reviewUser.profileFilename || '/default-profile.png'}
              className="size-8 rounded-full bg-gray-100"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium text-gray-900">
                  {reviewUser.email}
                </h3>
                <p className="text-xs text-gray-500">
                  {timestamps[index] || '방금 전'}
                </p>
              </div>
              {memberCookie?.email === reviewUser.email && (
                <Menu as="div" className="relative flex-none">
                  <MenuButton className="p-1 text-gray-500 hover:text-gray-900">
                    <EllipsisVerticalIcon
                      aria-hidden="true"
                      className="size-4"
                    />
                  </MenuButton>
                  <Menu.Items
                    transition
                    className="absolute right-0 z-10 mt-2 w-24 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-gray-900/5"
                  >
                    <MenuItem>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleReviewRemove(reviewUser.reviewId);
                        }}
                        className="block w-full text-left px-3 py-1 text-sm text-gray-900"
                      >
                        삭제하기
                      </button>
                    </MenuItem>
                  </Menu.Items>
                </Menu>
              )}
            </div>
            <div className="mt-1 flex items-center gap-x-0.5 text-xs text-gray-700">
              {[0, 1, 2, 3, 4].map((rating) => (
                <StarIcon
                  key={rating}
                  className={`size-4 ${reviewUser.rating > rating ? 'text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
              <span>({ratingAvg?.toFixed(1) || '0.0'})</span>
            </div>
            <div
              dangerouslySetInnerHTML={{ __html: reviewUser.content }}
              className="mt-1 text-sm text-gray-600"
            />
          </div>
        </div>
      ))}

      {/* 더보기 버튼 (리뷰가 3개 이상일 때만 표시) */}
      {review.length > 3 && (
        <div className="flex justify-center mt-2">
          <button
            onClick={() => setShowAll((prev) => !prev)} // 이전 상태 prev 반전전
            className="text-blue-500 text-sm font-semibold hover:underline"
          >
            {showAll ? '접기 ▲' : '더보기 ▼'}
          </button>
        </div>
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
