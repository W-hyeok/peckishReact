import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getListOwner } from '../../api/roomApi';
import { getCookie } from '../../util/cookieUtil';
import BasicLayout from '../../layouts/BasicLayout';
import { API_SERVER_HOST } from '../../api/todoApi';
import axios from 'axios';
import { WS_SERVER_HOST } from '../../components/chat/RoomComponent';

import '../../css/common.css';

const RoomList = () => {
  const memberInfo = getCookie('member');
  const memberEmail = memberInfo ? memberInfo.email : '';

  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        if (!memberEmail) return;
        // getListOwner 호출로 사장님이 참여한 방 목록을 가져옴
        const data = await getListOwner(memberEmail);
        const updatedData = data.map((room) => ({
          ...room,
          unreadCount: 0,
          profileImage: `${API_SERVER_HOST}/api/member/view/${room.photoPath}`,
        }));
        setRooms(updatedData);
        console.log('응답데이터: ', data);
      } catch (error) {
        console.error('응답데이터 Error', error);
      }
    };

    fetchRooms();
  }, [memberEmail]);

  const markAsRead = async (roomId) => {
    try {
      await axios.put(
        `${API_SERVER_HOST}/chat/room/markAsRead/${roomId}?email=${memberEmail}`
      );
      console.log('채팅방 메시지 읽음 처리 성공');
    } catch (error) {
      console.error('채팅방 내 메시지 읽음 처리 실패', error);
    }
  };

  const handleRoomClick = async (roomId) => {
    // 로컬 상태 업데이트: 해당 방의 unreadCount를 0으로 설정
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.room_ID === roomId ? { ...room, unreadCount: 0 } : room
      )
    );

    // 서버에 읽음 처리 API 호출
    await markAsRead(roomId);

    // 해당 방으로 이동
    navigate(`/roomList/room/${roomId}`);
  };

  // WebSocket을 통한 실시간 unread 업데이트 처리 및 최신 메시지 업데이트
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const wsUrl = `${protocol}://${WS_SERVER_HOST}/ws/chat`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('[Room] WebSocket 연결 성공');
      // 필요한 경우 인증 정보나 구독 메시지를 전송할 수 있음
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // 백엔드에서 unreadUpdate 타입으로 unreadCount와 최신 메시지(latestContent) 업데이트 메시지
        if (data.type === 'unreadUpdate') {
          const { roomId, unreadCount, latestContent } = data;
          setRooms((prevRooms) =>
            prevRooms.map((room) =>
              room.room_ID === roomId
                ? { ...room, unreadCount, content: latestContent }
                : room
            )
          );
        }
      } catch (error) {
        console.error('[Room] WebSocket 메시지 처리 오류:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('[Room] WebSocket 에러:', error);
    };

    ws.onclose = () => {
      console.log('[Room] WebSocket 연결 종료');
    };

    return () => {
      ws.close();
    };
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  console.log('RoomList 데이터 확인:', rooms);

  return (
    <BasicLayout>
      <div className="overflow-y-auto">
        <main className="flex-col justify-center">
          {/* 홈으로 가는 버튼을 헤더와 채팅방 리스트 사이에 가운데 정렬 */}
          <div className="flex justify-end my-4 mt-20 col-span-full divide-y w-1/2 mx-auto">
            <Link to="/" className="defaultBtn">
              홈으로
            </Link>
          </div>
          <div className="container mx-auto"></div>
          {rooms.length === 0 ? (
            // 채팅방이 없는 경우 문구 출력
            <div className="flex flex-col items-center justify-center h-full py-20">
              <div className="bg-white shadow-md rounded-lg p-8">
                <p className="text-center text-2xl font-semibold text-gray-600">
                  문의 내역이 없습니다.
                </p>
              </div>
            </div>
          ) : (
            // 채팅방이 존재하면 원래 로직대로 목록 출력
            <ul className="col-span-full divide-y divide-gray-200 dark:divide-gray-700 overflow-y-auto overflow-x-hidden border border-gray-300 dark:border-gray-600 rounded-lg mt-5 w-1/2 mx-auto">
              {rooms.map((room, index) => (
                <li
                  key={`${room.room_ID}-${index}`}
                  onClick={() => handleRoomClick(room.room_ID)}
                  className="bg-white hover:bg-gray-200 p-5 lg:p-5 sm:p-3"
                >
                  <Link to={`/roomList/room/${room.room_ID}`}>
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                      <div className="flex flex-shrink-0 -space-x-4 rtl:space-x-reverse">
                        <img
                          className="w-8 h-8 rounded-full"
                          src={room.profileImage}
                          alt="profileImage"
                        />
                      </div>
                      <div className="flex-1 min-w-0 text-center">
                        <p className="text-xl font-bold text-[#422006] truncate inline-flex items-center">
                          {room.userNickname}
                        </p>
                        <p className="text-sm text-gray-400 truncate">
                          {room.content}
                        </p>
                      </div>
                      <div className="inline-flex w-8 h-8 items-center text-base font-semibold text-gray-700 dark:text-white"></div>
                      {room.unreadCount > 0 && (
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                            {room.unreadCount}
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>
    </BasicLayout>
  );
};

export default RoomList;
