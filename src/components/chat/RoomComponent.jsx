import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getMsgs } from '../../api/roomApi';
import { getCookie } from '../../util/cookieUtil';
import axios from 'axios';
import { API_SERVER_HOST } from '../../api/todoApi';
import PropTypes from 'prop-types';
import ChatSideBarComponent from './ChatSideBarComponent';

import '../../css/common.css';

// export const WS_SERVER_HOST = 'localhost:8080';
export const WS_SERVER_HOST = 'hungrymoment.store';

const RoomComponent = () => {
  const { room_ID } = useParams();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [resetUnreadTrigger, setResetUnreadTrigger] = useState(0);
  const messagesEndRef = useRef(null);

  // 컴포넌트 내부에서 최신 쿠키 값을 읽어옵니다.
  const memberInfo = getCookie('member');
  const memberEmail = memberInfo.email;

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

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getMsgs(room_ID);
        console.log('원본 메세지 데이터', data);

        // 각 메시지에 대해 프로필 이미지 URL 추가
        const updatedData = await Promise.all(
          data.map(async (msg) => {
            // 만약 msg에 프로필 이미지 정보가 없다면 (즉, DB에 없으므로)
            if (!msg.profileFilename) {
              try {
                // 해당 이메일의 사용자 정보를 가져와서 프로필 파일명을 얻음
                const response = await axios.get(
                  `${API_SERVER_HOST}/api/member/${msg.email}`
                );
                // 전체 URL로 보정
                msg.profileFilename = `${API_SERVER_HOST}/api/member/view/${response.data.profileFilename}`;
              } catch (error) {
                console.error(
                  `프로필 정보를 가져오는데 실패했습니다: ${msg.email}`,
                  error
                );
                msg.profileFilename = '/default-profile.png'; // 기본 이미지 경로
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

    // const wsUrl = `ws://${WS_SERVER_HOST}/ws/chat`;
    const wsUrl = `wss://${WS_SERVER_HOST}/ws/chat`; // https 연결일때 wss:// 로 연결해야함.
    const ws = new WebSocket(wsUrl);
    let isRoomEntered = false;

    // 서울 시간 기준으로 메시지 전송 시간 설정
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
      console.log('[open] 커넥션이 만들어졌습니다.');
      if (!isRoomEntered) {
        console.log('member 이메일 확인', memberEmail);
        ws.send(
          JSON.stringify({
            room_ID: room_ID,
            messageType: 'ENTER',
            email: memberEmail,
            content:
              '\"' + memberInfo.nickname + '\"' + ' 님이 채팅방에 접속했습니다',
            reg_date: seoulTime.replace('-', ''),
          })
        );
        isRoomEntered = true;
      }
    };

    ws.onmessage = async (event) => {
      try {
        const messageData = JSON.parse(event.data);
        // 메시지 타입 분기 처리: 채팅창에서는 type이 'chat'인 메시지만 추가
        if (messageData.type === 'chat') {
          try {
            const response = await axios.get(
              `${API_SERVER_HOST}/api/member/${messageData.email}`
            );
            // 프로필 이미지 URL을 messageData 객체에 추가
            messageData.profileFilename = `${API_SERVER_HOST}/api/member/view/${response.data.profileFilename}`;
          } catch (err) {
            console.error('사용자 정보를 가져오는데 실패했습니다.', err);
            messageData.profileFilename = '/default-profile.png'; // 기본 이미지 설정
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

    return () => {
      ws.close();
      // 채팅방 떠날 때 읽음 처리 API 호출
      markMessagesAsRead();
    };
  }, [room_ID, memberEmail]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      console.error('WebSocket 닫혀있음');
    }
  };

  const handleInputFocus = async () => {
    await markMessagesAsRead();
    setResetUnreadTrigger((prev) => prev + 1);
  };

  return (
    <div className="overflow-y-auto">
      <main className="max-w-screen-xl mx-auto p-4">
        <div className="w-full mx-auto mt-14 mb-5 items-end">
          <div className="flex-col flex-grow w-full max-w-xl mx-auto">
            <div className="flex justify-end">
              <Link to="/" className="defaultBtn ">
                채팅방 나가기
              </Link>
            </div>
          </div>
        </div>
        <div className="relative flex flex-row justify-center bg-opacity-15 w-full max-w-5xl mx-auto h-[40rem]">
          <ChatSideBarComponent
            socket={socket}
            resetUnreadTrigger={resetUnreadTrigger}
            activeRoomId={room_ID}
          />
          <div className="flex flex-col flex-grow bg-gray-200 w-full max-w-xl mx-auto rounded-lg p-2 relative border-t border-gray-200 shadow-md">
            {/* 메시지 창 */}
            <div
              className="flex flex-col flex-grow p-4 overflow-y-auto"
              q
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#888 #f1f1f1' }}
            >
              <ul>
                {messages.map((msg, index) => (
                  <li
                    key={index}
                    className={index === messages.length - 1 ? 'mb-[50px]' : ''}
                  >
                    {msg.email === memberEmail ? (
                      <div className="flex justify-end items-end space-x-1 mt-2 max-w-xs ml-auto">
                        <div>
                          <div className="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg break-words">
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

            {/* 메시지 입력과 전송 영역 */}
            <div className="flex items-center space-x-2 relative p-4 bg-white border-t border-gray-200 shadow-md">
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
      </main>
    </div>
  );
};

RoomComponent.propTypes = {
  room_ID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default RoomComponent;
