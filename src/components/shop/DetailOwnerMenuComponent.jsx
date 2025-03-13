import React, { Fragment } from 'react';
import { API_SERVER_HOST } from '../../api/todoApi';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import { Menu, MenuButton, MenuItem } from '@headlessui/react';

const host = `${API_SERVER_HOST}`;

const DetailOwnerMenuComponent = ({ menuItems, handleMenuRemove }) => {
  return (
    <div className="max-h-64 scrollbar2">
      <dl>
        {menuItems.length > 0 ? (
          menuItems.map((menuOwner) => (
            <Fragment key={menuOwner.menuId}>
              <div className="flex items-center overflow-x-hidden py-4 border-b border-gray-200 hover:bg-gray-50 transition-all duration-200">
                <img
                  alt={menuOwner.menuName}
                  src={`${host}/api/shop/view/${menuOwner.menuFilename}`}
                  className="w-14 h-14 rounded-full bg-gray-50 mr-6 transition-all duration-300 transform hover:scale-105"
                />
                <div className="flex-1">
                  <dt className="font-semibold text-gray-900 text-lg truncate">
                    {menuOwner.menuName}
                  </dt>
                  <dd className="text-sm text-gray-600">{menuOwner.price}</dd>
                </div>

                <div className="ml-auto flex items-center gap-x-6">
                  <Menu as="div" className="relative flex-none">
                    <MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                      <span className="sr-only">Open options</span>
                      <EllipsisVerticalIcon
                        aria-hidden="true"
                        className="size-5"
                      />
                    </MenuButton>
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5">
                      <MenuItem>
                        {({ close }) => (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleMenuRemove(menuOwner.menuId);
                              close(); // 삭제 후 메뉴 닫기
                            }}
                            className="block px-3 py-1 text-sm w-full text-left text-gray-900 hover:bg-gray-100"
                          >
                            삭제하기
                          </button>
                        )}
                      </MenuItem>
                    </Menu.Items>
                  </Menu>
                </div>
              </div>
            </Fragment>
          ))
        ) : (
          <p className="text-center mt-2 text-gray-600 text-base">
            메뉴를 추가해주세요!
          </p>
        )}
      </dl>
    </div>
  );
};

export default DetailOwnerMenuComponent;
