import { configureStore } from '@reduxjs/toolkit';
import loginSlice from './slices/loginSlice';

// Store 정의하는 파일
export default configureStore({
  // 리듀서 추가는 필수!
  reducer: {
    loginSlice: loginSlice,
  },
});
