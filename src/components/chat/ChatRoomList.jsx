import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ChatRoomList = ({ onSelectRoom }) => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axios.get('/api/chat/rooms');
      const roomsWithUnread = await Promise.all(
        res.data.map(async (room) => {
          // 관리자가 확인할 때, 고객이 보낸 메시지 중 안읽은 개수를 조회 (CUSTOMER 전달)
          const unreadRes = await axios.get(
            `/api/chat/rooms/${room.id}/unreadCount`,
            {
              params: { sender: 'CUSTOMER' },
            }
          );
          return { ...room, unreadCount: unreadRes.data };
        })
      );
      setRooms(roomsWithUnread);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="chat-room-list">
      <h2>채팅방 리스트</h2>
      <ul>
        {rooms.map((room) => (
          <li key={room.id} onClick={() => onSelectRoom(room)}>
            고객ID: {room.customerId}
            {room.unreadCount > 0 && (
              <span className="unread-indicator">
                {' '}
                ({room.unreadCount} 읽지 않음)
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatRoomList;
