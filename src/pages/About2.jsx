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
import {
  CloudArrowUpIcon,
  LockClosedIcon,
  ServerIcon,
} from '@heroicons/react/20/solid';
import '../css/common.css';

import { useEffect, useState } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import {
  Bars3Icon,
  SpeakerWaveIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import useCustomMove from '../hooks/useCustomMove';
import { getCookie } from '../util/cookieUtil';
import { API_SERVER_HOST } from '../api/todoApi';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import fishLogo from '/src/assets/fish_logo.png';
import { HiChat, HiOutlineLocationMarker } from 'react-icons/hi';
import { CiSpeaker } from 'react-icons/ci';
import { FcSpeaker } from 'react-icons/fc';
import { HiSpeakerWave } from 'react-icons/hi2';
import { PiSpeakerHifi } from 'react-icons/pi';
import { TbDeviceSpeaker } from 'react-icons/tb';
import { RiChatSettingsFill } from 'react-icons/ri';
import loginIcon from '../assets/icon/loginIcon.png';
import { BiLogIn } from 'react-icons/bi';
import { HiLogin } from 'react-icons/hi';
import { IconBase } from 'react-icons';
import { CgLogIn } from 'react-icons/cg';
// const navigation = [
//   { name: 'Product', href: '#' },
//   { name: 'Features', href: '#' },
//   { name: 'Marketplace', href: '#' },
//   { name: 'Company', href: '#' },
// ];

const features = [
  {
    name: '내 주변의 노점 찾기.',
    description: '지도에 표시된 마커를 찾아보세요.',
    icon: HiOutlineLocationMarker,
  },
  {
    name: '노점 정보 제보하기.',
    description: `우리 동네 주변의 노점 정보를 제보해주세요. 
사장님이라면 가게를 인증하고, 직접 관리할 수도 있어요.`,
    icon: HiSpeakerWave,
  },
  {
    name: '사장님과 직접 소통하기.',
    description: `사장님이 인증한 가게에서, 채팅 문의를 통해 정보를 주고받아보세요.`,
    icon: HiChat,
  },
];

const host = API_SERVER_HOST;

const About2 = () => {
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
  const authCookie = getCookie('auth');

  return (
    <div className="bg-yellow-100/30">
      {/* <header className="absolute inset-x-0 top-0 z-50">
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
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12"></div>
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
      </header> */}

      {/* 상단 배경(블러) 부분 */}
      <div className="relative isolate">
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
        <div className="min-h-screen overflow-hidden py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto grid grid-flow-row max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
              <div className="lg:pt-4 lg:pr-8">
                <div className="lg:max-w-lg">
                  <div className="flex items-center">
                    <img alt="" src={fishLogo} className="h-16 w-auto pb-2" />
                    <span className="mx-4 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
                      배고픈 순간!
                    </span>
                  </div>
                  <p className="mt-2 text-lg/8 text-gray-600">
                    모두가 함께 만들어가는 우리 동네 노점 지도
                  </p>
                  <dl className="mt-10 max-w-xl space-y-8 text-lg/7 text-gray-600 lg:max-w-none">
                    {features.map((feature) => (
                      <div key={feature.name} className="relative pl-9">
                        <dt className="inline font-semibold text-gray-900">
                          <feature.icon
                            aria-hidden="true"
                            className="absolute top-1 left-1 size-6 text-yellow-600"
                          />
                          {feature.name}
                        </dt>{' '}
                        <dd className="whitespace-pre">
                          {feature.description}
                        </dd>
                      </div>
                    ))}
                    <div className="mt-10 pl-8 flex gap-x-6">
                      <button onClick={moveToMain} className="defaultBtn">
                        시작하기
                      </button>
                      {/* 로그인 상태에서는 표시되지 않음 */}
                      {!cookieMember ? (
                        <button
                          onClick={moveToLogin}
                          className="px-3.5 py-2.5 text-lg font-semibold text-black whitespace-nowrap flex items-center"
                        >
                          로그인하기 <CgLogIn />
                        </button>
                      ) : (
                        <></>
                      )}
                    </div>
                  </dl>
                </div>
              </div>
              <img
                alt="Product screenshot"
                src="https://tailwindcss.com/plus-assets/img/component-images/dark-project-app-screenshot.png"
                width={2432}
                height={1442}
                className="w-[48rem] max-w-none rounded-xl ring-1 shadow-xl ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About2;
