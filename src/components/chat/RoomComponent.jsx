import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

import { getMsgs } from '../../api/roomApi';
import { getCookie } from '../../util/cookieUtil';
import { API_SERVER_HOST } from '../../api/todoApi';
import ChatSideBarComponent from './ChatSideBarComponent';
import '../../css/common.css';

export const WS_SERVER_HOST = 'localhost:8080';
// export const WS_SERVER_HOST = 'https://hungrymoment.store';

const RoomComponent = () => {
  const { room_ID } = useParams();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [resetUnreadTrigger, setResetUnreadTrigger] = useState(0);

  // 모바일 사이드바 열림/닫힘 상태
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const messagesEndRef = useRef(null);

  // 쿠키에서 사용자 정보 가져오기
  const memberInfo = getCookie('member');
  const memberEmail = memberInfo.email;

  /**
   * 채팅방 내 메시지를 모두 읽음 처리
   */
  const markMessagesAsRead = async () => {
    try {
      await axios.put(
        `${API_SERVER_HOST}/chat/room/markAsRead/${room_ID}?email=${memberEmail}`
      );
      console.log('채팅방 메시지 읽음 처리 성공');
    } catch (error) {
      console.error('채팅방 내 메시지 읽음 처리 실패', error);
    }
  };

  /**
   * 컴포넌트 마운트 시 채팅 메시지 불러오기 및 WebSocket 연결
   */
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getMsgs(room_ID);
        console.log('원본 메세지 데이터', data);

        // 메시지마다 프로필 이미지 URL 보정
        const updatedData = await Promise.all(
          data.map(async (msg) => {
            if (!msg.profileFilename) {
              try {
                const response = await axios.get(
                  `${API_SERVER_HOST}/api/member/${msg.email}`
                );
                msg.profileFilename = `${API_SERVER_HOST}/api/member/view/${response.data.profileFilename}`;
              } catch (error) {
                console.error(
                  `프로필 정보를 가져오는데 실패했습니다: ${msg.email}`,
                  error
                );
                msg.profileFilename = '/default-profile.png'; // 기본 이미지
              }
            }
            return msg;
          })
        );
        setMessages(updatedData);
        console.log('보정된 메세지 데이터', updatedData);
      } catch (error) {
        console.error('메시지 불러오기 실패:', error);
      }
    };
    fetchMessages();

    // WebSocket 연결
    const wsUrl = `ws://${WS_SERVER_HOST}/ws/chat`;
    const ws = new WebSocket(wsUrl);
    let isRoomEntered = false;

    // 서울 시간 기준 전송 시간
    const now = new Date();
    const seoulTime = now.toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    ws.onopen = () => {
      console.log('[open] 커넥션 생성');
      if (!isRoomEntered) {
        ws.send(
          JSON.stringify({
            room_ID: room_ID,
            messageType: 'ENTER',
            email: memberEmail,
            content: `\"${memberInfo.nickname}\" 님이 채팅방에 접속했습니다`,
            reg_date: seoulTime.replace('-', ''),
          })
        );
        isRoomEntered = true;
      }
    };

    ws.onmessage = async (event) => {
      try {
        const messageData = JSON.parse(event.data);
        // 타입이 'chat'인 메시지만 채팅창에 추가
        if (messageData.type === 'chat') {
          try {
            const response = await axios.get(
              `${API_SERVER_HOST}/api/member/${messageData.email}`
            );
            messageData.profileFilename = `${API_SERVER_HOST}/api/member/view/${response.data.profileFilename}`;
          } catch (err) {
            console.error('사용자 정보를 가져오는데 실패했습니다.', err);
            messageData.profileFilename = '/default-profile.png';
          }
          setMessages((prevMessages) => [...prevMessages, messageData]);
        }
      } catch (error) {
        console.error('메시지 오류:', error);
      }
    };

    ws.onclose = () => {
      console.log('[close] 커넥션 종료');
    };

    ws.onerror = (error) => {
      console.error('[error] 에러 발생', error);
    };

    setSocket(ws);

    // 언마운트 시 WebSocket 종료 & 읽음처리
    return () => {
      ws.close();
      markMessagesAsRead();
    };
  }, [room_ID, memberEmail]);

  /**
   * 메시지 목록 업데이트 시 스크롤을 맨 아래로 이동
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /**
   * 메시지 전송 함수
   */
  const sendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const now = new Date();
      const seoulTime = now.toLocaleString('ko-KR', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      const messagePayload = {
        room_ID: room_ID,
        messageType: 'TALK',
        email: memberEmail,
        content: inputMessage,
        reg_date: seoulTime.replace('-', ''),
      };
      socket.send(JSON.stringify(messagePayload));
      setInputMessage('');
    } else {
      console.error('WebSocket이 닫혀 있습니다.');
    }
  };

  /**
   * 인풋 포커스 시 읽음 처리
   */
  const handleInputFocus = async () => {
    await markMessagesAsRead();
    setResetUnreadTrigger((prev) => prev + 1);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Sidebar */}
      <Dialog
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        className="fixed inset-0 z-50 lg:hidden"
      >
        {/* 반투명 배경 */}
        <Dialog.Overlay className="fixed inset-0 bg-gray-900/80" />
        <div className="flex h-full">
          <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1 bg-white p-6 mt-16 mb-16">
            <div className="flex h-16 shrink-0 items-center">
              <img
                alt="Your Company"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                className="h-8 w-auto"
              />
            </div>
            <div>
              <ChatSideBarComponent
                socket={socket}
                resetUnreadTrigger={resetUnreadTrigger}
                activeRoomId={room_ID}
              />
            </div>
          </Dialog.Panel>
          <div className="w-16 flex items-center justify-center">
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="-m-2.5 p-2.5 text-gray-700"
            >
              <span className="sr-only">Close sidebar</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </Dialog>

      {/* 데스크톱용 Sidebar */}
      <div className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-gray-200 p-4 rounded-tl-lg rounded-bl-lg overflow-y-auto">
        <div className="mb-4">
          <h2 className="text-xl font-bold">채팅방 목록</h2>
        </div>
        <ChatSideBarComponent
          socket={socket}
          resetUnreadTrigger={resetUnreadTrigger}
          activeRoomId={room_ID}
        />
      </div>

      {/* 오른쪽: 실제 채팅 UI 영역 */}
      <div className="flex-1 flex flex-col">
        {/* 상단 헤더 (모바일 메뉴 버튼 + 채팅방 나가기 등) */}
        <div className="flex items-center justify-between bg-yellow-200 p-4 rounded-tr-lg  sm:rounded-tl-lg border-b border-gray-200">
          <div className="flex items-center space-x-4">
            {/* 모바일에서만 보이는 메뉴 버튼 */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
            <h2 className="text-lg font-semibold">채팅방 #{room_ID}</h2>
          </div>
          <Link to="/" className="defaultBtn">
            채팅방 나가기
          </Link>
        </div>

        {/* 채팅 메시지 표시 영역 */}
        <div className="flex-1 overflow-y-auto p-4">
          <ul>
            {messages.map((msg, index) => (
              <li
                key={index}
                className={index === messages.length - 1 ? 'mb-12' : ''}
              >
                {msg.email === memberEmail ? (
                  // 내 메시지
                  <div className="flex justify-end items-end space-x-1 mt-2 max-w-xs ml-auto">
                    <div>
                      <div className="bg-blue-600 text-white w-fit p-3 rounded-l-lg rounded-br-lg break-words">
                        <p className="text-sm">{msg.content}</p>
                      </div>
                      <span className="text-xs text-gray-500 leading-none">
                        {msg.reg_date}
                      </span>
                    </div>
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 overflow-hidden">
                      <img
                        src={msg.profileFilename}
                        alt="member Avatar"
                        className="w-10 h-10 object-cover"
                      />
                    </div>
                  </div>
                ) : (
                  // 상대 메시지
                  <div className="flex w-full mt-2 space-x-3 max-w-xs">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 overflow-hidden">
                      <img
                        src={msg.profileFilename}
                        alt="member Avatar"
                        className="w-10 h-10 object-cover"
                      />
                    </div>
                    <div>
                      <div className="bg-gray-100 p-3 rounded-r-lg rounded-bl-lg">
                        <p className="text-sm">{msg.content}</p>
                      </div>
                      <span className="text-xs text-gray-500 leading-none">
                        {msg.reg_date}
                      </span>
                    </div>
                  </div>
                )}
              </li>
            ))}
            <div ref={messagesEndRef} />
          </ul>
        </div>

        {/* 메시지 입력 영역 */}
        <div className="flex items-center space-x-2 p-4 rounded-br-lg sm:rounded-bl-lg bg-white border-t border-gray-200">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') sendMessage();
            }}
            onFocus={handleInputFocus}
            placeholder="메시지를 입력하세요"
            className="flex-grow p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
          <button onClick={sendMessage} className="positiveBtn">
            전송
          </button>
        </div>
      </div>
    </div>
  );
};

RoomComponent.propTypes = {
  room_ID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default RoomComponent;
