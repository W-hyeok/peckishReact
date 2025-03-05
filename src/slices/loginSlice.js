import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { loginPost } from '../api/memberApi';
import { getCookie, removeCookie, setCookie } from '../util/cookieUtil';

// email 값이 있으면 로그인으로 간주, 그렇지 않으면 비로그인 상태로 처리
const initState = {
  email: '',
};

// 어플리케이션 로딩시, 쿠키 활용
const loadMemberCookie = () => {
  const memberInfo = getCookie('member');
  if (memberInfo && memberInfo.nickname) {
    memberInfo.nickname = decodeURIComponent(memberInfo.nickname);
  }
  return memberInfo;
};

// 비동기 작업을 처리하는 createAsyncThunk 생성
export const loginPostAsync = createAsyncThunk('loginPostAsync', (param) => {
  console.log(
    'loginPostAsync에서 loginnPost(param) 확인(moon): {}',
    loginPost(param)
  );
  return loginPost(param); // API서버 요청함수 호출
});

const loginSlice = createSlice({
  name: 'LoginSlice',
  // 쿠키먼저 꺼내봐서 있으면 쿠키값을 state로 지정, 없으면 초기값으로 지정
  initialState: loadMemberCookie() || initState,
  // 동기적 처리하는 곳
  reducers: {
    // action 크리에이터 + 리듀서 로직
    login: (state, action) => {
      console.log('login.....');
      // * 수정 : 소셜로그인시 리액트 상에서 로그인처리 = 쿠키에 추가
      const data = action.payload;
      setCookie('member', JSON.stringify(data), 1); // 1일
      // 관리자일때 auth 쿠키추가
      data.roleNames.forEach((element) => {
        console.log(element);
        if (element === 'ADMIN') {
          setCookie('auth', 'ADMIN', 1);
        }
      });
      return data; // 수정
    },
    logout: (state, action) => {
      console.log('logout!!');
      removeCookie('member'); // 쿠키 삭제
      removeCookie('auth');
      return { ...initState }; // state 초기화
    },
  },
  // 비동기 처리하는 곳
  extraReducers: (builder) => {
    builder
      .addCase(loginPostAsync.fulfilled, (state, action) => {
        console.log('fulfilled!'); // 완료
        const payload = action.payload; // 응답 데이터
        console.log(payload.roleNames);
        //console.log(payload);
        // 쿠키에 사용자 정보 남기기 (새로고침해도 로그인 상태 유지)
        if (!payload.error) {
          setCookie('member', JSON.stringify(payload), 1); // 1day
          // 관리자일때 auth 쿠키 추가
          payload.roleNames.forEach((element) => {
            console.log(element);
            if (element === 'ADMIN') {
              setCookie('auth', 'ADMIN', 1);
            }
          });
        }
        return payload;
      })
      .addCase(loginPostAsync.pending, (state, action) => {
        console.log('pending...'); // 처리중
      })
      .addCase(loginPostAsync.rejected, (state, action) => {
        console.log('rejected!'); // 실패
      });
  },
});

// 액션크리에이터는 컴포넌트에서 사용하기 위해 export 처리
export const { login, logout } = loginSlice.actions;

// reducer는 configureStore에 리듀서 등록하기 위해 export 처리
export default loginSlice.reducer;
