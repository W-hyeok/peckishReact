import useCustomLogin from '../hooks/useCustomLogin';
import BasicLayout from '../layouts/BasicLayout';
('use client');
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

import { useEffect, useState } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import useCustomMove from '../hooks/useCustomMove';
import { getCookie } from '../util/cookieUtil';
import { API_SERVER_HOST } from '../api/todoApi';
import { useSelector } from 'react-redux';
import { href, Link } from 'react-router-dom';
import fishLogo from '/src/assets/fish_logo.png';

// const navigation = [
//   { name: 'Product', href: '#' },
//   { name: 'Features', href: '#' },
//   { name: 'Marketplace', href: '#' },
//   { name: 'Company', href: '#' },
// ];

const host = API_SERVER_HOST;

const AboutPage = () => {
  const loginState = useSelector((state) => state.loginSlice);
  useEffect(() => {
    console.log(loginState.roleNames);
  }, []);

  let numStat = 0;

  if (loginState.email) {
    numStat = loginState.roleNames.length;
  } else {
    numStat = 0;
  }
  let cookieMember = getCookie('member')
    ? getCookie('member')
    : { email: null };

  useEffect(() => {
    console.log('cookie 확인 *****: {}', cookieMember);
  }, []);
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
    { name: '문의 사항', href: '/roomList' },
  ];

  // 로그인한 관리자만 볼 수 있는 링크
  const userNavigationAdmin = [
    { name: '전체 회원 목록', href: '/admin/list' },
    { name: '전체 점포 목록', href: '/admin/adminshop/shoplist' },
    { name: '전체 사업자 신청 목록', href: '/admin/adminmember/memberlist' },
    { name: '로그아웃', href: '/member/logout' },
  ];

  const { moveToLogin, moveToMain } = useCustomMove();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-yellow-100/30">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          aria-label="Global"
          className="flex items-center justify-between p-6 lg:px-8"
        >
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img alt="" src={fishLogo} className="h-12 w-auto" />
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Open main menu</span>
              {/* <Bars3Icon aria-hidden="true" className="size-6" /> */}
              {/* Profile dropdown */}
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {/* {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm/6 font-semibold text-gray-900"
              >
                {item.name}
              </a>
            ))} */}
          </div>
          <div className="lg:flex lg:flex-1 lg:justify-end">
            <Menu as="div" className="relative ml-4 shrink-0">
              <div>
                <MenuButton className="relative flex rounded-full bg-white text-sm ring-2 ring-white/20 focus:outline-none focus:ring-white">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  {cookieMember ? (
                    <img
                      alt=""
                      src={`${host}/api/member/view/${cookieMember.profileFilename}`}
                      className="size-12 rounded-full"
                    />
                  ) : (
                    <></>
                  )}
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
        </nav>
        {/* <Dialog
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
          className="lg:hidden"
        >
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img
                  alt=""
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                  className="h-8 w-auto"
                />
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  <a
                    onClick={moveToLogin}
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    Log in
                  </a>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog> */}
      </header>

      <div className="relative isolate pt-14">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#e48989] to-[#e696c2ce] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>
        <div className="py-24 sm:py-32 lg:pb-40">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            {/* 제목, 설명 부분 */}
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
                배고픈 순간!
              </h1>
              <p className="mt-8 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
                모두가 함께 만들어가는 노점 지도
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a
                  onClick={moveToMain}
                  className="rounded-md bg-yellow-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-yellow-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
                >
                  시작하기
                </a>
                {/* <a href="#" className="text-sm/6 font-semibold text-gray-900">
                  Learn more <span aria-hidden="true">→</span>
                </a> */}
              </div>
            </div>
            {/* 캐러샐 부분? */}
            <div className="mt-16 flow-root sm:mt-24">
              <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                <img
                  alt="App screenshot"
                  src="https://tailwindcss.com/plus-assets/img/component-images/project-app-screenshot.png"
                  width={2432}
                  height={1442}
                  className="rounded-md shadow-2xl ring-1 ring-gray-900/10"
                />
              </div>
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="bg-yellow-100/30 absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#79d885] to-[#d6e076] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          />
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
