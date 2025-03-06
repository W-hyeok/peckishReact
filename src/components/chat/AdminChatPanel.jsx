import React, { useState } from 'react';
import ChatRoomList from './ChatRoomList';
import ChatRoom from './ChatRoom';

const AdminChatPanel = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);

  return (
    <div className="admin-chat-panel" style={{ display: 'flex' }}>
      <div
        style={{ width: '30%', borderRight: '1px solid #ccc', padding: '10px' }}
      >
        <ChatRoomList onSelectRoom={(room) => setSelectedRoom(room)} />
      </div>
      <div style={{ width: '70%', padding: '10px' }}>
        {selectedRoom ? (
          <ChatRoom room={selectedRoom} />
        ) : (
          <div>채팅방을 선택해주세요.</div>
        )}
      </div>
    </div>
  );
};

export default AdminChatPanel;
