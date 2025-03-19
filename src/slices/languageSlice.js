import { createSlice } from '@reduxjs/toolkit';
import { getCookie, setCookie } from '../util/cookieUtil';

const initialState = {
  code: 'ko',
  name: '한국어',
  flag: 'kr',
};

const loadLanguageCookie = () => {
  const cookieLanguage = getCookie('transLang');
  console.log('저장된 언어:', cookieLanguage);
  return cookieLanguage;
};

const languageSlice = createSlice({
  name: 'language',
  // 쿠키에 language로 저장된 언어 값이 있으면 해당 값으로 언어 지정, 없으면 초기값으로 지정
  initialState: loadLanguageCookie() || initialState,
  reducers: {
    selectLanguage: (state, action) => {
      console.log('언어 선택...');
      console.log('선택된 언어(slice):', action.payload); // {code: 'en', name: 'English', flag: 'us'}
      // 선택한 언어로 쿠키에 저장
      setCookie('transLang', JSON.stringify(action.payload), 1);
      return { ...state, ...action.payload };
    },
  },
});

export const { selectLanguage } = languageSlice.actions;

export default languageSlice.reducer;
