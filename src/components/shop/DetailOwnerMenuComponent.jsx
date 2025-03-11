import React, { Fragment } from 'react';
import { API_SERVER_HOST } from '../../api/todoApi';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import { Menu, MenuButton, MenuItem } from '@headlessui/react';

import { deleteMenu } from '../../api/shopApi';

const host = `${API_SERVER_HOST}`;
const DetailOwnerMenuComponent = ({ menuItems, handleMenuRemove }) => {
  return (
    <div className="w-full max-w-[650px] min-h-[192px] max-h-64 overflow-y-auto overflow-x-hidden scrollbar2">
      <dl>
        {menuItems.map((menuOwner, index) => (
          <Fragment key={index}>
            {' '}
            {/* menuId 사용 */}
            <div className="flex items-center overflow-x-hidden py-4 border-b border-gray-200 hover:bg-gray-50 transition-all duration-200">
              <img
                alt={menuOwner.menuName}
                src={`${host}/api/shop/view/${menuOwner.menuFilename}`}
                className="w-14 h-14 rounded-full bg-gray-50 mr-6 transition-all duration-300 transform hover:scale-105"
              />
              <div className="flex-1">
                <dt className="font-semibold text-gray-900 text-lg">
                  {menuOwner.menuName}
                </dt>
                <dd className="text-sm text-gray-600">{menuOwner.price}</dd>
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
                          handleMenuRemove(menuOwner.menuId); // 메뉴 삭제 함수 호출
                        }}
                        className="block px-3 py-1 text-sm text-gray-900"
                      >
                        삭제하기
                        <span className="sr-only">, {menuOwner.menuId}</span>
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

export default DetailOwnerMenuComponent;
