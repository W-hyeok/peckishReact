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
