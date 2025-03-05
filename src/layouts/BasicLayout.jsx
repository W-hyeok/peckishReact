import Footer from './Footer';
import Header from './Header';

const BasicLayout = ({ children }) => {
  return (
    // flex...: 화면 전체 높이 설정
    <div className="flex flex-col min-h-screen bg-[#f9dfb1]">
      <Header />
      <div className="flex-grow">{children}</div>{' '}
      {/* 남은 공간 차지 / footer는 항상 페이지 하단에 고정 */}
      <Footer />
    </div>
  );
};

export default BasicLayout;
