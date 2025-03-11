import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMsgs } from '../../api/roomApi';
import RoomComponent from '../../components/chat/RoomComponent';

const RoomPage = () => {
  const { room_ID } = useParams(); // URL에서 room_ID를 읽음
  const [msgs, setMsgs] = useState([]);
  console.log('URL ROOM_ID' + room_ID);
  useEffect(() => {
    const fetchMsgs = async () => {
      try {
        const data = await getMsgs(room_ID);
        setMsgs(data);
      } catch (error) {
        console.error(error);
      }
    };

    if (room_ID) {
      fetchMsgs();
    }
  }, [room_ID]);

  return (
    <div key={room_ID}>
      {' '}
      {/* 동적 키 설정 */}
      <h2>Room ID: {room_ID}</h2>
      <RoomComponent room_ID={room_ID} msgs={msgs} />
    </div>
  );
};

export default RoomPage;
