// 카카오 API 요청 관련

import axios from 'axios';
import { API_SERVER_HOST } from './todoApi';
import { setCookie } from '../util/cookieUtil';

// 내 카카오 REST API 키
const REST_API_KEY = `e2bb9de569e6e26ca928c488b979d741`;

// Redirect URI
// const REDIRECT_URI = `https://hungrymoment.store/member/kakao`; // (배포용)
const REDIRECT_URI = `http://localhost:5173/member/kakao`; // (local test용)

// 카카오 인가 요청 경로
const AUTH_CODE_PATH = `https://kauth.kakao.com/oauth/authorize`;

// 카카오 Access Token 요청 경로
const ACCESS_TOKEN_URL = `https://kauth.kakao.com/oauth/token`;

// 카카오 인가 요청경로(링크) 크리에이터
export const getKakaoLoginLink = () => {
  const kakaoURL = `${AUTH_CODE_PATH}?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&prompt=login`;

  console.log('카카오 인증 1단계 : 인가 요청경로(URL) 생성');
  return kakaoURL;
};

// 카카오 Access Token 요청 : 카카오 로그인 > 보안 > Client Secret 활성화 사용안함으로 변경!
export const getAccessToken = async (authCode) => {
  const header = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
  };
  const params = {
    grant_type: 'authorization_code',
    client_id: REST_API_KEY,
    redirect_uri: REDIRECT_URI,
    code: authCode,
  };

  const result = await axios.post(ACCESS_TOKEN_URL, params, header);
  console.log(result.data);
  const accessToken = result.data.access_token;
  setCookie('kakaoAccessToken', accessToken, 1);

  console.log('카카오 로그인 인증 2단계 : 액세스 토큰 요청');
  return accessToken;
};

// 카카오 AccessToken과 함께 API 서버 호출
export const getMemberWithAccessToken = async (accessToken) => {
  const result = await axios.get(
    `${API_SERVER_HOST}/api/member/kakao?accessToken=${accessToken}`
  );

  console.log('카카오 로그인 인증 3단계 : 액세스 토큰으로 로그인 요청');
  return result.data;
};
