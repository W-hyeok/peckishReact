import Footer from './Footer';
import Header from './Header';

const BasicLayout = ({ children }) => {
  return (
    <>
      {/* // flex...: 화면 전체 높이 설정 */}
      <div className="max-h-max p-3 bg-yellow-100/30 ">
        {/* <div
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
        </div> */}
        <Header />
        <div className="min-h-screen">{children}</div>{' '}
        {/* 남은 공간 차지 / footer는 항상 페이지 하단에 고정 */}
      </div>
      <Footer className="relative max-h-max bottom-0 " />
    </>
  );
};

export default BasicLayout;
