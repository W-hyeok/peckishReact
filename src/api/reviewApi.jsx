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
