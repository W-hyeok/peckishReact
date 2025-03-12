import { StarIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import { getReview } from '../../api/reviewApi';

const DetailOwnerReviewComponent = ({
  shopId,
  shopDetailId,
  infoType,
  handleClickReview,
}) => {
  // 리뷰 목록 뿌려주기
  const [reviews, setReviews] = useState([]);
  const [fetch, setFetch] = useState(false);
  const [refresh, setRefresh] = useState(false);

  // 리뷰 목록 조회
  useEffect(() => {
    getReview(shopId, shopDetailId, infoType).then((data) => {
      setFetch(false);
      console.log('리뷰 조회');
      console.log(date.RESULT);
      setReviews(data.RESULT);
      setFetch(true);
    });
  }, [shopId, infoType, refresh]);

  // 리뷰 수정

  // 리뷰 삭제

  return (
    <>
      <h3 className="sr-only">Customer Reviews</h3>
      {reviews.map((review, index) => (
        <div
          key={index}
          className={classNames(
            index !== 0 ? 'border-t border-gray-300' : '',
            'flex space-x-4 text-sm text-gray-700 py-6'
          )}
        >
          <div className="flex-none">
            <img
              alt=""
              src={review.avatarSrc}
              className="size-12 rounded-full bg-gray-100 shadow-md"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{review.author}</h3>
            <p className="text-xs text-gray-500">
              <time dateTime={review.datetime}>{review.date}</time>
            </p>

            <div className="mt-3 flex items-center">
              {[0, 1, 2, 3, 4].map((rating) => (
                <StarIcon
                  key={rating}
                  aria-hidden="true"
                  className={classNames(
                    review.rating > rating
                      ? 'text-yellow-400'
                      : 'text-gray-300',
                    'size-5 shrink-0'
                  )}
                />
              ))}
            </div>

            <p className="sr-only">{review.rating} out of 5 stars</p>

            <div
              dangerouslySetInnerHTML={{ __html: review.content }}
              className="mt-3 text-sm text-gray-700 leading-relaxed break-words"
            />
          </div>
        </div>
      ))}

      {/* 리뷰 작성 버튼 (기존처럼 가운데 하단 유지) */}
      <div className="flex justify-center mt-6">
        <button
          type="button"
          onClick={handleClickReview}
          className="inline-flex items-center justify-center rounded-md border border-transparent bg-yellow-500 px-8 py-3 text-base font-medium text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-700 focus:ring-offset-2 focus:ring-offset-gray-50 transition-all duration-300"
        >
          리뷰 작성
        </button>
      </div>
    </>
  );
};

export default DetailOwnerReviewComponent;
