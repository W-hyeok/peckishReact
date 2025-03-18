import { useEffect, useState } from 'react';
import { getCookie } from '../../util/cookieUtil';
import { API_SERVER_HOST } from '../../api/todoApi';
import { getListDetail } from '../../api/roomApi';
import { Link } from 'react-router-dom';

const memberInfo = getCookie('member');
const memberEmail = memberInfo.email;

const ChatSideBarComponenet = () => {
  const [chatList, setChatList] = useState([]);
  const [image, setImage] = useState(null);

  // 페이지 로딩 시 호출되는 함수

  useEffect(() => {
    const loadChatList = async () => {
      try {
        const data = await getListDetail(memberEmail);
        // 자신의 이메일(memberEmail)을 제외하고, 상대방 데이터만 필터링
        const filteredData = data.filter((chat) => chat.email !== memberEmail);
        setChatList(filteredData);

        // 필터링된 데이터로 이미지 URL 배열 생성
        const newImages = filteredData.map(
          (chat) => `${API_SERVER_HOST}/api/member/view/${chat.photoPath}`
        );
        setImage(newImages);
        console.log('newImages', newImages);

        console.log('채팅 data', filteredData);
      } catch (error) {
        console.error('채팅 목록 불러오기 실패:', error);
      }
    };

    loadChatList();
  }, []);
  console.log('chatList: ', chatList);
  return (
    <div className="fixed top-[105px] left-0 z-10 flex flex-col w-[78px] h-[calc(100vh-65px-130px)] rounded-lg overflow-y-auto bg-[#F472B6] bg-opacity-15 shadow-sm items-center">
      {chatList.map((chat, index) => (
        <Link
          key={index}
          to={`/roomList/room/${chat.roomId}`} // room 페이지로 이동
          className="flex flex-row py-4 px-2 items-center w-full relative"
        >
          <div className="w-full">
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
        </Link>
      ))}
    </div>
  );
};

export default ChatSideBarComponenet;
