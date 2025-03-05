import {
  Popover,
  PopoverBackdrop,
  PopoverButton,
  PopoverPanel,
} from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';

// 카테고리값 초기화 객체(배열)
const initialNavigation = [
  { name: '붕어빵', href: '#', current: false },
  { name: '분식', href: '#', current: false },
  { name: '군고구마', href: '#', current: false },
  { name: '호떡', href: '#', current: false },
];

// 인증/제보값 초기화 객체(배열)
const initialCertification = [
  { name: '제보된 가게', href: '#', current: false },
  { name: '사장님 직영점', href: '#', current: false },
];

// 영업중 값 초기화 객체(배열)
const initialIsOpen = [{ name: '영업 중', href: '#', current: false }];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

// 부모 컴포넌트로부터 내려받은 함수들 기입
export default function HeaderFilter({
  onChangeAddress,
  onEnter,
  onFilterClick,
  filterData,
  onCertClick,
  onOpenClick,
}) {
  // 필터 상태 관리
  const [navigation, setNavigation] = useState(initialNavigation); // 카테고리
  const [certification, setCertification] = useState(initialCertification); // 인증/제보
  const [isOpen, setIsOpen] = useState(initialIsOpen); // 영업중

  // 검색어 입력값
  const handleInputChange = (e) => {
    const newData = e.target.value;
    onChangeAddress(newData);
  };

  // ?
  const activeButton = () => {
    console.log('enter!');
  };

  // 엔터 시 버튼 클릭 효과
  const enter = (e) => {
    if (e.key === 'Enter') {
      onEnter();
    }
  };

  // 필터 클릭 이벤트
  const clickEvent = (itemName) => {
    // navigation 상태 업데이트: 클릭한 항목 활성화, 나머지 비활성화
    setNavigation((prev) =>
      prev.map((item) =>
        // item.name(배열 중 n번째 객체의 name)과,
        // itemName(선택된 객체의 name(onClick={() => clickEvent(item.name)}))이 일치하는 것에 대해,
        // 그 current값을 true로 설정 (배열 전부 돌리면서 진행. 아닌 것들은 false로 설정)
        item.name === itemName
          ? { ...item, current: true }
          : { ...item, current: false }
      )
    );
    // 필터 클릭값 요청을 위한 함수. {카테고리}/-/-로 요청
    onFilterClick(itemName);

    // 필터 초기화 클릭 시 모든 상태값 초기화, all/0/0으로 요청
    if (itemName === '초기화') {
      setNavigation(initialNavigation);
      setCertification(initialCertification);
      setIsOpen(initialIsOpen);
      onFilterClick('all');
      onCertClick(0);
      onOpenClick(0);
    }
  };

  // 제보/인증 클릭 이벤트
  const certClick = (certName) => {
    setCertification((prev) =>
      prev.map((cert) =>
        // 상동. 배열 중 n번째 객체와 클릭한 객체가 동일할 경우, 해당 객체의 current를 true로 설정
        cert.name === certName
          ? { ...cert, current: true }
          : { ...cert, current: false }
      )
    );

    // 사장님 직영점 -> -/2/- 로 요청
    if (certName === '사장님 직영점') {
      onCertClick(2);
      // 제보된 가게 -> -/1/-로 요청
    } else if (certName === '제보된 가게') {
      onCertClick(1);
    }
  };

  // 영업 중 클릭 이벤트
  const openClick = (openName) => {
    setIsOpen((prev) =>
      prev.map((open) =>
        open.name === openName
          ? { ...open, current: true }
          : { ...open, current: false }
      )
    );
    // 영업중 -> -/-/1로 요청
    if (openName === '영업 중') {
      onOpenClick(1);
    }
  };
  return (
    <div className="min-h-full">
      <Popover as="header" className="bg-[#f9dfb1] pb-2">
        <div className="mx-10">
          {/* 모바일 화면. 별도 추가 필요 */}
          <div className="relative flex items-center justify-center lg:justify-between">
            <div className="min-w-0 flex-1 items-start py-2 lg:hidden">
              <div className="grid pt-2 w-full max-w-xs grid-cols-1">
                <input
                  onChange={handleInputChange}
                  onKeyDown={enter}
                  name="search"
                  type="search"
                  placeholder="위치/주소 검색..."
                  aria-label="Search"
                  className="peer col-start-1 row-start-1 block w-full rounded-md bg-white/50 py-1.5 pl-10 pr-3 text-sm/6 text-black outline-none placeholder:text-black
                            focus:bg-white focus:text-gray-900 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-white/40 focus:placeholder:text-gray-400"
                />
                <button onClick={activeButton} className="hidden"></button>
                <MagnifyingGlassIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-black peer-focus:text-gray-400"
                />
              </div>
            </div>
            {/* 버튼들... 카테고리 넣으면 될듯? */}
            <div className="absolute right-0 shrink-0 lg:hidden">
              {/* 누르면 나타나는(popover) 버튼 */}
              <PopoverButton className="group relative inline-flex items-center justify-center rounded-md bg-transparent p-2 text-indigo-200 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                {/* 바 3개 아이콘 */}
                <Bars3Icon
                  aria-hidden="true"
                  className="block size-6 group-data-[open]:hidden"
                />
                {/* 닫기 아이콘 */}
                <XMarkIcon
                  aria-hidden="true"
                  className="hidden size-6 group-data-[open]:block"
                />
              </PopoverButton>
            </div>
          </div>
          <div className="hidden border-t border-white/100 py-2 lg:block">
            <div className="grid grid-cols-5 items-center gap-4">
              <div className="col-span-3">
                <nav className="flex">
                  {/* 카테고리 */}
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={() => clickEvent(item.name)} // 필터 클릭 시 '카테고리값' 요청
                      className={classNames(
                        item.current ? 'bg-yellow-400' : 'text-black',
                        'rounded-md px-3 py-2 mx-1 text-sm font-black bg-white hover:bg-yellow-950/10'
                      )}
                    >
                      {item.name}
                    </a>
                  ))}
                  <hr className="h-auto w-0.5 bg-white/60 mx-2" />
                  {/* 제보/인증 여부 */}
                  {certification.map((cert) => (
                    <a
                      key={cert.name}
                      href={cert.href}
                      onClick={() => certClick(cert.name)} // 필터 클릭 시 '제보/인증' 요청
                      className={classNames(
                        cert.current ? 'bg-red-400' : 'text-black',
                        'rounded-md px-3 py-2 mx-1 text-sm font-black bg-white hover:bg-yellow-950/10'
                      )}
                    >
                      {cert.name}
                    </a>
                  ))}
                  <hr className="h-auto w-0.5 bg-white/60 mx-2" />
                  {/* 영업 중 */}
                  {isOpen.map((open) => (
                    <a
                      key={open.name}
                      href={open.href}
                      onClick={() => openClick(open.name)} // 필터 클릭 시 '영업 중' 요청
                      className={classNames(
                        open.current ? 'bg-emerald-300' : 'text-black', // 논리 상 이상은 없으나 안먹는 색상(green-300 같이)이 있음...
                        'rounded-md px-3 py-2 mx-1 text-sm font-black bg-white hover:bg-yellow-950/10'
                      )}
                    >
                      {open.name}
                    </a>
                  ))}
                  {/* 필터 초기화 */}
                  <a
                    className="rounded-md px-3 pt-2.5 text-sm font-black ml-auto"
                    onClick={() => clickEvent('초기화')}
                  >
                    필터 초기화
                  </a>
                </nav>
              </div>
              <div className="mx-auto grid w-full max-w-md grid-cols-1 col-span-2 px-24">
                <input
                  onChange={handleInputChange}
                  onKeyDown={enter}
                  name="search"
                  type="search"
                  placeholder="위치/주소 검색..."
                  aria-label="Search"
                  className="peer col-start-1 row-start-1 block w-full rounded-md bg-white/50 py-1.5 pl-10 pr-3 
                  text-sm/6 text-black outline-none 
                  focus:bg-white focus:text-gray-900 
                  focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-white/40 focus:placeholder:text-gray-400"
                />
                <button onClick={activeButton} className="hidden"></button>
                <MagnifyingGlassIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-black peer-focus:text-gray-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 모바일 화면 전용(큰 화면일 때는 숨겨짐(lg:hidden)) */}
        <div className="lg:hidden">
          <PopoverBackdrop
            transition
            className="fixed inset-0 z-20 bg-black/25 duration-150 data-[closed]:opacity-0 data-[enter]:ease-out data-[leave]:ease-in"
          />
          {/* 누르면 나타나는(popover) 패널 */}
          <PopoverPanel
            focus2="true" // focus2 값이 boolean이라서, 문자열만 받는 html에선 경고 발생 - ="true"로 값 명시 필요
            transition
            className="absolute inset-x-0 top-0 z-30 mx-auto w-full max-w-3xl origin-top transform p-2 transition duration-150 data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:ease-out data-[leave]:ease-in"
          >
            <div className="divide-y divide-gray-200 rounded-lg bg-white shadow-lg ring-1 ring-black/5">
              <div className="pb-2 pt-3">
                <div className="flex items-center justify-between px-4">
                  <div className="-mr-2">
                    {/* 패널 닫기 버튼? */}
                    <PopoverButton className="relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon aria-hidden="true" className="size-6" />
                      <div className="pl-1 pt-1"> 필터를 선택하세요... </div>
                    </PopoverButton>
                  </div>
                </div>
                {/* 패널 내 버튼 목록 */}
                <div className="mt-3 space-y-1 px-2">
                  {/* <button className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800">
                    버튼1
                  </button>
                  <button className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800">
                    버튼2
                  </button>
                  <button className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800">
                    버튼3
                  </button>
                  <button className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800">
                    버튼4
                  </button> */}
                  <div className="mb-2">
                    {/* 카테고리 */}
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        onClick={() => clickEvent(item.name)} // 필터 클릭 시 '카테고리값' 요청
                        className={classNames(
                          item.current ? 'bg-orange-300' : 'text-black',
                          'rounded-md px-3 py-2 mx-1 text-sm font-black bg-yellow-400/20 hover:bg-yellow-950/10'
                        )}
                      >
                        {item.name}
                      </a>
                    ))}
                    <hr className="h-auto w-auto mt-2 bg-black mx-2" />
                  </div>
                  <div className="mb-2">
                    {/* 제보/인증 여부 */}
                    {certification.map((cert) => (
                      <a
                        key={cert.name}
                        href={cert.href}
                        onClick={() => certClick(cert.name)} // 필터 클릭 시 '제보/인증' 요청
                        className={classNames(
                          cert.current ? 'bg-red-300' : 'text-black',
                          'rounded-md px-3 py-2 mx-1 text-sm font-black bg-rose-300/20 hover:bg-yellow-950/10'
                        )}
                      >
                        {cert.name}
                      </a>
                    ))}
                    <hr className="h-auto w-auto my-2 bg-black mx-2" />
                  </div>
                  <div className="mt-2">
                    {/* 영업 중 */}
                    {isOpen.map((open) => (
                      <a
                        key={open.name}
                        href={open.href}
                        onClick={() => openClick(open.name)} // 필터 클릭 시 '영업 중' 요청
                        className={classNames(
                          open.current ? 'bg-green-400' : 'text-black', // 논리 상 이상은 없으나 안먹는 색상(green-300 같이)이 있음...
                          'rounded-md px-3 py-2 mx-1 text-sm font-black bg-emerald-300/20 hover:bg-yellow-950/10'
                        )}
                      >
                        {open.name}
                      </a>
                    ))}
                    <hr className="h-auto w-auto mt-2 bg-black mx-2" />
                  </div>
                  <div>
                    {/* 필터 초기화 */}
                    <a
                      className="rounded-md px-3 pt-2.5 text-sm font-black ml-auto"
                      onClick={() => clickEvent('초기화')}
                    >
                      필터 초기화
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </PopoverPanel>
        </div>
      </Popover>
    </div>
  );
}
