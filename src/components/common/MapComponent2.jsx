import React, { useEffect, useState } from 'react';
import { getMapList } from '../../api/mapApi';
import useCustomMove from '../../hooks/useCustomMove';
import { getCookie } from '../../util/cookieUtil';
import '../../css/scrollbar2.css';

// 영업 (준비) 중 아이콘
const statuses = {
  true: 'text-green-600 bg-green-700/10',
  false: 'text-rose-600 bg-rose-700/10',
};
// 영업 (준비) 중 아이콘 필터값
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const MapComponent2 = ({
  data,
  transFilterData,
  transCertData,
  transOpenData,
  cookieMember,
}) => {
  // const [cookieMember, setCookieMember] = useState(''); // 가게 제보/등록 구분을 위한 쿠키 정보 가져오기
  const [serverData, setServerData] = useState([]); // 서버에서 받아오는 데이터
  const [cate, setCate] = useState('all'); // 카테고리, 기본값 all('카테고리 없음')
  const [role, setRole] = useState(0); // user: 1(true), owner: 2(false), 기본값 0 ('구분 없음')
  const [open, setOpen] = useState(0); // true: 1, 기본값: 0(준비중 포함)
  const { moveToShop, moveToPost, moveToLogin } = useCustomMove();

  // 경로에서 받은 shopId
  const clickList = (shopId) => {
    console.log('목록 클릭: ', shopId);
    // 커스텀 훅: 상세 페이지로 이동
    moveToShop(shopId);
  };

  // 지도 api 객체
  // const geocoder = new kakao.maps.services.Geocoder();

  // 게시글 목록 가져오기
  useEffect(() => {
    getMapList(transFilterData, transCertData, transOpenData).then((data) => {
      setCate(transFilterData); // 카테고리 값 설정
      setRole(transCertData); // 구분(제보/인증) 값 설정
      setOpen(transOpenData); // 영업값
      setServerData(data);
    });
  }, [transFilterData, cate, role, transCertData, open, transOpenData]);

  return (
    // 페이지네이션 → 전체 불러오기, overflow-auto로 대체 (유사 무한스크롤)
    // max-h/w-screen: 높이 및 너비 화면 크기로 설정
    <div
      className="bg-yellow-100/30 pt-3 max-w-screen scrollbar2"
      style={{ height: '75vh' }}
    >
      <div className="flex justify-end mx-12">
        <a
          className="text-white mb-2 rounded-md px-3 py-2 text-sm text-center font-black flex-auto bg-yellow-950"
          onClick={cookieMember ? moveToPost : moveToLogin}
        >
          {cookieMember
            ? '가게 제보/등록하기'
            : '가게 제보/등록하기 (로그인 필요)'}
        </a>
      </div>
      {serverData.length != 0 ? (
        <table className="mt-1 w-full whitespace-nowrap text-left">
          <colgroup>
            <col className="w-full sm:w-2/12" />
            <col className="lg:w-2/12" />
            <col className="lg:w-2/12" />
            <col className="lg:w-2/12" />
          </colgroup>
          <thead className="border-b-0 border-white/10 text-sm/6 text-black">
            <tr>
              <th
                scope="col"
                className="py-2 pl-4 pr-8 font-extrabold sm:pl-6 lg:pl-8"
              >
                제목
              </th>
              <th
                scope="col"
                className="hidden py-2 pl-0 pr-8 font-extrabold sm:table-cell"
              >
                위치
              </th>
              <th
                scope="col"
                className="py-2 pl-0 pr-4 text-right font-extrabold sm:pr-8 sm:text-left"
              >
                카테고리
              </th>
              <th
                scope="col"
                className="hidden py-2 pl-4 pr-4 font-extrabold md:table-cell"
              >
                영업상태
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {serverData.map((data, index) => (
              <tr key={index}>
                {/* 제목 */}
                <td
                  className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8"
                  onClick={() => {
                    clickList(data.shopId);
                  }}
                >
                  <div className="flex items-center gap-x-4">
                    <div className="text-sm/6">
                      <div
                        style={{
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          width: '120px',
                        }}
                      >
                        {data.title}
                      </div>
                    </div>
                  </div>
                </td>
                {/* 위치 */}
                <td className="hidden py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
                  <div className="flex gap-x-2">
                    <div className="text-sm/5 text-black">
                      <div
                        style={{
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          width: '140px',
                        }}
                      >
                        {data.location}
                      </div>
                    </div>
                  </div>
                </td>
                {/* 카테고리 */}
                <td className="hidden py-4 pl-0 text-sm/6 text-black sm:table-cell">
                  {
                    data.category === 'bread'
                      ? '붕어빵'
                      : data.category === 'snack'
                        ? '분식'
                        : data.category === 'hotteok'
                          ? '호떡'
                          : data.category === 'sweetPotato'
                            ? '군고구마'
                            : data.category // 조건에 맞지 않으면 원래 값 출력
                  }
                </td>
                {/* 영업 상태 */}
                <td className="py-4 pl-5 text-sm/6 sm:pr-4">
                  <div className="flex items-center justify-end gap-x-2 sm:justify-center">
                    {/* <div
                    className={classNames(
                      statuses[data.open],
                      'flex-none rounded-full p-1'
                    )}
                  >
                    <div className="size-1.5 rounded-full bg-current" />
                  </div> */}
                    {data.open === true ? (
                      <div className="font-extrabold text-green-500">
                        영업 중
                      </div>
                    ) : (
                      <div className="text-gray-400">준비 중</div>
                    )}
                    <div className="hidden text-black sm:block"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="flex mt-10">
          <img
            className="m-auto w-1/2 h-1/2"
            src="../src/assets/icon/noResult.png"
            sizes=""
          />
        </div>
      )}
    </div>
  );
};

export default MapComponent2;
