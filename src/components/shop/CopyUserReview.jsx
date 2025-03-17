import React, { useState, useEffect } from 'react';
import { StarIcon } from '@heroicons/react/20/solid';
import { Menu, MenuButton, MenuItem } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import AddReviewComponent from './AddReviewComponent';
import { useTimeStamp } from '../../hooks/useTimeAgo';

const DetailUserReviewComponent = ({
  review, // 리뷰 배열
  memberCookie,
  shopId,
  shopDetailId,
  infoType,
  handleReviewRemove,
  handleReviewAdded,
}) => {
  const [visibleCount, setVisibleCount] = useState(3);
  const [timestamps, setTimestamps] = useState([]);

  useEffect(() => {
    const newTimestamps = review.map((r) =>
      new Date(r.updateDate).toLocaleString()
    );
    setTimestamps(newTimestamps);
  }, [review]);

  return (
    <div className="scrollbar2 relative">
      {/* 리뷰 작성 컴포넌트 */}
      <AddReviewComponent
        memberCookie={memberCookie}
        shopId={shopId}
        shopDetailId={shopDetailId}
        infoType={infoType}
        handleSave={handleReviewAdded} // 리뷰 저장 후 부모 refreshData 호출
      />
      {/* 리뷰 목록 */}
      {review.slice(0, visibleCount).map((reviewUser, index) => (
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
                    <EllipsisVerticalIcon className="size-4" />
                  </MenuButton>
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-24 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-gray-900/5">
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
              {[0, 1, 2, 3, 4].map((star, idx) => (
                <StarIcon
                  key={idx}
                  className={`size-4 ${reviewUser.rating > star ? 'text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
              <span>({reviewUser.rating.toFixed(1)})</span>
            </div>
            <div
              dangerouslySetInnerHTML={{ __html: reviewUser.content }}
              className="mt-1 text-sm text-gray-600"
            />
          </div>
        </div>
      ))}
      {review.length > visibleCount && (
        <div className="flex justify-center mt-2">
          <button
            onClick={() => setVisibleCount((prev) => prev + 5)}
            className="text-blue-500 text-sm font-semibold hover:underline"
          >
            더보기 ▼
          </button>
        </div>
      )}
    </div>
  );
};

export default DetailUserReviewComponent;
