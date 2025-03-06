import axios from 'axios';
import jwtAxios from '../util/jwtUtil';

// API서버 요청 기능
// export const API_SERVER_HOST = 'http://3.38.234.141:8080'; // (배포용)
export const API_SERVER_HOST = 'http://localhost:8080'; // (local test용)


// const prefix = `${API_SERVER_HOST}/api/todo`;

// // tno 로 Todo 조회
// export const getOne = async (tno) => {
//   const result = await jwtAxios.get(`${prefix}/${tno}`);
//   return result.data;
// };

// // list 조회
// export const getList = async (pageParam) => {
//   const { page, size } = pageParam;
//   const result = await jwtAxios.get(`${prefix}/list`, {
//     params: { page: page, size: size }, // url 파라미터 추가
//   });
//   return result.data; // PageResponseDTO
// };

// // POST - Todo등록 요청
// export const postAdd = async (todoObj) => {
//   const result = await jwtAxios.post(`${prefix}/`, todoObj);
//   return result.data; // {"tno" : tno값}
// };

// // 삭제
// export const deleteOne = async (tno) => {
//   const result = await jwtAxios.delete(`${prefix}/${tno}`);
//   return result.data;
// };

// // 수정
// export const putOne = async (todoObj) => {
//   const result = await jwtAxios.put(`${prefix}/${todoObj.tno}`, todoObj);
//   return result.data;
// };
