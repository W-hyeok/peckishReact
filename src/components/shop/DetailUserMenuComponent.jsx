import React, { Fragment } from 'react';
import { API_SERVER_HOST } from '../../api/todoApi';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import { Menu, MenuButton, MenuItem } from '@headlessui/react';

const host = `${API_SERVER_HOST}`;

const DetailUserMenuComponent = ({ menuItems, handleMenuRemove }) => {
  return (
    <div className="max-h-64 scrollbar2">
      <dl>
        {menuItems.map((menuUser, index) => (
          <Fragment key={index}>
            <div className="flex items-center overflow-x-hidden py-4 border-b border-gray-200 hover:bg-gray-50 transition-all duration-200">
              <img
                alt={menuUser.menuName}
                src={`${host}/api/shop/view/${menuUser.menuFilename}`}
                className="w-14 h-14 rounded-full bg-gray-50 mr-6 transition-all duration-300 transform hover:scale-105"
              />
              <div className="flex-1">
                <dt className="font-semibold text-gray-900 text-lg">
                  {menuUser.menuName}
                </dt>
                <dd className="text-sm text-gray-600">{menuUser.price}</dd>
              </div>
              {/* 각 메뉴 항목마다 삭제 버튼을 추가 */}
              <div className="ml-auto flex items-center gap-x-6">
                <Menu as="div" className="relative flex-none">
                  <MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                    <span className="sr-only">Open options</span>
                    <EllipsisVerticalIcon
                      aria-hidden="true"
                      className="size-5"
                    />
                  </MenuButton>
                  <Menu.Items
                    transition
                    className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5"
                  >
                    <MenuItem>
                      <a
                        onClick={(e) => {
                          e.preventDefault();
                          handleMenuRemove(menuUser.menuId); // 메뉴 삭제 함수 호출
                        }}
                        className="block px-3 py-1 text-sm text-gray-900"
                      >
                        삭제하기
                        <span className="sr-only">, {menuUser.menuId}</span>
                      </a>
                    </MenuItem>
                  </Menu.Items>
                </Menu>
              </div>
            </div>
          </Fragment>
        ))}
      </dl>
    </div>
  );
};

export default DetailUserMenuComponent;
