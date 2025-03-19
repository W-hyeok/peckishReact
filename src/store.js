import { configureStore } from '@reduxjs/toolkit';
import loginSlice from './slices/loginSlice';
import languageSlice from './slices/languageSlice';

// Store 정의하는 파일
export default configureStore({
  reducer: {
    loginSlice: loginSlice, // 로그인 상태값
    language: languageSlice, // 언어 상태값
  },
});
