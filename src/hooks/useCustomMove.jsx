import { useState } from 'react';
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

const getQuery = (param, defaultValue) => {
  if (!param) {
    return defaultValue;
  }
  return parseInt(param);
};

const useCustomMove = () => {
  const navigate = useNavigate(); // 이동할 때 필요
  const [queryParams] = useSearchParams(); // 쿼리스트링조회 page,size
  const [refresh, setRefresh] = useState(false); // 목록 페이지 데이터 갱신(refresh) 토글

  // queryString default 설정
  const page = getQuery(queryParams.get('page'), 1);
  const size = getQuery(queryParams.get('size'), 12);
  const queryDefault = createSearchParams({ page, size }).toString(); // default querystring

  // 리스트로 이동 (리스트버튼, 페이지번호 눌러 이동시에도 사용)
  const moveToList = (pageParam) => {
    // pageParam = {page: 3, size:10}
    let queryStr = '';
    if (pageParam) {
      const pageNum = getQuery(pageParam.page, 1);
      const sizeNum = getQuery(pageParam.size, 12);
      queryStr = createSearchParams({
        page: pageNum,
        size: sizeNum,
      }).toString();
    } else {
      queryStr = queryDefault;
    }
    setRefresh(!refresh);
    navigate({ pathname: `../list`, search: queryStr });
  };
  const moveToListmem = (pageParam) => {
    // pageParam = {page: 3, size:10}
    let queryStr = '';
    if (pageParam) {
      const pageNum = getQuery(pageParam.page, 1);
      const sizeNum = getQuery(pageParam.size, 12);
      queryStr = createSearchParams({
        page: pageNum,
        size: sizeNum,
      }).toString();
    } else {
      queryStr = queryDefault;
    }
    setRefresh(!refresh);
    navigate({ pathname: `../memberlist`, search: queryStr });
  };
  const moveToListshop = (pageParam) => {
    // pageParam = {page: 3, size:10}
    let queryStr = '';
    if (pageParam) {
      const pageNum = getQuery(pageParam.page, 1);
      const sizeNum = getQuery(pageParam.size, 12);
      queryStr = createSearchParams({
        page: pageNum,
        size: sizeNum,
      }).toString();
    } else {
      queryStr = queryDefault;
    }
    setRefresh(!refresh);
    navigate({ pathname: `../shoplist`, search: queryStr });
  };
  // 메인 화면으로 이동
  const moveToMain = () => {
    navigate({ pathname: '/' });
  };

  // 수정/삭제로 이동
  const moveToModify = (num) => {
    navigate({ pathname: `../modify/${num}`, search: queryDefault });
  };

  // 조회(상세) 페이지 이동
  const moveToRead = (num) => {
    navigate({ pathname: `../read/${num}`, search: queryDefault });
  };

  // 점포 상세 페이지로 이동
  const moveToShop = (sid) => {
    navigate({ pathname: `../shop/detail/${sid}` });
  };

  // 점포 상세 페이지로 이동(내 프로필 보기기에서)
  const moveToShopFromMyProfile = (sid) => {
    navigate({ pathname: `/shop/detail/${sid}` });
  };

  //점포 수정 페이지로 이동
  const moveToShopModify = (shopId) => {
    navigate({ pathname: `../shop/modify/${shopId}` });
  };
  // 점포 등록 페이지로 이동
  const moveToPost = () => {
    navigate({ pathname: `../shop/add` });
  };

  const moveToModifyInfo = (email) => {
    navigate({ pathname: `../modifyInfo/${email}` });
  };

  const moveToModifyPassword = (email) => {
    navigate({ pathname: `../modifyPassword/${email}` });
  };

  // 로그인 페이지로 이동
  const moveToLogin = () => {
    navigate({ pathname: `../member/login` });
  };

  // 뒤로가기
  const moveToBack = () => {
    navigate(-1);
  };

  return {
    moveToMain,
    moveToList,
    moveToShop,
    moveToShopFromMyProfile,
    moveToPost,
    moveToModify,
    moveToShopModify,
    moveToRead,
    moveToModifyInfo,
    moveToModifyPassword,
    moveToLogin,
    moveToBack,
    moveToListmem,
    moveToListshop,
    refresh,
    page,
    size,
  };
};

export default useCustomMove;
