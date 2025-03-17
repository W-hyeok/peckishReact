import { useEffect, useRef, useState } from 'react';
import { PhotoIcon } from '@heroicons/react/24/solid';
import { Menu, MenuButton, MenuItem } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import ResultModal from './ResultModal';
import { deleteMenu, getMenuList, menuAdd } from '../../api/shopApi';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/24/outline';
import { API_SERVER_HOST } from '../../api/todoApi';
import React from 'react';
import useCustomMove from '../../hooks/useCustomMove';

// 메뉴 등록할때 입력받는 데이터 담는 menu state
const initState = {
  menuFile: null,
  menuName: '',
  price: '',
};

const host = `${API_SERVER_HOST}`;

const AddMenuModal = ({
  shopId,
  shopDetailId,
  infoType,
  title,
  content,
  callbackFn,
}) => {
  // 뒤로가기(useCustomMove)
  const { moveToBack } = useCustomMove();
  const [open, setOpen] = useState(true);

  // 메뉴 추가 등록에 필요한 것들
  const [menu, setMenu] = useState({ ...initState });
  // 메뉴 목록 뿌려줄때 필요한 것들
  //const [menuItems, setMenuItems] = useState([]);
  const [result, setResult] = useState(null); //등록완료 모달 보여주기 위해서
  const [errorMessage, setErrorMessage] = useState(''); // 오류메시지를 저장할 상태
  const uploadRef = useRef(); // html id속성 대신 사용
  const [menufile, setMenufile] = useState(null); // shopfile 상태 추가
  const [image, setImage] = useState(null);

  // DB에서 메뉴목록 불러오기
  // useEffect(() => {
  //   getMenuList(shopId, infoType).then((data) => {
  //     console.log('메뉴 목록 업데이트:', data.RESULT);
  //     setMenuItems([...data.RESULT]);
  //   });
  // }, [shopId, infoType]);

  // 메뉴 저장 버튼 클릭
  // 메뉴 등록시 shopDetailId필요 <-- 이전 detail페이지에서 주소로 넘기기(addMenu 주소 수정필요)
  const handleClickSave = () => {
    // FormData 생성
    const formData = new FormData();
    const menuFile = menufile; // 상태에서 가져온 파일 사용

    // 유효성 검사
    if (!menuFile) {
      setErrorMessage('파일을 선택해주세요!');
      return;
    }

    if (!menu.menuName) {
      setErrorMessage('메뉴 이름을 입력해주세요!');
      return;
    }

    if (!menu.price) {
      setErrorMessage('메뉴 가격을 입력해주세요!');
      return;
    }
    // 유효성 검사 통과 시
    setErrorMessage(''); // 오류 메시지 초기화

    // 확인용 콘솔 출력
    console.log('메뉴 이름은 : ', menu.menuName);
    console.log('메뉴 파일은 : ', menuFile);
    console.log('메뉴 가격은 : ', menu.price);
    console.log('shopDetailId : ', shopDetailId);

    // DB에 보내줄 데이터 취합
    formData.append('menuName', menu.menuName);
    formData.append('menuFile', menuFile); // menufile로 수정
    formData.append('price', menu.price);
    formData.append('shopDetailId', shopDetailId);

    //shopapi (매개변수 순서, 개수 )
    // menuAdd의 3개는 back으로 보내줄 데이터
    menuAdd(shopId, infoType, formData)
      // back에서 돌려주는 데이터는 then의 data 변수에 담김
      .then((data) => {
        console.log(data);
        setResult(data.RESULT); //백 컨트롤러 리턴값
        setMenu({ ...initState });
        //setMenuItems((prevItems) => [...prevItems, menuItems]);
        setImage(null);
      })
      // back에 요청하다 에러 발생하면 실행되는 부분
      .catch((err) => console.log('메뉴 등록 실패', err));

    setResult(true); // 메뉴 등록 후 ResultModal을 열도록 상태 업데이트
  };

  // ResultModal 닫기
  const closeModal = () => {
    setResult(false);
    handleClose();
    console.log('메뉴 저장 완료!!');
  };

  //변경된 메뉴 처리
  const handleChangeMenu = (e) => {
    const { name, value } = e.target;
    setMenu({ ...menu, [name]: value });
  };

  // 이미지 업로드 처리
  const handleImageMenu = (e) => {
    const file = e.target.files[0]; // file input에서 직접 파일 가져오기
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // 미리보기 설정
      };
      reader.readAsDataURL(file);
      setMenufile(file); // menufile 상태에 파일 저장
    }
  };

  const handleClose = () => {
    console.log('모달 Close!!!');
    setOpen(false);

    if (callbackFn) {
      callbackFn(); // == component에서 전달해준 closeModal 함수
    }
  };

  return (
    <>
      {result && (
        <ResultModal
          title={'메뉴 등록 성공'}
          content={'메뉴가 등록되었습니다'}
          callbackFn={closeModal}
        />
      )}

      <Dialog open={open} onClose={handleClose} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-xl sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold text-gray-900"
                  >
                    {title}
                  </DialogTitle>
                  <div className="mt-3">
                    <p className="text-sm text-gray-500">{content}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm">
                {/* 메뉴 추가 */}
                <dl className="space-y-6 border-t border-gray-200 px-4 py-6 sm:px-6">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    메뉴
                  </label>
                  {/* 메뉴 이미지 추가 */}
                  <div className="mt-2 justify-center rounded-lg border border-dashed border-gray-900/25 py-4">
                    <div className="text-center">
                      {image ? (
                        <img
                          src={image}
                          alt="Preview"
                          className="mx-auto rounded-lg max-w-full h-auto"
                          style={{ width: '320px', height: '180px' }} // 이미지 크기 조정
                        />
                      ) : (
                        <PhotoIcon
                          aria-hidden="true"
                          className="mx-auto size-12 text-gray-300"
                        />
                      )}
                      {!image && (
                        <>
                          <div className="mt-4 flex justify-center text-sm/6 text-gray-600">
                            <label
                              className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 
                                  focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                            >
                              <span>메뉴 사진 업로드</span>
                              <input
                                type="file"
                                ref={uploadRef}
                                accept="image/*"
                                multiple={false} // 한장의 파일만 선택
                                className="sr-only"
                                onChange={handleImageMenu}
                              />
                            </label>
                          </div>
                          <p className="text-xs/5 text-gray-600">
                            사진 용량은 10MB까지 업로드 가능
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* 메뉴명 / 가격 */}
                  <div className="flex">
                    <div className="ml-auto mr-2 flex-1">
                      <label
                        htmlFor="menuName"
                        className="block text-sm/6 font-medium text-gray-700"
                      >
                        메뉴명
                      </label>
                      <div className="mt-2">
                        <input
                          id="menuName"
                          name="menuName"
                          type="text"
                          value={menu.menuName}
                          onChange={handleChangeMenu}
                          placeholder="팥 3개"
                          className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                      </div>
                    </div>

                    <div className="ml-2 flex-1">
                      <label
                        htmlFor="price"
                        className="block text-sm/6 font-medium text-gray-700"
                      >
                        가격
                      </label>
                      <div className="mt-2">
                        <input
                          id="price"
                          name="price"
                          type="text"
                          value={menu.price}
                          onChange={handleChangeMenu}
                          placeholder="1,000(원)"
                          className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                      </div>
                    </div>
                  </div>
                </dl>
                {/* 오류 메시지 */}
                {errorMessage && (
                  <div className="mt-2 text-sm text-red-500">
                    {errorMessage}
                  </div>
                )}
              </div>
              <div className="mt-5 sm:mt-6 flex gap-4">
                <button
                  type="button"
                  onClick={handleClickSave}
                  className="inline-flex w-full justify-center rounded-md bg-yellow-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  등록
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="inline-flex w-full justify-center rounded-md bg-gray-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  돌아가기
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default AddMenuModal;
