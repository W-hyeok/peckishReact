import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getListOwner } from '../../api/roomApi';
import { getCookie } from '../../util/cookieUtil';
import BasicLayout from '../../layouts/BasicLayout';

const memberInfo = getCookie('member');
const useremail = memberInfo ? memberInfo.email : ''; // userName을 useEffect 바깥에서 선언
const RoomList = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        if (!useremail) return;
        const data = await getListOwner(useremail);
        setRooms(data);
        console.log('응답데이터: ', data);
        console.log('ownerEmail:', useremail);
      } catch (error) {
        console.error('에러ㅠㅠ', error);
      }
    };

    fetchRooms();
  }, [useremail]);

  console.log(rooms);
  return (
    <BasicLayout>
      <div className="bg-[#f9dfb1] overflow-y-auto">
        <main>
          <div className="container mx-auto"></div>
          <ul className="col-span-full divide-y divide-gray-200 dark:divide-gray-700 overflow-y-auto overflow-x-hidden border border-gray-300 dark:border-gray-600 rounded-lg mt-5 w-1/2 mx-auto">
            {rooms.map((room) => (
              <li
                key={room.room_ID}
                className="hover:bg-gray-200 p-5 lg:p-5 sm:p-3"
              >
                <Link to={`/roomList/room/${room.room_ID}`}>
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="flex flex-shrink-0 -space-x-4 rtl:space-x-reverse">
                      <img
                        className="w-8 h-8 rounded-full"
                        src="https://plus.unsplash.com/premium_photo-1730828573938-003e14f210f4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Neil image"
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
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </main>
      </div>
    </BasicLayout>
  );
};

export default RoomList;
