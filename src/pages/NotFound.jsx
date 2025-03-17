import { Link } from 'react-router-dom';
import useCustomMove from '../hooks/useCustomMove';

export default function NotFound() {
  const { moveToMain, moveToBack } = useCustomMove();
  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full">
        <body class="h-full">
        ```
      */}
      <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-3xl font-semibold text-yellow-600">404</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
            페이지를 찾을 수 없습니다.
          </h1>
          <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
            페이지가 존재하지 않거나 사용할 수 없는 페이지입니다. <br />{' '}
            입력하신 주소를 다시 확인해주세요.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-3">
            <a
              onClick={moveToBack}
              className="h-fit w-fit px-4 py-2 bg-white text-black text-xl font-semibold rounded-[8px] mt-6"
            >
              <span aria-hidden="true">&larr;</span> 이전 페이지
            </a>
            <a
              onClick={moveToMain}
              className="h-fit w-fit px-4 py-2 bg-white text-yellow-400 text-xl font-semibold rounded-[8px] mt-6 border-[2px] border-yellow-400 hover:bg-yellow-400 hover:text-white"
            >
              메인 화면으로 이동
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
