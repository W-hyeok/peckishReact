import { StarIcon, TrashIcon } from '@heroicons/react/24/solid';
import React from 'react';
import { useTimeStamp } from '../../hooks/useTimeAgo';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import { getCookie } from '../../util/cookieUtil';
import { API_SERVER_HOST } from '../../api/todoApi';

const DetailOwnerReviewComponent = ({
  review = [],
  handleReviewRemove,
  ratingAvg,
}) => {
  const memberCookie = getCookie('member');
  const host = `${API_SERVER_HOST}`;

  return (
    <div className="relative min-h-[300px]">
      {review.map((reviewOwner) => (
        <div
          key={reviewOwner.reviewId}
          className="flex items-start gap-4 py-6 border-b border-gray-200 hover:bg-gray-50 transition-all duration-200"
        >
          {/* 프로필 이미지 */}
          <div className="flex-none w-12 h-12">
            <img
              alt="작성자 프로필 사진"
              src={`${host}/api/shop/view/${reviewOwner.profileFilename}`}
              className="w-12 h-12 rounded-full bg-gray-100 object-cover"
            />
          </div>

          {/* 리뷰 내용 */}
          <div className="flex-1 space-y-1">
            {/* 작성자와 삭제 버튼 */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">
                {reviewOwner.email}
              </h3>
              {memberCookie?.email === reviewOwner.email && (
                <Menu as="div" className="relative">
                  <MenuButton className="p-1 text-gray-500 hover:text-gray-900">
                    <EllipsisVerticalIcon
                      className="w-5 h-5"
                      aria-hidden="true"
                    />
                  </MenuButton>
                  <MenuItems className="absolute right-0 z-10 mt-2 w-24 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-gray-900/5">
                    <MenuItem>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleReviewRemove(reviewOwner.reviewId);
                        }}
                        className="flex items-center justify-center w-full px-3 py-1 text-sm text-gray-900"
                      >
                        삭제하기
                      </button>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              )}
            </div>

            {/* 별점 및 개별 평점 점수 */}
            <div className="flex items-center gap-x-1">
              {[0, 1, 2, 3, 4].map((index) => (
                <StarIcon
                  key={index}
                  className={`w-5 h-5 ${
                    Number(reviewOwner.rating) > index
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-sm text-gray-600 ml-1">
                ({Number(reviewOwner.rating).toFixed(1)})
              </span>
            </div>

            {/* 업데이트 시간: 별점 아래 별도 행 */}
            <div className="text-xs text-gray-500">
              {useTimeStamp(reviewOwner.updateDate)}
            </div>

            {/* 리뷰 내용 */}
            <div
              dangerouslySetInnerHTML={{ __html: reviewOwner.content }}
              className="text-sm text-gray-700 leading-relaxed"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default DetailOwnerReviewComponent;
