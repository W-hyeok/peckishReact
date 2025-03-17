import React, { Fragment, useEffect } from 'react';
import { API_SERVER_HOST } from '../../api/todoApi';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { deleteMenu } from '../../api/shopApi';

const host = `${API_SERVER_HOST}`;

const DetailUserMenuComponent = ({ handleMenuDelete, menuItems }) => {
  return (
    <div className="scrollbar2 relative">
      {menuItems.map((menuUser, index) => (
        <div
          key={menuUser.menuId}
          className="flex items-center py-4 border-b border-gray-200 hover:bg-gray-50 transition-all duration-200"
        >
          {/* 메뉴 이미지 */}
          <img
            alt={menuUser.menuName}
            src={`${host}/api/shop/view/${menuUser.menuFilename}`}
            className="w-14 h-14 rounded-lg bg-gray-50 mr-4 transition-all duration-300 transform hover:scale-105"
          />

          {/* 메뉴 정보 */}
          <div className="flex-1 min-w-0">
            <dt className="font-semibold text-gray-900 text-lg truncate">
              {menuUser.menuName}
            </dt>
            <dd className="text-sm text-gray-600">
              {menuUser.price.toLocaleString()}원
            </dd>
          </div>

          {/* 삭제 버튼 */}
          <div className="ml-auto flex items-center gap-x-4">
            <Menu as="div" className="relative flex-none">
              <MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                <span className="sr-only">옵션 열기</span>
                <EllipsisVerticalIcon aria-hidden="true" className="size-5" />
              </MenuButton>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                <MenuItem>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleMenuDelete(menuUser.menuId);
                    }}
                    className="block px-3 py-1 text-sm/6 text-gray-900 data-[focus]:bg-gray-50 data-[focus]:outline-none"
                  >
                    삭제하기
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DetailUserMenuComponent;
