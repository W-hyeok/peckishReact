import { useEffect, useState } from 'react';
import { getCookie } from '../../util/cookieUtil';
import { API_SERVER_HOST } from '../../api/todoApi';
import { getListDetail } from '../../api/roomApi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChatSideBarComponent = () => {
  const memberInfo = getCookie('member');
  const memberEmail = memberInfo.email;

  const [chatList, setChatList] = useState([]);
  const [image, setImage] = useState([]);

  const navigate = useNavigate();

  const markAsRead = async (roomId) => {
    try {
      await axios.put(
        `${API_SERVER_HOST}/chat/room/markAsRead/${roomId}?email=${memberEmail}`
      );
      console.log('Messages marked as read');
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
    }
  };

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

  useEffect(() => {
    const loadChatList = async () => {
      try {
        const data = await getListDetail(memberEmail);
        setChatList(data);

        // 각 대화 상대의 프로필 이미지 URL 생성
        const newImages = data.map(
          (chat) => `${API_SERVER_HOST}/api/member/view/${chat.photoPath}`
        );
        setImage(newImages);
      } catch (error) {
        console.error('Failed to load chat list:', error);
      }
    };

    loadChatList();
  }, [memberEmail]);

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
              src={image[index]}
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
