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
import landingImage from '../assets/imgs/landingImage.png';

const features = [
  {
    name: '내 주변의 노점 찾기.',
    description: '지도에 표시된 마커를 찾아보세요.',
    icon: HiOutlineLocationMarker,
  },
  {
    name: '노점 정보 제보하기.',
    description: `우리 동네 주변의 노점 정보를 제보해주세요. 
사장님이라면 노점를 인증하고, 직접 관리할 수도 있어요.`,
    icon: HiSpeakerWave,
  },
  {
    name: '사장님과 직접 소통하기.',
    description: `사장님이 인증한 노점에서, 채팅 문의를 통해 정보를 주고받아보세요.`,
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
    { name: '노점관리', href: `/shop/detailMoon/${cookieMember.email}` },
    { name: '영업 시작/종료', href: `/member/openClose/${cookieMember.email}` },
    { name: '로그아웃', href: '/member/logout' },
    { name: '회원탈퇴', href: '/member/leave' },
  ];

  // 로그인한 관리자만 볼 수 있는 링크
  const userNavigationAdmin = [
    { name: '전체 회원 목록', href: '/admin/list' },
    { name: '전체 노점 목록', href: '/admin/adminshop/shoplist' },
    { name: '전체 사업자 신청 목록', href: '/admin/adminmember/memberlist' },
    { name: '로그아웃', href: '/member/logout' },
  ];

  const { moveToLogin, moveToMain } = useCustomMove();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const authCookie = getCookie('auth');

  return (
    <div className="bg-yellow-100/30">
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
        <div className="min-h-screen overflow-hidden sm:py-32 py-5">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            {/* 단일 컬럼: 상단 텍스트, 하단 이미지 */}
            <div className="flex flex-col items-center">
              {/* 텍스트 영역 */}
              <div className="lg:max-w-lg text-center">
                <div className="flex items-center justify-center">
                  <img alt="" src={fishLogo} className="h-16 w-auto pb-2" />
                  <span className="mx-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-pretty text-gray-900">
                    배고픈 순간!
                  </span>
                </div>
                <p className="mt-2 text-lg text-gray-600">
                  모두가 함께 만들어가는 우리 동네 노점 지도
                </p>
                <dl className="mt-10 space-y-8 text-lg text-gray-600">
                  {features.map((feature) => (
                    <div key={feature.name} className="relative pl-9">
                      <dt className="inline font-semibold text-gray-900">
                        <feature.icon
                          aria-hidden="true"
                          className="absolute top-1 left-1 size-6 text-yellow-600"
                        />
                        {feature.name}
                      </dt>
                      <dd className="whitespace-pre-line break-words">
                        {feature.description}
                      </dd>
                    </div>
                  ))}
                  <div className="mt-10 flex gap-x-6 justify-center">
                    <button onClick={moveToMain} className="landBtn">
                      시작하기
                    </button>
                    {/* 로그인 상태가 아닐 때만 로그인 버튼 노출 */}
                    {!cookieMember ? (
                      <button
                        onClick={moveToLogin}
                        className="px-3.5 py-2.5 text-lg font-semibold text-black whitespace-nowrap flex items-center"
                      >
                        로그인하기 <CgLogIn />
                      </button>
                    ) : null}
                  </div>
                </dl>
              </div>
              {/* 이미지 영역 */}
              <div className="mt-10 w-full flex justify-center">
                <img
                  alt="Product screenshot"
                  src={landingImage}
                  className="w-full max-w-lg rounded-xl ring-1 shadow-xl ring-gray-400/10 md:max-w-xl lg:max-w-5xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About2;
