import { useEffect, useState } from 'react';
import { getCookie } from '../../util/cookieUtil';
import { API_SERVER_HOST } from '../../api/todoApi';
import { getListDetail } from '../../api/roomApi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChatSideBarComponent = ({ socket, resetUnreadTrigger, activeRoomId }) => {
  const memberInfo = getCookie('member');
  const memberEmail = memberInfo.email;

  const [chatList, setChatList] = useState([]);

  const navigate = useNavigate();

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

  // 클릭 시 안읽은 메시지 0 처리
  const handleRoomClick = async (roomId) => {
    // 로컬 상태 업데이트: 해당 방의 unreadCount를 0으로 설정
    setChatList((prevChatList) =>
      prevChatList.map((chat) =>
        chat.roomId === roomId ? { ...chat, unreadCount: 0 } : chat
      )
    );

    // 메시지 상태를 서버에 업데이트
    await markAsRead(roomId);

    // 해당 방으로 이동
    navigate(`/roomList/room/${roomId}`);
  };

  // 로컬에서 보여주는 안읽은 메시지 처리
  useEffect(() => {
    const loadChatList = async () => {
      try {
        const data = await getListDetail(memberEmail);
        // 먼저 모든 채팅방에 대해 읽음 처리 API 호출
        await Promise.all(data.map((chat) => markAsRead(chat.roomId)));
        // 그리고 클라이언트 상태에서도 unreadCount를 0으로 설정
        const updatedData = data.map((chat) => ({
          ...chat,
          unreadCount: 0,
          profileImage: `${API_SERVER_HOST}/api/member/view/${chat.photoPath}`,
        }));
        setChatList(updatedData);

        // 각 대화 상대의 프로필 이미지 URL 생성
        // const newImages = data.map(
        //   (chat) => `${API_SERVER_HOST}/api/member/view/${chat.photoPath}`
        // );
        // setImage(newImages);
      } catch (error) {
        console.error('Failed to load chat list:', error);
      }
    };

    loadChatList();
  }, [memberEmail]);

  // RoomComponent에서 전달받은 소켓을 통해 unreadUpdate 이벤트 처리
  useEffect(() => {
    if (!socket) return;
    const handleSocketMessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'unreadUpdate') {
          const { roomId, unreadCount } = data;
          setChatList((prevChatList) =>
            prevChatList.map((chat) =>
              chat.roomId === roomId ? { ...chat, unreadCount } : chat
            )
          );
        }
      } catch (error) {
        console.error('[ChatSideBar] WebSocket 메시지 처리 오류:', error);
      }
    };

    socket.addEventListener('message', handleSocketMessage);
    return () => {
      socket.removeEventListener('message', handleSocketMessage);
    };
  }, [socket]);

  // resetUnreadTrigger prop 변경 시 로컬 unreadCount를 0으로 리셋
  useEffect(() => {
    setChatList((prevChatList) =>
      prevChatList.map((chat) => ({ ...chat, unreadCount: 0 }))
    );
  }, [resetUnreadTrigger]);

  console.log('activeRoomId: ', activeRoomId);

  return (
    <nav>
      <ul role="list" className="space-y-2">
        {chatList.map((chat, index) => (
          <li key={index}>
            <button
              onClick={() => handleRoomClick(chat.roomId)}
              className="flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              <img
                src={chat.profileImage}
                alt="member Avatar"
                className={`h-8 w-8 rounded-full ${activeRoomId === activeRoomId.email ? 'ring-4 ring-blue-600' : 'ring-2 ring-gray-300'}`}
              />
              {chat.unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                  {chat.unreadCount}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default ChatSideBarComponent;
