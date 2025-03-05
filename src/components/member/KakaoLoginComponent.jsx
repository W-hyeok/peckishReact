import { Link } from 'react-router-dom';
import { getKakaoLoginLink } from '../../api/kakaoApi';
import kakaoLogin from '../../assets/kakao_login_medium_wide.png';

const KakaoLoginComponent = () => {
  const link = getKakaoLoginLink();

  return (
    <div>
      <div className="relative mt-10">
        <div aria-hidden="true" className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm/6 font-medium">
          <span className="bg-white px-6 text-gray-900">
            소셜 로그인으로 진행
          </span>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center">
        <Link
          to={link}
          className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900  hover:bg-gray-50 focus-visible:ring-transparent"
        >
          <img src={kakaoLogin} />
        </Link>
        <span className="text-sm/6 font-medium bg-white px-6 text-gray-900">
          로그인 시, 자동 가입 처리 됩니다.
        </span>
      </div>
    </div>
  );
};

export default KakaoLoginComponent;
