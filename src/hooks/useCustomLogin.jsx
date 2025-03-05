import { useDispatch, useSelector } from 'react-redux';
import { loginPostAsync, logout } from '../slices/loginSlice';
import { createSearchParams, Navigate, useNavigate } from 'react-router-dom';

// 로그인 관련 기능들 모아놓기
const useCustomLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 로그인 상태 값
  const loginState = useSelector((state) => state.loginSlice);
  // 로그인 여부
  const isLogin = loginState.email ? true : false;

  // 로그인 함수
  const doLogin = async (loginParam) => {
    const action = await dispatch(loginPostAsync(loginParam));
    return action.payload;
  };

  const doSignup = () => {};

  // 로그아웃 함수
  const doLogout = () => {
    dispatch(logout());
  };

  // 주어진 경로로 페이지 이동하는 함수
  const moveToPath = (path) => {
    navigate({ pathname: path }, { replace: true });
  };

  // 로그인 페이지로 이동 #1 useNavigate
  const moveToLogin = () => {
    navigate({ pathname: '/member/login' }, { replace: true });
  };

  // 로그인 페이지로 이동 #2 Navigate 컴포넌트 리턴
  const moveToLoginReturn = () => {
    return <Navigate replace to="/member/login" />;
  };

  // 예외 처리
  const exceptionHandle = (ex) => {
    console.log('Exception........................');
    console.log(ex);
    const errorMsg = ex.response.data.error;
    const errorStr = createSearchParams({ error: errorMsg }).toString();
    // AccessToken이 쿠키에 없는 경우 (비로그인으로 요청시)
    if (errorMsg === 'REQUIRE_LOGIN') {
      alert('로그인 해야 합니다.');
      navigate({ pathname: '/member/login', search: errorStr });
      return;
    }
    // Access Denied 된 경우
    if (ex.response.data.error === 'ERROR_ACCESS_DENIED') {
      alert('해당 메뉴는 사용할 수 있는 권한이 없습니다.');
      navigate({ pathname: '/member/login', search: errorStr });
      return;
    }
  };

  return {
    loginState,
    isLogin,
    doLogin,
    doSignup,
    doLogout,
    moveToPath,
    moveToLogin,
    moveToLoginReturn,
    exceptionHandle,
  };
};

export default useCustomLogin;
