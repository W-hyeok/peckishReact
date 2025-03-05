import React from 'react';
import AddExtraUSERComponent from '../../components/shop/AddExtraUSERComponent';
import { useParams } from 'react-router-dom';

const AddShopExtraUSERPage = () => {
  // router 경로에서 shopId 가져옴
  const { shopId } = useParams();
  console.log('USERPage : ', shopId);

  return (
    <div className="overflow-hidden bg-white/95 shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <AddExtraUSERComponent shopId={shopId} />
      </div>
    </div>
  );
};

export default AddShopExtraUSERPage;
