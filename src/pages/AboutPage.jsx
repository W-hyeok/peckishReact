import useCustomLogin from '../hooks/useCustomLogin';
import BasicLayout from '../layouts/BasicLayout';

const AboutPage = () => {
  // 예를들어 : AboutPage가 로그인해야 볼수 있는 페이지라면 로그인 상태 체크
  const { isLogin, moveToLoginReturn } = useCustomLogin();
  if (!isLogin) {
    // 로그인 상태가 false면
    return moveToLoginReturn(); // 로그인이동하는 컴포넌트 리턴
  }

  return (
    <BasicLayout>
      <h3>About Page</h3>
    </BasicLayout>
  );
};

export default AboutPage;
