import React, { Fragment } from 'react';
import { API_SERVER_HOST } from '../../api/todoApi';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import { Menu, MenuButton, MenuItem } from '@headlessui/react';

const host = `${API_SERVER_HOST}`;

const DetailUserMenuComponent = ({ menuItems, handleMenuRemove }) => {
  return (
    <div className="scrollbar2 relative">
      <dl>
        {menuItems.length > 0 ? (
          menuItems.map((menuUser, index) => (
            <Fragment key={index}>
              <div className="flex items-center py-4 border-b border-gray-200 hover:bg-gray-50 transition-all duration-200">
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
                        {({ close }) => (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              close(); // 메뉴 닫기 먼저 실행

                              setTimeout(() => {
                                handleMenuRemove(menuUser.menuId); // 삭제 함수 실행
                              }, 0); // 다음 이벤트 루프에서 실행
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
          <div className="flex flex-col items-center justify-center py-10 text-gray-600 text-base">
            <span className="text-4xl">🍽️</span>
            <p className="mt-2">메뉴를 추가해주세요!</p>
          </div>
        )}
      </dl>
    </div>
  );
};

export default DetailUserMenuComponent;
