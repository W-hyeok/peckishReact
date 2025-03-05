import { Cookies } from 'react-cookie';

const cookies = new Cookies();

// 쿠키 생성 함수
export const setCookie = (name, value, days) => {
  const expires = new Date();
  expires.setUTCDate(expires.getUTCDate() + days);

  return cookies.set(name, value, { path: '/', expires: expires });
};

// 쿠키 조회 함수
export const getCookie = (name) => {
  return cookies.get(name);
};

// 쿠키 삭제 함수
export const removeCookie = (name, path = '/') => {
  cookies.remove(name, { path });
};
