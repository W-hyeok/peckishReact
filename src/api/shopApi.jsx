import axios from 'axios';
import { API_SERVER_HOST } from './todoApi';
import jwtAxios from '../util/jwtUtil';

const host = `${API_SERVER_HOST}/api/shop`;

// 1. 경로
// 2. 경로 요청방식 (back)이랑 맞추기
// 3. axios 값 (경로에서 받아주는 파라미터 값, 화면에서 넘어오는 formData값, 헤더(사진 파일 전송 있을 시, Content-Type))

// 상점 등록
export const postShop = async (shop) => {
  const header = { headers: { 'Content-Type': 'multipart/form-data' } }; // 파일전송위해
  const result = await jwtAxios.post(`${host}/add`, shop, header);
  return result.data;
};

// 제보 정보 추가 등록
export const postUSERShop = async (shopId, shop) => {
  const header = { headers: { 'Content-Type': 'multipart/form-data' } }; // 파일전송위해
  const result = await jwtAxios.post(
    `${host}/add/${shopId}/USER`,
    shop,
    header
  );
  return result.data;
};
// 인증 정보 추가 등록
export const postOWNERShop = async (shopId, shop) => {
  const header = { headers: { 'Content-Type': 'multipart/form-data' } }; // 파일전송위해
  const result = await jwtAxios.post(
    `${host}/add/${shopId}/OWNER`,
    shop,
    header
  );
  return result.data;
};
// 메뉴 등록
export const menuAdd = async (shopId, infoType, menu) => {
  const header = { headers: { 'Content-Type': 'multipart/form-data' } }; // 파일전송위해
  const result = await jwtAxios.post(
    `${host}/addMenu/${shopId}/${infoType}`,
    menu,
    header
  );
  return result.data;
};

// 상점 1개 조회 (Owner)
// 이미지 파일 없으므로 header 지우기
// 경로에서 넘겨주는 shopId
// back과 연결되는 URL
export const getOne = async (shopId) => {
  const result = await axios.get(`${host}/detail/${shopId}`);
  return result.data;
};

// 한 상점의 메뉴 리스트 조회 (AddMenuComp에서 사용)
export const getMenuList = async (shopId, infoType) => {
  const result = await jwtAxios.get(`${host}/addMenu/${shopId}/${infoType}`);
  return result.data;
};

//방문 횟수
export const putVisited = async (shopId, infoType) => {
  const header = { headers: { 'Content-Type ': 'multipart/form-data' } };
  const result = await jwtAxios.put(
    `${host}/shop/detail/${shopId}/${infoType}`,
    header
  );
  return result.data;
};
//상점 수정
export const putOne = async (shopId, shopData, shopDetailId, infoType) => {
  const header = { headers: { 'Content-Type ': 'multipart/form-data' } };
  const result = await jwtAxios.post(
    `${host}/modify/${shopId}/${shopDetailId}/${infoType}`,
    shopData,
    header
  );
  return result.data;
};

//상점 삭제
export const deleteOne = async (shopId, infoType, shopDetailId) => {
  const result = await jwtAxios.delete(
    `${host}/delete/${shopId}/${infoType}/${shopDetailId}`
  );
  return result.data;
};

// 메뉴 삭제
export const deleteMenu = async (menuId, infoType) => {
  const result = await jwtAxios.delete(
    `${host}/deleteMenu/${menuId}/${infoType}`
  );
  return result.data;
};
