import Footer from './Footer';
import Header from './Header';

const BasicLayout = ({ children }) => {
  return (
    // flex...: 화면 전체 높이 설정
<<<<<<< HEAD
    <div className="grid grid-flow-row min-h-screen bg-[#F9DFB1]">
=======
    <div className="grid grid-flow-row min-h-screen bg-white ">
>>>>>>> b4cc7537d045684c84a1fe83d21a08f91c4bd214
      <Header />
      <div className="">{children}</div>{' '}
      {/* 남은 공간 차지 / footer는 항상 페이지 하단에 고정 */}
      <Footer className="" />
    </div>
  );
};

export default BasicLayout;
