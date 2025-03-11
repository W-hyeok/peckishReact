import axios from 'axios';
import { getCookie } from '../util/cookieUtil';
import { API_SERVER_HOST } from './todoApi';

const memberInfo = getCookie('member');

const memberToken = memberInfo.accessToken;
const header = { headers: { Authorization: `Bearer ${memberToken}` } };

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
    return result.data;
  } catch (error) {
    console.error('채팅방 생성 오류:', error);
    throw error;
  }
};
