import { useEffect, useState } from 'react';
import { getCookie } from '../../util/cookieUtil';
import { API_SERVER_HOST } from '../../api/todoApi';
import { getListDetail } from '../../api/roomApi';
import { Link } from 'react-router-dom';

const memberInfo = getCookie('member');
const memberEmail = memberInfo.email;

const ChatSideBarComponenet = () => {
  const [chatList, setChatList] = useState([]);

  useEffect(() => {
    const loadChatList = async () => {
      try {
        const data = await getListDetail(memberEmail);
        setChatList(data);
        console.log('채팅 data', data);
      } catch (error) {
        console.error('채팅 목록 불러오기 실패:', error);
      }
    };

    loadChatList();
  }, []); // 컴포넌트가 처음 렌더링될 때만 실행
  console.log(chatList);
  return (
    <div className="fixed top-[65px] left-0 z-30 flex flex-col w-[78px] h-[78%] rounded-lg overflow-y-auto bg-sky-100 shadow-sm items-center">
      {chatList.map((chat, index) => (
        <Link
          key={index}
          to={`/roomList/room/${chat.roomId}`} // room 페이지로 이동
          className="flex flex-row py-4 px-2 items-center w-full"
        >
          <div className="w-full">
            <img
              src={`${API_SERVER_HOST}/member/view/${chat.photoPath}`}
              className="h-[44px] w-[40px] rounded-full ring-4 ring-blue-400 m-1 p-1"
              alt="member Avatar"
            />
            {chat.unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                {chat.unreadCount}
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ChatSideBarComponenet;
