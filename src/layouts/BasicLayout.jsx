import Footer from './Footer';
import Header from './Header';

const BasicLayout = ({ children }) => {
  return (
    // flex...: 화면 전체 높이 설정
    <div className="grid grid-flow-row min-h-screen bg-[#F9DFB1]">
      <Header />
      <div className="">{children}</div>{' '}
      {/* 남은 공간 차지 / footer는 항상 페이지 하단에 고정 */}
      <Footer className="" />
    </div>
  );
};

export default BasicLayout;
