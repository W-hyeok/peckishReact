import React, { useEffect } from 'react';
import { getCookie } from '../util/cookieUtil';
import { Navigate } from 'react-router-dom';

const loginRequiredRouter = ({ children }) => {
  const cookieMember = getCookie('member');
  // useEffect(() => {
  //   if (!cookieMember) {
  //     alert(`잘못된 요청입니다. 초기 화면으로 이동합니다.`);
  //   }
  // }, [cookieMember]);
  return cookieMember ? children : <Navigate to="/badRequest" replace />;
};

export default loginRequiredRouter;
