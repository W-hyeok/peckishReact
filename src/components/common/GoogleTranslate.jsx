import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { languages } from '../../assets/languages';

const GoogleTranslate = () => {
  const [chooseCountry, setChooseCountry] = useState(
    { code: 'ko', name: '한국어', flag: 'kr' } // 한국어
  );
  const [isHovered, setIsHovered] = useState(false); // hover 상태 관리

  useEffect(() => {
    const addGoogleTranslateScript = document.createElement('script');
    addGoogleTranslateScript.src =
      'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.body.appendChild(addGoogleTranslateScript);

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        { pageLanguage: 'ko', autoDisplay: true },
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
    console.log('lang', lang);
    setTimeout(() => {
      setChooseCountry(lang);
    }, 500);
  };

  return (
    <>
      <div id="google_translate_element" className="hidden"></div>
      {isHovered && (
        <span className="mr-4 text-gray-500 bg-yellow-200/50 rounded-lg">
          * 번역은 정확하지 않을 수 있습니다.
        </span>
      )}
      <ButtonCotainer
        key={chooseCountry.code}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Flag code={chooseCountry.flag} />
        {chooseCountry.name}
        {/* 번역버튼 hover 시 리스트 표시 */}
        {isHovered && (
          <>
            <LanguageList
              onWheel={handleWheel}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {languages.map((lang) => (
                <LanguageItem
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang)}
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
  border: 2px solid #000000;
  border-radius: 8px;
  font-size: 14px;
  position: relative;
  z-index: 999;
`;

const LanguageList = styled.ul`
  position: absolute;
  top: 0vh;
  left: 0;
  background-color: white;
  border: 2px solid #000000;
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
