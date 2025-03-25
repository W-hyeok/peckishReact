import React from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import { API_SERVER_HOST } from '../../api/todoApi';

const host = `${API_SERVER_HOST}`;

const DetailOwnerMenuComponent = ({ menuItems, handleMenuDelete }) => {
  return (
    // 최소 높이(min-h-[300px])를 추가하여 내용이 1개여도 높이가 일정하게 유지됨
    <div className="relative min-h-[300px]">
      {menuItems.map((menuOwner) => (
        <div
          key={menuOwner.menuId}
          className="flex items-center py-6 border-b border-gray-200 hover:bg-gray-50 transition-all duration-200"
        >
          <div className="flex-none">
            {/* 메뉴 이미지 - 크기를 키움 */}
            <img
              alt={menuOwner.menuName}
              src={`${host}/api/shop/view/${menuOwner.menuFilename}`}
              className="w-16 h-16 rounded-lg bg-gray-50 mr-4 transition-all duration-300 transform hover:scale-105"
            />
          </div>
          {/* 메뉴 정보 */}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <h3 className="font-medium text-gray-900 text-xl">
                  {menuOwner.menuName}
                </h3>
                <p className="text-base text-gray-600">
                  {menuOwner.price.toLocaleString()}원
                </p>
              </div>
              {/* 삭제 버튼 */}
              <Menu as="div" className="relative flex-none">
                <MenuButton className="p-1 text-gray-500 hover:text-gray-900">
                  <EllipsisVerticalIcon
                    className="w-5 h-5"
                    aria-hidden="true"
                  />
                </MenuButton>
                <MenuItems className="absolute right-0 z-10 mt-2 w-24 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-gray-900/5">
                  <MenuItem>
                    {membercookie.email === shop.shopOwnerDTO.email && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleMenuDelete(menuOwner.menuId);
                        }}
                        className="flex items-center justify-center w-full px-3 py-1 text-base text-gray-900"
                      >
                        {/* 삭제하기 아이콘, 살짝 위로 올림 */}
                        삭제하기
                      </button>
                    )}
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DetailOwnerMenuComponent;
