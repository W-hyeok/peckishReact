// ChatRoomPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const ChatRoomPage = () => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [client, setClient] = useState(null);
  const [input, setInput] = useState('');

  useEffect(() => {
    // 1. 백엔드에서 채팅방 메시지 불러오기
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/api/chat/rooms/${roomId}/messages`);
        setMessages(res.data);
      } catch (error) {
        console.error('메시지 불러오기 실패:', error);
      }
    };

    fetchMessages();

    // 2. 채팅방에 입장 시 읽음 처리 (관리자 또는 고객에 따라 reader 파라미터 조정)
    const markAsRead = async () => {
      try {
        await axios.post(`/api/chat/rooms/${roomId}/markAsRead`, null, {
          params: { reader: 'CUSTOMER' }, // 예시로 CUSTOMER가 읽었을 경우
        });
      } catch (error) {
        console.error('메시지 읽음 처리 실패:', error);
      }
    };

    markAsRead();

    // 3. 웹소켓 연결 설정 (STOMP)
    const sockSTOMP = new SockJS('http://localhost:8080/ws-chat');
    const stompClient = new Client({
      webSocketFactory: () => sockSTOMP,
      reconnectDelay: 5000,
      onConnect: () => {
        stompClient.subscribe(`/topic/chat/${roomId}`, (message) => {
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
  }, [roomId]);

  const sendMessage = () => {
    if (client) {
      const chatMessage = {
        chatroomId: roomId,
        sender: '', // 상황에 맞게 ADMIN 또는 CUSTOMER 지정
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
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">채팅방: {roomId}</h2>
      <div className="border p-3 h-64 overflow-y-scroll mb-4">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <strong>{msg.sender}: </strong>
            {msg.content}
            {!msg.read && <span className="text-red-500 ml-2">(안읽음)</span>}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지 입력..."
          className="border px-2 py-1 flex-grow"
        />
        <button
          onClick={sendMessage}
          className="ml-2 px-4 py-1 bg-blue-500 text-white rounded"
        >
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatRoomPage;
