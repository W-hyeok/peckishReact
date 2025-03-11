import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getList } from '../../api/roomApi';
import { getCookie } from '../../util/cookieUtil';

const memberInfo = getCookie('member');
const useremail = memberInfo ? memberInfo.email : ''; // userName을 useEffect 바깥에서 선언
const RoomList = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        if (!useremail) return;
        const data = await getList(useremail);
        setRooms(data);
      } catch (error) {
        console.error('에러ㅠㅠ', error);
      }
    };

    fetchRooms();
  }, [useremail]);

  console.log(rooms);
  return (
    <div className="bg-white overflow-y-auto">
      <main>
        <div className="container mx-auto"></div>
        <ul className="col-span-full divide-y divide-gray-200 dark:divide-gray-700 overflow-y-auto overflow-x-hidden pb-[10px] border border-gray-300 dark:border-gray-600 rounded-lg mt-5 w-4/5 mx-auto">
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
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white inline-flex items-center">
                      {room.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                      {room.content}
                    </p>
                  </div>
                  <div className="inline-flex w-8 h-8 items-center text-base font-semibold text-gray-700 dark:text-white">
                    {/* <div className="absolute inline-flex items-center justify-center w-8 h-8 text-xs font-bold text-white bg-blue-500 border-2 border-white rounded-full dark:border-blue-900">
                      8
                    </div> */}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default RoomList;
