import { StarIcon, TrashIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';
import { useTimeStamp } from '../../hooks/useTimeAgo';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import { getCookie } from '../../util/cookieUtil';
import { API_SERVER_HOST } from '../../api/todoApi';

const DetailUserReviewComponent = ({
  review = [],
  handleReviewRemove,
  ratingAvg,
}) => {
  const memberCookie = getCookie('member');
  const host = `${API_SERVER_HOST}`;

  return (
    // 최소 높이(min-h-[300px])를 추가하여 내용이 1개여도 높이가 일정하게 유지됨
    <div className="relative min-h-[300px]">
      {review.map((reviewUser) => (
        <div
          key={reviewUser.reviewId}
          className="flex items-center py-6 border-b border-gray-200 hover:bg-gray-50 transition-all duration-200"
        >
          <div className="flex-none">
            <img
              alt="작성자 프로필 사진"
              src={`${host}/api/shop/view/${reviewUser.profileFilename}`}
              className="w-14 h-14 rounded-full bg-gray-100"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium text-gray-900">
                  {reviewUser.email}
                </h3>
                <p className="text-xs text-gray-500">
                  {useTimeStamp(reviewUser.updateDate)}
                </p>
              </div>
              {/* 삭제버튼 */}
              {memberCookie?.email === reviewUser.email && (
                <Menu as="div" className="relative flex-none">
                  <MenuButton className="p-1 text-gray-500 hover:text-gray-900">
                    <EllipsisVerticalIcon
                      className="size-5"
                      aria-hidden="true"
                    />
                  </MenuButton>
                  <MenuItems className="absolute right-0 z-10 mt-2 w-24 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-gray-900/5">
                    <MenuItem>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleReviewRemove(reviewUser.reviewId);
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

            <div className="mt-1 flex items-center gap-x-1 text-xs text-gray-700">
              {[0, 1, 2, 3, 4].map((rating) => (
                <StarIcon
                  key={rating}
                  className={`w-5 h-5 ${reviewUser.rating > rating ? 'text-yellow-400' : 'text-gray-300'}`}
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
    </div>
  );
};

export default DetailUserReviewComponent;
