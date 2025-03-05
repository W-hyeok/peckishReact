import { useParams } from 'react-router-dom';
import DetailComponent from '../../components/shop/DetailComponent';
import { useEffect, useState } from 'react';
import { getOneMoon } from '../../api/memberApi';
import FetchModal from '../../components/common/FetchModal';
import useCustomLogin from '../../hooks/useCustomLogin';
import ResultModal from '../../components/common/ResultModal';

// shop state 초기화 객체
const initState = {
  //back 에서 넘어오는 데이터(dto) 구조와 동일하게
  shopDTO: null,
  shopOwnerDTO: null,
  menuOwnerList: [],
  shopUserDTO: null,
  menuUserList: [],
};

const DetailPageMoon = () => {
  const { email } = useParams();
  const { moveToPath } = useCustomLogin();

  const [shop, setShop] = useState(null); // by Moon
  const [shopId, setShopId] = useState(0);
  const [fetch, setFetch] = useState(true); // 로딩중 모달 on/off
  const [loaded, setLoaded] = useState(true);

  const closeModal = () => {
    moveToPath('/');
  };

  useEffect(() => {
    setFetch(true); // 로딩중
    getOneMoon(email).then((data) => {
      console.log(data.RESULT);
      if (data.RESULT.shopDTO != null) {
        setShop({ ...data.RESULT });
        setShopId(data.RESULT.shopDTO.shopId); // by Moon
        console.log(data.RESULT.shopDTO.shopId);
      }
      setFetch(false); // 로딩X -> Fetch 모달 닫히게
      setLoaded(false); // 로딩 완료!!!
    });
  }, [email]);

  return (
    <div>
      {/* <Tmp /> */}
      {/* component에서 받을 props 이름  = { router 값} */}
      {fetch ? <FetchModal /> : <></>}
      {shop ? (
        loaded ? (
          <></>
        ) : (
          <DetailComponent shop={shop} shopId={shopId} />
        )
      ) : (
        <ResultModal
          title={'점포 관리 이상'}
          content={`관리할 점포가 아직 없습니다`}
          callbackFn={closeModal}
        />
      )}
    </div>
  );
};

export default DetailPageMoon;
