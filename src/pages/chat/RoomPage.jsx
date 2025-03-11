import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMsgs } from '../../api/roomApi';
import RoomComponent from '../../components/chat/RoomComponent';
import BasicLayout from '../../layouts/BasicLayout';

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
    <BasicLayout>
      <div key={room_ID}>
        {/* 동적 키 설정 */}
        <RoomComponent room_ID={room_ID} msgs={msgs} />
      </div>
    </BasicLayout>
  );
};

export default RoomPage;
