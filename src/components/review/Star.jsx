import React, { useState } from 'react';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';

const Star = ({ rating, onRatingChange }) => {
  const ARRAY = [0, 1, 2, 3, 4]; // 5개의 별

  const [hover, setHover] = useState(0); // 마우스 호버 상태

  // 별 클릭 시 부모 컴포넌트로 변경된 별점 전달
  const handleClick = (value) => {
    onRatingChange(value); // 부모로 변경된 별점 전달
  };

  // 마우스 움직임에 따른 별점
  // 0.5점 별점 구현
  const handleMouseMove = (event, index) => {
    // event: 마우스 이벤트, index: 별의 인덱스 (0부터 4까지)
    const { clientX, target } = event; // clientX는 마우스의 x좌표, target은 해당 별 요소
    const targetRect = target.getBoundingClientRect(); // target(별)의 좌측 상단과 우측 하단 좌표를 반환
    const isHalf = clientX - targetRect.left < targetRect.width / 2; // 마우스가 별의 왼쪽 절반에 있으면 true
    setHover(isHalf ? index + 0.5 : index + 1); // 왼쪽 절반일 경우 0.5, 아니면 1을 추가
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      {' '}
      {/* 별점과 점수 사이 간격 설정 */}
      <div style={{ display: 'flex', gap: '2px' }}>
        {ARRAY.map((el, index) => (
          <span
            key={index}
            style={{
              cursor: 'pointer',
              fontSize: '24px',
              display: 'flex',
              alignItems: 'center',
            }}
            onMouseMove={(event) => handleMouseMove(event, index)}
            onMouseLeave={() => setHover(0)}
            onClick={() => handleClick(hover || rating)} // 클릭 시 변경된 별점 전달
          >
            {hover > index || rating > index ? (
              hover >= index + 1 || rating >= index + 1 ? (
                <FaStar color="gold" />
              ) : (
                <FaStarHalfAlt color="gold" />
              )
            ) : (
              <FaStar color="gray" />
            )}
          </span>
        ))}
      </div>
      {/* 별점 합계 표시 */}
      <span
        style={{
          fontSize: '16px',
          color: '#333',
          letterSpacing: '0.5px',
        }}
      >
        {rating} / 5
      </span>
    </div>
  );
};

export default Star;
