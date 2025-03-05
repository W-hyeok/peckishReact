import { useParams } from 'react-router-dom';
import ModifyComponent from '../../components/shop/ModifyComponent';
import { useEffect, useState } from 'react';
import { getOne } from '../../api/shopApi';

const initState = {
  shopDTO: null,
  shopOwnerDTO: null,
  menuOwnerList: [],
  shopUserDTO: null,
  menuUserList: [],
};

const ModifyPage = () => {
  // useParam() 으로 주소에서 shopId, infoType 꺼내기
  const { shopId, infoType, shopDetailId } = useParams();

  console.log('shopId', shopId);
  console.log('infoType', infoType);
  console.log('shopDetailId :', shopDetailId);

  const [shop, setShop] = useState();
  const [loaded, setLoaded] = useState(true); //로딩시간

  // useEffect() 에서 shop 정보다 가져오기 -> useState shop만들어 담기
  useEffect(() => {
    getOne(shopId).then((data) => {
      console.log(data.RESULT);
      setShop({ ...data.RESULT }); //DB정보 가져와 넣기
      setLoaded(false);
    });
  }, [shopId]);

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        {shop ? (
          <ModifyComponent
            shop={shop}
            shopId={shopId}
            infoType={infoType}
            shopDetailId={shopDetailId}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default ModifyPage;
