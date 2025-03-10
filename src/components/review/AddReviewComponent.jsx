import React, { useEffect } from 'react';
import ResultModal from '../common/ResultModal';
import useCustomMove from '../../hooks/useCustomMove';
import { postReview } from '../../api/reviewApi';
import { getOne } from '../../api/shopApi';
import { useState } from 'react';
import { getCookie } from '../../util/cookieUtil';
import AddReviewModal from '../common/AddReviewModal';

const initState = {
  content: '',
};

const AddReviewComponent = () => {
  <AddReviewModal />;
};
export default AddReviewComponent;
