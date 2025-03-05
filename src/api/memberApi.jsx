import axios from 'axios';
import { API_SERVER_HOST } from './todoApi';
import jwtAxios from '../util/jwtUtil';
import { getCookie } from '../util/cookieUtil';
import { Result } from 'postcss';

const host = `${API_SERVER_HOST}/api/member`;

// 회원 등록
export const postMemberAdd = async (member) => {
  const header = { headers: { 'Content-Type': 'multipart/form-data' } }; // 파일전송위해
  const result = await axios.post(`${host}/`, member, header);
  console.log('백단에서 되돌아온 데이터 확인: {}', result);
  return result.data;
};

// 회원 1명 조회 (이메일로 조회)
export const getOneMember = async (email) => {
  const resultMember = await jwtAxios.get(`${host}/${email}`);
  return resultMember.data;
};

// 회원 1명 조회 (연락처로 조회)
export const getOneMemberByPhone = async (phone) => {
  const resultMemberByPhone = await axios.get(`${host}/phone/${phone}`);
  return resultMemberByPhone.data;
};

export const loginPost = async (loginParam) => {
  const header = { headers: { 'Content-Type': 'x-www-form-urlencoded' } };
  const form = new FormData();
  form.append('username', loginParam.email);
  form.append('password', loginParam.password);

  const result = await axios.post(`${host}/login`, form, header);

  console.log('loginPost에서 result.data 확인(moon): {}', result.data);
  return result.data;
};

export const putMemberModifyKakao = async (email, member) => {
  const header = { headers: { 'Content-Type': 'multipart/form-data' } }; // 파일전송위해
  console.log('********* modify kakao member 확인', member);
  const result = await jwtAxios.put(
    `${host}/modify/kakao/${email}`,
    member,
    header
  );
  console.log('******** modify kakao result.data 확인', result.data);
  return result.data;
};

export const putMemberModifyInfo = async (email, member) => {
  const header = { headers: { 'Content-Type': 'multipart/form-data' } }; // 파일전송위해
  console.log('********* modify info member 확인', member);
  const result = await jwtAxios.put(`${host}/modify/${email}`, member, header);
  console.log('******** modify info result.data 확인', result.data);
  return result.data;
};

export const putMemberModifyPassword = async (email, member) => {
  console.log('********* modify password member 확인', member);
  const result = await jwtAxios.put(`${host}/modifyPassword/${email}`, member);
  console.log('******** modify password result.data 확인', result.data);
  return result.data;
};

// 비밀번호 찾기(임시 비밀번호 발급)
export const putTemporaryPassword = async (email, phone) => {
  console.log('*** 비밀번호 찾기(임시 비번 발급) *** 보낸 data', email, phone);
  const result = await axios.put(
    `${host}/searchPassword/${email}/${phone}`,
    phone
  );
  console.log('*** 비밀번호 찾기(임시 비번 발급) *** 받은 data', result.data);
  return result.data;
};

// 회원 탈퇴
export const deleteOneMember = async (email) => {
  const result = await jwtAxios.delete(`${host}/delete/${email}`);
  return result.data;
};

// 내 프로필에서 목록 불러오기 by moon
export const getMapListFromMyProfile = async (cookieEmail) => {
  const result = await jwtAxios.get(
    `${host}/mapListRequestFromMyProfile/${cookieEmail}`
  );
  console.log('mapAPI에서 cookieEmail 확인: {}', cookieEmail);
  return result.data;
};

// 상점 리스트 조회(제보한 가게 찾기)
// back과 연결되는 URL
export const getShopList = async (email) => {
  const result = await axios.get(`${host}/detail/${email}`);
  console.log('memberApi에서 돌아온 data 확인: {}', result.data);
  return result.data;
};

// 상점 1개 조회 (Owner) : 점포 관리를 위한 상점 조회 by Moon
export const getOneMoon = async (email) => {
  const result = await axios.get(`${host}/getOneShop/${email}`);

  console.log('건너온 shopId 확인: {}', result.data);
  return result.data;
};

export const doOpen = async (email) => {
  const openResultFromBack = await jwtAxios.put(`${host}/putOpenShop/${email}`);

  console.log('건너온 openResultFromBack 확인: {}', openResultFromBack.data);
  return openResultFromBack.data;
};

export const doClose = async (email) => {
  const closeResultFromBack = await jwtAxios.put(
    `${host}/putCloseShop/${email}`
  );

  console.log('건너온 closeResultFromBack 확인: {}', closeResultFromBack.data);
  return closeResultFromBack.data;
};
