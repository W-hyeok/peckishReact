import axios from 'axios';
import { getCookie, setCookie } from './cookieUtil';
import { API_SERVER_HOST } from '../api/todoApi';

const jwtAxios = axios.create();

// JWT 토큰 갱신 요청
const refreshJWT = async (accessToken, refreshToken) => {
  const host = API_SERVER_HOST;
  const header = { headers: { Authorization: `Bearer ${accessToken}` } };
  const result = await axios.get(
    `${host}/api/member/refresh?refreshToken=${refreshToken}`,
    header
  );
  console.log('********* refresh JWT ********');
  console.log(result.data);

  return result.data;
};

// 인터셉터 핸들러들
// request 전
const beforeReq = (config) => {
  console.log('before request.....');

  const memberInfo = getCookie('member');
  console.log('befrore request - memberInfo: ', memberInfo);
  if (!memberInfo) {
    // 쿠키에 사용자 정보 없으면
    console.log('Member(Cookie) Not Found');
    return Promise.reject({
      // 실패정보를 Promise.reject로 리턴 -> then().catch()
      response: {
        data: { error: 'REQUIRE_LOGIN' },
      },
    });
  }
  // 정보가 있으면 accessToken 꺼내서 header의 Authorization 으로 토큰값 추가
  const { accessToken } = memberInfo.accessToken;
  config.headers.Authorization = `Bearer ${accessToken}`;

  return config;
};

// request fail
const requestFail = (err) => {
  console.log('request error.....');
  return Promise.reject(err);
};

// response 전
const beforeResp = async (res) => {
  console.log('before return response.....');
  console.log(res); //
  const data = res.data;
  if (data && data.error === 'ERROR_ACCESS_TOKEN') {
    const memberCookieVal = getCookie('member');
    const result = await refreshJWT(
      memberCookieVal.accessToken,
      memberCookieVal.refreshToken
    );
    console.log('refreshJWT result : ', result);

    // 쿠키에 토큰 갱신
    memberCookieVal.accessToken = result.accessToken;
    memberCookieVal.refreshToken = result.refreshToken;
    setCookie('member', JSON.stringify(memberCookieVal), 0.01);

    // 원래 요청 정보 꺼내서, 재요청
    const originalRequest = res.config;
    originalRequest.headers.Authorization = `Bearer ${result.accessToken}`;
    return await axios(originalRequest); // 재요청
  }

  return res;
};

// response fail
const responseFail = (err) => {
  console.log('response fail error.....');
  return Promise.reject(err);
};

// axios 객체에 interceptor 핸들러 함수들 등록
jwtAxios.interceptors.request.use(beforeReq, requestFail);
jwtAxios.interceptors.response.use(beforeResp, responseFail);

export default jwtAxios;
