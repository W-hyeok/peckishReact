import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMsgs } from '../../api/roomApi';
import { getCookie } from '../../util/cookieUtil';
import axios from 'axios';
import { API_SERVER_HOST } from '../../api/todoApi';
import PropTypes from 'prop-types';
import ChatSideBarComponenet from './ChatSideBarComponenet';

const memberInfo = getCookie('member');
const memberEmail = memberInfo.email;

const WS_SERVER_HOST = 'localhost:8080';

const RoomComponent = () => {
  const { room_ID } = useParams();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('ko');
  const messagesEndRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const languageOptions = [
    { code: 'ko', name: '한국어' },
    { code: 'en', name: '영어' },
    { code: 'ch', name: '중국어' },
    { code: 'ja', name: '일본어' },
  ];

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getMsgs(room_ID);
        setMessages(data);
        console.log('메세지 요청 데이터의 이메일', data);
      } catch (error) {
        console.error('메시지 불러오기 실패:', error);
      }
    };
    fetchMessages();

    const wsUrl = `ws://${WS_SERVER_HOST}/ws/chat`;
    const ws = new WebSocket(wsUrl);
    let isRoomEntered = false;

    // 메세지 보낼때 defualt는 영국시간기준으로 되어있어서 서울 시간을 기준으로 하기위해서 설정
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
            content: '채팅방에 접속했습니다',
            ko: '채팅방에 접속했습니다.',
            ja: 'チャットルームに接続しました。',
            ch: '我连接了聊天室。',
            en: "I've logged on to the chat room.",
            selectedLanguage: selectedLanguage,
            reg_date: seoulTime.replace('-'), // ISO 8601 형식으로 변환
          })
        );
        isRoomEntered = true;
      }
    };

    ws.onmessage = async (event) => {
      try {
        // 사용자 정보 등 추가
        const messageData = JSON.parse(event.data);

        // 메시지 수신 시 번역된 메시지 전체를 저장하고, content는 원본으로 유지
        // 만약 이미 번역된 메시지가 있다면 그대로 두고, 없다면 기본 원본 사용
        // 예: messageData.translatedMessage = { original: messageData.content, ... }
        // (이 부분은 서버에서 이미 처리된 번역 결과를 받아오는 것으로 가정)
        try {
          const response = await axios.get(
            `${API_SERVER_HOST}/api/member/${messageData.email}`,
            {
              headers: {
                Authorization: `Bearer ${memberInfo.accessToken}`,
              },
            }
          );
          messageData.profileFilename =
            response.data.profileFilename || '/default.jpg';
        } catch (err) {
          console.error('사용자 정보를 가져오는데 실패했습니다.', err);
          messageData.profileFilename = '/default.jpg';
        }
        setMessages((prevMessages) => [...prevMessages, messageData]);
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
    };
  }, [room_ID]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const messagePayload = {
        room_ID: room_ID,
        messageType: 'TALK',
        email: memberEmail,
        content: inputMessage,
        selectedLanguage: selectedLanguage, // 드롭박스에서 선택한 번역 대상 언어
        reg_date: seoulTime.replace('-'),
      };
      socket.send(JSON.stringify(messagePayload));
      setInputMessage('');
    } else {
      console.error('WebSocket 닫혀있음');
    }
  };

  return (
    <>
      <main className="mb-[100px] max-w-screen-xl p-4 relative justify-center">
        <div className="flex flex-row justify-center bg-[#F9DFB1] w-full max-w-5xl mx-auto h-[40rem] ">
          <ChatSideBarComponenet />
          <div className="flex flex-col flex-grow bg-gray-200 w-full max-w-xl mx-auto rounded-lg p-2 relative border-t border-gray-200 shadow-md">
            {/* 메시지 창 */}
            <div
              className="flex flex-col flex-grow p-4 overflow-y-auto"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#888 #f1f1f1' }}
            >
              <ul>
                {messages.map((msg, index) => {
                  const displayContent =
                    msg.translatedMessage &&
                    msg.translatedMessage[selectedLanguage]
                      ? msg.translatedMessage[selectedLanguage]
                      : msg.content;
                  return (
                    <li
                      key={index}
                      className={
                        index === messages.length - 1 ? 'mb-[50px]' : ''
                      }
                    >
                      {msg.username === memberEmail ? (
                        <div className="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end">
                          <div>
                            <div className="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
                              <p className="text-sm">{displayContent}</p>
                            </div>
                            <span className="text-xs text-gray-500 leading-none">
                              {msg.reg_date}
                            </span>
                          </div>
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 overflow-hidden">
                            <img
                              src={`${API_SERVER_HOST}/member/view/${msg.profileFilename}`}
                              alt="member Avatar"
                              className="w-10 h-10 object-cover"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex w-full mt-2 space-x-3 max-w-xs">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 overflow-hidden">
                            <img
                              src={`${API_SERVER_HOST}/member/view/${msg.profileFilename}`}
                              alt="member Avatar"
                              className="w-10 h-10 object-cover"
                            />
                          </div>
                          <div>
                            <div className="bg-gray-100 p-3 rounded-r-lg rounded-bl-lg">
                              <p className="text-sm">{displayContent}</p>
                            </div>
                            <span className="text-xs text-gray-500 leading-none">
                              {msg.reg_date}
                            </span>
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
                <div ref={messagesEndRef} />
              </ul>
            </div>

            {/* 언어 선택 버튼과 드롭다운을 하나의 relative 컨테이너로 묶음 */}
            <div className="flex items-center space-x-2 relative p-4 bg-white border-t border-gray-200 shadow-md">
              {/* 드롭다운 영역 */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className="px-3 py-2 border rounded-md text-base w-24 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  {languageOptions.find(
                    (lang) => lang.code === selectedLanguage
                  )?.name || '한국어'}
                </button>
                {isOpen && (
                  <ul className="absolute top-full left-0 z-50 mt-1 w-24 bg-white border border-gray-300 rounded-md shadow-lg">
                    {languageOptions.map((lang) => (
                      <li
                        key={lang.code}
                        className="px-4 py-2 hover:bg-indigo-100 cursor-pointer text-gray-900"
                        onClick={() => {
                          setSelectedLanguage(lang.code);
                          console.log(lang.code);
                          setIsOpen(false);
                        }}
                      >
                        {lang.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* 메시지 입력 필드 */}
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') sendMessage();
                }}
                placeholder="메시지를 입력하세요"
                className="flex-grow p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />

              {/* Send 버튼 */}
              <button
                onClick={sendMessage}
                className="px-4 py-2 bg-blue-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

RoomComponent.propTypes = {
  room_ID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default RoomComponent;
