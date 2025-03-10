import React, { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';
import { getOne } from '../../api/shopApi';
import AddReviewComponent from '../../components/review/addReviewComponent';

const AddReviewPage = () => {
  const { shopId } = useParams();
  const { shopDetailId } = useParams();
  const { infoType } = useParams();

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <AddReviewComponent
          shopId={shopId}
          shopDetailId={shopDetailId}
          infoType={infoType}
        />
      </div>
    </div>
  );
};

export default AddReviewPage;
