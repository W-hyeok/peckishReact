import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import axios from 'axios';

const ChatRoom = ({ room }) => {
  const [messages, setMessages] = useState([]);
  const [client, setClient] = useState(null);
  const [input, setInput] = useState('');

  useEffect(() => {
    fetchMessages();
    markAsRead();

    const sockJS = new SockJS('http://localhost:8080/ws-chat');
    const stompClient = new Client({
      webSocketFactory: () => sockJS,
      reconnectDelay: 5000,
      onConnect: () => {
        stompClient.subscribe(`/topic/chat/${room.id}`, (message) => {
          const msg = JSON.parse(message.body);
          setMessages((prev) => [...prev, msg]);
        });
      },
    });
    stompClient.activate();
    setClient(stompClient);

    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, [room]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`/api/chat/rooms/${room.id}/messages`);
      setMessages(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const markAsRead = async () => {
    try {
      // 관리자로 채팅방에 입장 시 읽음 처리 (reader=ADMIN)
      await axios.post(`/api/chat/rooms/${room.id}/markAsRead`, null, {
        params: { reader: 'ADMIN' },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const sendMessage = () => {
    if (client) {
      const chatMessage = {
        chatRoomId: room.id,
        sender: 'ADMIN',
        content: input,
      };
      client.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify(chatMessage),
      });
      setInput('');
    }
  };

  return (
    <div className="chat-room">
      <h3>채팅방 (고객: {room.customerId})</h3>
      <div
        className="messages"
        style={{
          border: '1px solid #ccc',
          padding: '10px',
          height: '300px',
          overflowY: 'scroll',
        }}
      >
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}: </strong>
            {msg.content} {msg.read ? '' : <em>(안읽음)</em>}
          </div>
        ))}
      </div>
      <div className="input-area" style={{ marginTop: '10px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지 입력..."
        />
        <button onClick={sendMessage}>전송</button>
      </div>
    </div>
  );
};

export default ChatRoom;
