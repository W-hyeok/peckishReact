import { useSearchParams } from 'react-router-dom';
import { getAccessToken, getMemberWithAccessToken } from '../../api/kakaoApi';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useCustomLogin from '../../hooks/useCustomLogin';
import { login } from '../../slices/loginSlice';

const KakaoRedirectPage = () => {
  const [searchParams] = useSearchParams();
  const authCode = searchParams.get('code'); // 인가코드

  const dispatch = useDispatch();
  // test

  const { moveToPath } = useCustomLogin();

  useEffect(() => {
    // 카카오 Access Token 요청
    getAccessToken(authCode).then((accessToken) => {
      console.log(accessToken);
      // 응답받은 Access Token 보내며,우리 API서버에 RestTemplate 이용한 카카오회원정보 조회를 요청
      getMemberWithAccessToken(accessToken).then((memberInfo) => {
        console.log('~~~~~~~~~~~');
        console.log(memberInfo); // API서버에서 응답받은 claims 데이터
        // 리액트상 로그인 처리
        dispatch(login(memberInfo));

        if (memberInfo && !memberInfo.social) {
          // 이미 가입한 소셜회원(=일반회원 이미 처리됨)인 경우
          moveToPath('/');
        } else {
          // 처음 소셜회원으로 로그인(가입)인 경우
          moveToPath('/member/modify');
        }
      });
    });
  }, [authCode]);

  return (
    <div>
      <div> Kakao Login Redirect Page </div>
      <div>{authCode}</div>
    </div>
  );
};

export default KakaoRedirectPage;
