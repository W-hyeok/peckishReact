import { useEffect, useState } from 'react';
import { getCookie } from '../../util/cookieUtil';
import { API_SERVER_HOST } from '../../api/todoApi';
import { getListDetail } from '../../api/roomApi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChatSideBarComponent = ({ socket, resetUnreadTrigger }) => {
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

  return (
    <div className="fixed top-[105px] left-0 z-10 flex flex-col w-[78px] h-[calc(100vh-65px-130px)] rounded-lg overflow-y-auto bg-[#F472B6] bg-opacity-15 shadow-sm items-center">
      {chatList.map((chat, index) => (
        <div
          key={index}
          onClick={() => handleRoomClick(chat.roomId)}
          className="flex flex-row py-4 px-2 items-center w-full relative cursor-pointer"
        >
          <div className="w-full relative">
            <img
              src={chat.profileImage}
              className="h-[44px] w-[40px] rounded-full ring-4 ring-blue-400 m-1 p-1"
              alt="member Avatar"
            />
            {chat.unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                {chat.unreadCount}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatSideBarComponent;
