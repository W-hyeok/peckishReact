import axios from 'axios';
import { API_SERVER_HOST } from './todoApi';
import jwtAxios from '../util/jwtUtil';

const prefix = `${API_SERVER_HOST}/api/admin`;

// 관리자 list 조회
export const getAdminList = async (pageParm) => {
  const { page, size } = pageParm;
  const result = await jwtAxios.get(`${prefix}/list`, {
    params: { page: page, size: size },
  });
  console.log('*****visit-count 확인: {}', result.data.visitCount);
  return result.data; //PageResponseDTO
};
// 관리자 Shoplist 조회
export const getAdminShopList = async (pageParm) => {
  const { page, size } = pageParm;
  const result = await jwtAxios.get(`${prefix}/shoplist`, {
    params: { page: page, size: size },
  });
  return result.data; //PageResponseDTO
};
// 관리자 Memberlist 조회
export const getAdminMemberList = async (pageParm) => {
  const { page, size } = pageParm;
  const result = await jwtAxios.get(`${prefix}/memberlist`, {
    params: { page: page, size: size },
  });
  return result.data; //PageResponseDTO
};
// email 로 Member 조회
export const getOneMember = async (email) => {
  const resultMember = await jwtAxios.get(`${prefix}/${email}`);
  return resultMember.data;
};

// 수정
export const modifyMember = async (member) => {
  const result = await jwtAxios.put(`${prefix}/modify`, member);
  return result.data;
};

// 수정
export const modifyMemberStat = async (email) => {
  const result = await jwtAxios.put(`${prefix}/modifyInfo/${email}`);
  return result.data;
};

// 사업자 승인 반려 처리(동일 사업자 번호 존재 --> memberStat = 4로 처리 -> 사업자 로그인 시도시 알림 처리)
export const modifyMemberStat4 = async (email) => {
  const result = await jwtAxios.put(`${prefix}/modifyInfoReturn/${email}`);
  return result.data;
};
