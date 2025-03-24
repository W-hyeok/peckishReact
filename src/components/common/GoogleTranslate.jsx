import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { languages } from '../../assets/languages';
import { useDispatch, useSelector } from 'react-redux';
import { selectLanguage } from '../../slices/languageSlice';
import { getCookie } from '../../util/cookieUtil';
import '../../css/translate.css';

const GoogleTranslate = () => {
  const languageState = useSelector((state) => state.language);
  const disPatch = useDispatch();
  const cookieLang = getCookie('transLang');

  // const [chooseCountry, setChooseCountry] = useState(
  //   { code: 'ko', name: '한국어', flag: 'kr' } // 한국어
  // );
  const [isClicked, setIsClicked] = useState(false); // 클릭 여부 상태값
  const [isTranslated, setIsTranstlated] = useState(false); // 번역 모드 상태값 (번역 중임을 알림)
  const [isMobile, setIsMobile] = useState(false); // 모바일 여부 상태

  useEffect(() => {
    // 모바일 판별: 화면 너비가 768px 이하이면 모바일로 간주
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const addGoogleTranslateScript = document.createElement('script');
    addGoogleTranslateScript.src =
      'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.body.appendChild(addGoogleTranslateScript);

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'ko',
          autoDisplay: false,
        },
        'google_translate_element'
      );
    };

    return () => {
      document.body.removeChild(addGoogleTranslateScript);
    };
  }, []);

  // 스크롤 이벤트를 home요소에서 상속 안 받으며, 상위 요소로 전파 방지
  const handleWheel = (e) => {
    e.stopPropagation();
  };
  const handleLanguageChange = (lang) => {
    const value = lang.code;
    const gtCombo = document.querySelector('.goog-te-combo');
    if (gtCombo) {
      gtCombo.value = value;
      gtCombo.dispatchEvent(new Event('change'));
    }
    // setChooseCountry(lang);
    disPatch(selectLanguage(lang));
  };

  return (
    <>
      <div id="google_translate_element" className="hidden"></div>
      {/* <button
        onClick={() => {
          disPatch(selectLanguage(chooseCountry.name));
        }}
      >
        {' '}
        언어 선택하기{' '}
      </button> */}
      {isClicked && (
        <span className="mr-4 text-gray-500 bg-yellow-200/50 rounded-lg">
          * 번역은 정확하지 않을 수 있습니다.
        </span>
      )}
      <ButtonCotainer
        key={languageState.code}
        // onMouseEnter={() => setIsHovered(true)}
        // onMouseLeave={() => setIsHovered(false)}
        onClick={() => {
          setIsClicked(!isClicked); // 버튼 클릭 시 isClicked값 전환 ('토글')
          setIsTranstlated(true);
          console.log('저장된 언어:', cookieLang);
        }}
      >
        {/* 언어 쿠키 있으면 그걸로, 없으면 기본값으로 렌더링 */}
        {cookieLang ? (
          <>
            <Flag code={cookieLang.flag} />
            {!isMobile && cookieLang.name}
          </>
        ) : (
          <>
            <Flag code={languageState.flag} />
            {!isMobile && languageState.name}
          </>
        )}
        {/* 번역버튼 hover 시 리스트 표시 */}
        {isClicked && (
          <>
            <LanguageList
              onWheel={handleWheel}
              // onMouseEnter={() => setIsHovered(true)}
              // onMouseLeave={() => setIsHovered(false)}
              onClick={() => {
                setIsClicked(false);
              }}
            >
              {languages.map((lang) => (
                <LanguageItem
                  key={lang.code}
                  onClick={() => {
                    handleLanguageChange(lang);
                    console.log('선택된 국가(comp):', languageState);
                    setIsClicked(false);
                  }}
                >
                  <Flag code={lang.flag} />
                  {lang.name}
                </LanguageItem>
              ))}
            </LanguageList>
          </>
        )}
      </ButtonCotainer>
    </>
  );
};

export default GoogleTranslate;

const ButtonCotainer = styled.li`

  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 5px;
  width: max-content;
  height: 45px;
  cursor: pointer;
  background-color: #ffffff;
  outline: none;
  border: 1px solid #facc15;
  border-radius: 8px;
  font-size: 14px;
  position: relative;
`;

const LanguageList = styled.ul`
  position: absolute;
  top: 6vh;
  right: 0vh;
  background-color: white;
  border: 1px solid #facc15;
  list-style: none;
  padding: 10px;
  padding-top: 5px;
  margin: 0;
  width: max-content;
  height: 80vh;
  overflow-y: auto;
  overflow-x: auto;
  border-radius: 8px;
  z-index: 1000;
`;

const LanguageItem = styled.li`
  cursor: pointer;
  padding: 10px 0px;
  &:hover {
    background-color: #f0f0f0;
  }
  font-size: 14px;
  border-bottom: 1px solid #b7b7b7;
`;

const Flag = styled.div`
  width: 30px;
  height: 25px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-image: url(${(props) =>
    `https://cdn.weglot.com/flags/square/${props.code}.svg`});
`;
