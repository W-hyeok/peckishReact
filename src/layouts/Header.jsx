import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Popover,
  PopoverBackdrop,
  PopoverButton,
  PopoverPanel,
} from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { getCookie } from '../util/cookieUtil';
import fishLogo from '/src/assets/fish_logo.png';
import profile from '/src/assets/icon/profile.png';

const user = {
  name: '붕찾사',
  // email: 'boongeubbang@example.com',
  imageUrl: '/src/assets/icon/profile.png',
};
/*
let cookieMember = getCookie('member') ? getCookie('member') : { email: null };

console.log('cookie 확인 *****: {}', cookieMember);

// 로그인 이전 볼 수 있는 링크
const userNavigation = [
  { name: '로그인', href: '/member/login' },
  { name: '회원가입', href: '/member/add' },
];

// 로그인한 일반 사용자만 볼 수 있는 링크
const userNavigationUser = [
  { name: '내 프로필 보기', href: `/member/read/${cookieMember.email}` },
  { name: '로그아웃', href: '/member/logout' },
  { name: '회원탈퇴', href: '/member/leave' },
];

// 로그인한 사업자만 볼 수 있는 링크
const userNavigationOwner = [
  { name: '내 프로필 보기', href: `/member/read/${cookieMember.email}` },
  { name: '점포관리', href: `/shop/detailMoon/${cookieMember.email}` },
  { name: '영업 시작/종료', href: `/member/openClose/${cookieMember.email}` },
  { name: '로그아웃', href: '/member/logout' },
  { name: '회원탈퇴', href: '/member/leave' },
];

// 로그인한 관리자만 볼 수 있는 링크
const userNavigationAdmin = [
  { name: '전체 회원 목록', href: '/admin/list' },
  { name: '전체 점포 목록', href: '/admin/adminshop/shoplist' },
  { name: '전체 사업자 신청 목록', href: '/admin/adminmember/memberlist' },
  { name: '로그아웃', href: '/member/logout' },
];
*/
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Header() {
  let cookieMember = getCookie('member')
    ? getCookie('member')
    : { email: null };

  console.log('cookie 확인 *****: {}', cookieMember);

  // 로그인 이전 볼 수 있는 링크
  const userNavigation = [
    { name: '로그인', href: '/member/login' },
    { name: '회원가입', href: '/member/add' },
  ];

  // 로그인한 일반 사용자만 볼 수 있는 링크
  const userNavigationUser = [
    { name: '내 프로필 보기', href: `/member/read/${cookieMember.email}` },
    { name: '로그아웃', href: '/member/logout' },
    { name: '회원탈퇴', href: '/member/leave' },
  ];

  // 로그인한 사업자만 볼 수 있는 링크
  const userNavigationOwner = [
    { name: '내 프로필 보기', href: `/member/read/${cookieMember.email}` },
    { name: '점포관리', href: `/shop/detailMoon/${cookieMember.email}` },
    { name: '영업 시작/종료', href: `/member/openClose/${cookieMember.email}` },
    { name: '로그아웃', href: '/member/logout' },
    { name: '회원탈퇴', href: '/member/leave' },
  ];

  // 로그인한 관리자만 볼 수 있는 링크
  const userNavigationAdmin = [
    { name: '전체 회원 목록', href: '/admin/list' },
    { name: '전체 점포 목록', href: '/admin/adminshop/shoplist' },
    { name: '전체 사업자 신청 목록', href: '/admin/adminmember/memberlist' },
    { name: '로그아웃', href: '/member/logout' },
  ];
  //cookieMember = getCookie('member') ? getCookie('member') : { email: null };

  const loginState = useSelector((state) => state.loginSlice);
  console.log(loginState.roleNames);

  let numStat = 0;

  if (loginState.email) {
    numStat = loginState.roleNames.length;
  } else {
    numStat = 0;
  }

  const authCookie = getCookie('auth');
  // console.log('authCookie : ' + authCookie);

  return (
    <div className="min-h-full">
      <Popover as="header" className="bg-[#f9dfb1]">
        <div className="mx-10">
          <div className="relative flex items-center justify-center pt-4 pb-2 lg:justify-between">
            {/* Logo */}
            <div className="absolute flex left-0 shrink-0 lg:static">
              <Link to={'/'}>
                <img
                  alt="Your Company"
                  src={fishLogo}
                  className="h-10 w-auto"
                />
              </Link>
              <span className="px-4 py-2 text-2xl font-bold text-[#422006]">
                배고픈 순간!
              </span>
            </div>

            {/* Right section on desktop */}
            <div className="hidden lg:ml-4 lg:flex lg:items-center lg:pr-0.5">
              <button
                type="button"
                className="relative shrink-0 rounded-full p-1 text-gray-100 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
              >
                <span className="absolute -inset-1.5" />
                <span className="sr-only">View notifications</span>
                <BellIcon aria-hidden="true" className="size-6" />
              </button>

              {/* Profile dropdown */}
              <Menu as="div" className="relative ml-4 shrink-0">
                <div>
                  <MenuButton className="relative flex rounded-full bg-white text-sm ring-2 ring-white/20 focus:outline-none focus:ring-white">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <img
                      alt=""
                      src={profile}
                      className="size-12 rounded-full"
                    />
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="absolute -right-2 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none data-[closed]:data-[leave]:scale-95 data-[closed]:data-[leave]:transform data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-75 data-[leave]:ease-in"
                >
                  {/* 로그인한 사용자만 출력되는 메뉴 (웹 크기) */}
                  {loginState.email
                    ? authCookie
                      ? userNavigationAdmin.map((item) => (
                          <MenuItem key={item.name}>
                            <Link
                              to={item.href}
                              className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                            >
                              {item.name}
                            </Link>
                          </MenuItem>
                        ))
                      : numStat == 2
                        ? userNavigationOwner.map((item) => (
                            <MenuItem key={item.name}>
                              <Link
                                to={item.href}
                                className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                              >
                                {item.name}
                              </Link>
                            </MenuItem>
                          ))
                        : userNavigationUser.map((item) => (
                            <MenuItem key={item.name}>
                              <Link
                                to={item.href}
                                className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                              >
                                {item.name}
                              </Link>
                            </MenuItem>
                          ))
                    : userNavigation.map((item) => (
                        <MenuItem key={item.name}>
                          <Link
                            to={item.href}
                            className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                          >
                            {item.name}
                          </Link>
                        </MenuItem>
                      ))}
                </MenuItems>
              </Menu>
            </div>

            {/* Menu button */}
            <div className="absolute right-0 shrink-0 lg:hidden">
              {/* Mobile menu button */}
              <PopoverButton className="group relative inline-flex items-center justify-center rounded-md bg-transparent p-2 text-indigo-200 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon
                  aria-hidden="true"
                  className="block size-6 group-data-[open]:hidden"
                />
                <XMarkIcon
                  aria-hidden="true"
                  className="hidden size-6 group-data-[open]:block"
                />
              </PopoverButton>
            </div>
          </div>
        </div>

        <div className="lg:hidden">
          <PopoverBackdrop
            transition
            className="fixed inset-0 z-20 bg-black/25 duration-150 data-[closed]:opacity-0 data-[enter]:ease-out data-[leave]:ease-in"
          />

          <PopoverPanel
            focus
            transition
            className="absolute inset-x-0 top-0 z-30 mx-auto w-full max-w-3xl origin-top transform p-2 transition duration-150 data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:ease-out data-[leave]:ease-in"
          >
            <div className="divide-y divide-gray-200 rounded-lg bg-white shadow-lg ring-1 ring-black/5">
              <div className="pb-2 pt-3">
                <div className="flex items-center justify-between px-4">
                  <div>
                    <img
                      alt="Your Company"
                      src={fishLogo}
                      className="h-10 w-auto"
                    />
                  </div>
                  <div className="-mr-2">
                    <PopoverButton className="relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon aria-hidden="true" className="size-6" />
                    </PopoverButton>
                  </div>
                </div>
              </div>
              <div className="pb-2 pt-4">
                <div className="flex items-center px-5">
                  <div className="shrink-0">
                    <img
                      alt=""
                      src={profile}
                      className="size-10 rounded-full"
                    />
                  </div>
                  <div className="ml-3 min-w-0 flex-1">
                    <div className="truncate text-base font-medium text-gray-800">
                      {user.name}
                    </div>
                    <div className="truncate text-sm font-medium text-gray-500">
                      {user.email}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="relative ml-auto shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">View notifications</span>
                    <BellIcon aria-hidden="true" className="size-6" />
                  </button>
                </div>
                <div className="mt-3 space-y-1 px-2">
                  {/* 로그인한 사용자만 출력되는 메뉴 */}
                  {loginState.email
                    ? authCookie
                      ? userNavigationAdmin.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
                          >
                            {item.name}
                          </Link>
                        ))
                      : numStat == 2
                        ? userNavigationOwner.map((item) => (
                            <Link
                              key={item.name}
                              to={item.href}
                              className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
                            >
                              {item.name}
                            </Link>
                          ))
                        : userNavigationUser.map((item) => (
                            <Link
                              key={item.name}
                              to={item.href}
                              className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
                            >
                              {item.name}
                            </Link>
                          ))
                    : userNavigation.map((item) => (
                        // <MenuItem key={item.name}>
                        <Link
                          key={item.name}
                          to={item.href}
                          className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
                        >
                          {item.name}
                        </Link>
                        // </MenuItem>
                      ))}
                </div>
              </div>
            </div>
          </PopoverPanel>
        </div>
      </Popover>
    </div>
  );
}
