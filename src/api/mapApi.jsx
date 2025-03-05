import axios from 'axios';
import { API_SERVER_HOST } from './todoApi';
import jwtAxios from '../util/jwtUtil';

// api 서버 요청 기능
const host = `${API_SERVER_HOST}/api`;

// sid 주고 맵 하나 불러오기
export const getMap = async (sid) => {
  const result = await axios.get(`${host}/map/${sid}`);
  console.log(sid);
  console.log(result.data);
  return result.data; // MapDTO
};

// 카테고리별 목록 불러오기 getListByCate(매개변수)
export const getMapList = async (krCate, cert, isOpen) => {
  const result = await axios.get(`${host}/${krCate}/${cert}/${isOpen}`);
  console.log(krCate, cert, isOpen);
  return result.data;
};
