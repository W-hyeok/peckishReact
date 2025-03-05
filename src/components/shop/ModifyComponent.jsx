import React from 'react';
import ModifyUserComponent from './ModifyUserComponent';
import ModifyOwnerComponent from './ModifyOwnerComponent';

//const ModifyComponent = (props) => {
//const shop = props.shop;
//const shopId = props.shopId;
//const infoType = props.infoType;

const ModifyComponent = ({ shop, shopId, shopDetailId, infoType }) => {
  // infoType에 따라 USER, OWNER 페이지 분기처리
  console.log('shop', shop); // 못 찍음
  console.log('shopID', shopId);
  console.log('shopDetailId ', shopDetailId);
  console.log('infoType', infoType);

  return (
    <div>
      {infoType == 'USER' ? (
        <ModifyUserComponent
          shop={shop}
          shopId={shopId}
          infoType={infoType}
          shopDetailId={shopDetailId}
        />
      ) : (
        // infoType == 'OWNER'
        <ModifyOwnerComponent
          shop={shop}
          shopId={shopId}
          infoType={infoType}
          shopDetailId={shopDetailId}
        />
      )}
    </div>
  );
};

export default ModifyComponent;
