import { useParams } from 'react-router-dom';
import DetailComponent from '../../components/shop/DetailComponent';
import { useEffect, useState } from 'react';
import { getOne } from '../../api/shopApi';
import FetchModal from '../../components/common/FetchModal';

// shop state 초기화 객체
const initState = {
  //back 에서 넘어오는 데이터(dto) 구조와 동일하게
  shopDTO: null,
  shopOwnerDTO: null,
  menuOwnerList: [],
  shopUserDTO: null,
  menuUserList: [],
};

const DetailPage = () => {
  // router에 지정한 주소 값 -> 주소값에서 shopId 뽑아서 DB데이터 불러오기
  const { shopId } = useParams();

  const [shop, setShop] = useState();
  const [fetch, setFetch] = useState(true); // 로딩중 모달 on/off
  const [loaded, setLoaded] = useState(true);

  useEffect(() => {
    setFetch(true); // 로딩중
    getOne(shopId).then((data) => {
      console.log(data.RESULT);
      setShop({ ...data.RESULT });
      setFetch(false); // 로딩X -> Fetch 모달 닫히게
      setLoaded(false); // 로딩 완료!!!
    });
  }, [shopId]); //shopId가 바뀔 때마다 리렌더링

  return (
    <div>
      {/* <Tmp /> */}
      {/* component에서 받을 props 이름  = { router 값} */}
      {fetch ? <FetchModal /> : <></>}
      {loaded ? <></> : <DetailComponent shop={shop} shopId={shopId} />}
    </div>
  );
};

export default DetailPage;
