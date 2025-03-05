import React from 'react';
import AddExtraOWNERComponent from '../../components/shop/AddExtraOWNERComponent';
import { useParams } from 'react-router-dom';

const AddShopExtraOWNERPage = () => {
  const { shopId } = useParams();
  return (
    <div className="overflow-hidden bg-white/95 shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <AddExtraOWNERComponent shopId={shopId} />
      </div>
    </div>
  );
};

export default AddShopExtraOWNERPage;
