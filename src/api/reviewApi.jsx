import axios from 'axios';
import { API_SERVER_HOST } from './todoApi';
import jwtAxios from '../util/jwtUtil';

const host = `${API_SERVER_HOST}/api/review`;

// 리뷰 등록
export const postReview = async (shopId, shopDetailId, infoType, review) => {
  const result = await jwtAxios.post(
    `${host}/add/${shopId}/${shopDetailId}/${infoType}`,
    review
  );
  return result.data;
};

// 리뷰 조회
export const getReview = async (shopId, infoType) => {
  const result = await axios.get(`${host}/get/${shopId}/${infoType}`);
  return result.data;
};

// 리뷰 수정
export const updateReview = async (reviewId, infoType, review) => {
  const result = await axios.post(
    `${host}/modify/${reviewId}/${infoType}`,
    review
  );
  return result.data;
};
// USER - 리뷰 평점 계산
export const getUserRating = async (shopId) => {
  const result = await axios.get(`${host}/average/${shopId}/USER`);
  return result.data;
};

// OWNER - 리뷰 평점 계산
export const getOwnerRating = async (shopId) => {
  const result = await axios.get(`${host}/average/${shopId}/OWNER`);
  return result.data;
};

// 리뷰 삭제시에도 자동 처리
// export const DeleteReviewRating = async (shopId) => {
//   const result = await axios.get(`${host}/get/${shopId}/${infoType}`);
//   return result.data;
// };

// 리뷰 삭제시에도 자동 처리
export const deleteReview = async (reviewId, infoType) => {
  const result = await jwtAxios.delete(
    `${host}/delete/${reviewId}/${infoType}`
  );
  return result.data;
};
