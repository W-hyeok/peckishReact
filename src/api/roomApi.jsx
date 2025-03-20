import axios from 'axios';
import { getCookie } from '../util/cookieUtil';
import { API_SERVER_HOST } from './todoApi';

const memberInfo = getCookie('member');
// memberInfo가 없으면 memberToken은 null 또는 빈 문자열 처리
const memberToken = memberInfo ? memberInfo.accessToken : '';
const header = memberToken
  ? { headers: { Authorization: `Bearer ${memberToken}` } }
  : {}; // 로그인하지 않은 경우 헤더는 빈 객체

export const getList = async (memberEmail) => {
  try {
    const result = await axios.get(
      `${API_SERVER_HOST}/room/list/${memberEmail}`,
      header
    );
    return result.data;
  } catch (error) {
    console.error('getList ERROR ! :', error);
    throw error;
  }
};

export const getListOwner = async (ownerEmail) => {
  try {
    const result = await axios.get(
      `${API_SERVER_HOST}/room/listOwner/${ownerEmail}`,
      header
    );
    return result.data;
  } catch (error) {
    console.error('getList ERROR ! :', error);
    throw error;
  }
};

export const getListDetail = async (memberEmail) => {
  try {
    const result = await axios.get(
      `${API_SERVER_HOST}/room/listDetail/${memberEmail}`,
      header
    );
    return result.data;
  } catch (error) {
    console.error('getList ERROR ! :', error);
    throw error;
  }
};

export const getMsgs = async (room_ID) => {
  try {
    const result = await axios.get(
      `${API_SERVER_HOST}/room/msgs/${room_ID}`,
      header
    );
    console.log(result.data);
    return result.data;
  } catch (error) {
    console.error('getMsgs ERROR ! :', error);
    throw error;
  }
};
export const createRoom = async ({ member1, member2, shopId }) => {
  try {
    const result = await axios.post(
      `${API_SERVER_HOST}/room/create`,
      {
        member1,
        member2,
        shopId,
      },
      header
    );
    console.log('방생성 반환결과', result.data);
    return result.data;
  } catch (error) {
    console.error('채팅방 생성 오류:', error);
    throw error;
  }
};
