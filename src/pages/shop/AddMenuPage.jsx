import React from 'react';
import AddMenuComponent from '../../components/shop/AddMenuComponent';
import { useNavigate, useParams } from 'react-router-dom';

const AddMenuPage = () => {
  const navigate = useNavigate();
  const { shopId, shopDetailId, infoType } = useParams();
  if (infoType !== 'USER' && infoType !== 'OWNER') {
    navigate('/');
  }
  return (
    <div px-4 py-5 sm:p-6>
      <AddMenuComponent
        shopId={shopId}
        shopDetailId={shopDetailId}
        infoType={infoType}
      />
    </div>
  );
};

export default AddMenuPage;
