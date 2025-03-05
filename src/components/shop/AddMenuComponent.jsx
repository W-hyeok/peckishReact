import { PhotoIcon } from '@heroicons/react/24/solid';
import { useEffect, useRef, useState } from 'react';
import { Menu, MenuButton, MenuItem } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import ResultModal from '../common/ResultModal';
import { deleteMenu, getMenuList, menuAdd } from '../../api/shopApi';
import { API_SERVER_HOST } from '../../api/todoApi';
import useCustomMove from '../../hooks/useCustomMove';
import { Navigate } from 'react-router-dom';
import '../../css/scrollbar2.css'; // 스크롤바 css

// 메뉴 등록할때 입력받는 데이터 담는 menu state
const initState = {
  menuFile: null,
  menuName: '',
  price: '',
};

const host = `${API_SERVER_HOST}`;
const moveToShopModify = useCustomMove;

const AddMenuComponent = ({ shopId, shopDetailId, infoType }) => {
  console.log(shopId);
  console.log(shopDetailId);
  console.log(infoType);

  // 뒤로가기(useCustomMove)
  const { moveToBack } = useCustomMove();

  // 메뉴 목록 뿌려줄때 필요한 것들
  const [menuItems, setMenuItems] = useState([]);

  // 메뉴 추가 등록에 필요한 것들
  const [menu, setMenu] = useState({ ...initState });
  const [result, setResult] = useState(null);

  const uploadRef = useRef(); // html id속성 대신 사용
  const [menufile, setMenufile] = useState(null); // shopfile 상태 추가
  const [image, setImage] = useState(null);

  // DB에서 메뉴목록 불러오기
  useEffect(() => {
    getMenuList(shopId, infoType).then((data) => {
      console.log(data.RESULT);
      setMenuItems(data.RESULT); // DB에서 가져온 목록을 menuItems state에 저장
    });
  }, [shopId, infoType, result]);

  /* 메뉴 데이터 샘플
  const [menuItems, setMenuItems] = useState([
    {
      // 백단에서 하나의 DTO로 데이터 모아담아 전달
      shopDetailId: 1,
      menuId: 1,
      menuName: '어묵',
      price: '1000',
      menuFile: '',
      infoType: 'USER',
    },
  ]);
  */

  // 메뉴 저장 버튼 클릭
  // 메뉴 등록시 shopDetailId필요 <-- 이전 detail페이지에서 주소로 넘기기(addMenu 주소 수정필요)
  const handleClickSave = () => {
    // FormData 생성
    const formData = new FormData();
    const menuFile = menufile; // 상태에서 가져온 파일 사용

    // 유효성 검사
    if (!menuFile) {
      alert('파일을 선택해주세요!');
      return;
    }

    if (!menu.menuName) {
      alert('메뉴 이름을 입력해주세요!');
      return;
    }

    if (!menu.price) {
      alert('메뉴 가격을 입력해주세요!');
      return;
    }

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
        setImage(null);
      })
      // back에 요청하다 에러 발생하면 실행되는 부분
      .catch((err) => console.log('메뉴 등록 실패', err));
  };

  const closeModal = () => {
    setResult(null);
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

  //메뉴 삭제 (받을 인자 값)
  const handleMenuRemove = (menuId) => {
    console.log('삭제할 menuId : ', menuId);
    deleteMenu(menuId, infoType).then((data) => {
      console.log(data.RESULT);
      const updatedMenuItems = menuItems.filter(
        (menu) => menu.menuId !== menuId
      );
      setMenuItems(updatedMenuItems);
    });
  };

  // 점포 수정 페이지로 이동
  const handleModify = () => {
    moveToShopModify(`/shop/modify/${shopId}`);
  };

  return (
    <>
      {result && (
        <ResultModal
          title={'메뉴 등록 성공'}
          content={'등록 완료'}
          callbackFn={closeModal}
        />
      )}

      {/* 중앙정렬용 부모 div */}
      <div className="flex">
        {/* 메뉴 리스트 전체 div (중앙정렬, 좌우 간격 조정 */}
        <div className="m-auto max-w-max">
          {/* 메뉴 리스트 */}
          <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm">
            <ul
              role="list"
              className="divide-y divide-gray-100 max-h-96 scrollbar2"
            >
              {menuItems.map((menu) => (
                <li
                  key={menu.menuId}
                  className="flex justify-between px-12 py-10"
                >
                  <div className="min-w-0 gap-x-6">
                    <img
                      alt="Preview"
                      src={`${host}/api/shop/view/${menu.menuFilename}`}
                      className="size-12 float-right rounded-full bg-gray-50"
                    />
                    <div className="min-w-0 flex-auto">
                      <p className="text-sm/6 font-semibold text-gray-900">
                        <a className="hover:underline">{menu.menuName}</a>
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-x-6">
                    <div className="sm:flex sm:flex-col sm:items-end">
                      <span className="text-sm/6 text-gray-900">
                        {menu.price} 원
                      </span>
                    </div>
                    <Menu as="div" className="relative flex-none">
                      <MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                        <span className="sr-only">Open options</span>
                        <EllipsisVerticalIcon
                          aria-hidden="true"
                          className="size-5"
                        />
                      </MenuButton>
                      <Menu.Items
                        transition
                        className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5"
                      >
                        <MenuItem>
                          <a
                            onClick={(e) => {
                              e.preventDefault();
                              handleMenuRemove(menu.menuId);
                            }}
                            className="block px-3 py-1 text-sm/6 text-gray-900"
                          >
                            삭제하기
                            <span className="sr-only">, {menu.menuId}</span>
                          </a>
                        </MenuItem>
                      </Menu.Items>
                    </Menu>
                  </div>
                </li>
              ))}
            </ul>

            {/* 메뉴 추가 */}
            <dl className="space-y-6 border-t border-gray-200 px-4 py-6 sm:px-6">
              <label className="block text-sm/6 font-medium text-gray-900">
                메뉴
              </label>
              {/*메뉴 이미지 추가 */}
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
                            multiple={false} //한장의 파일만 선택택
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
                <div className="ml-auto mr-2">
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

                <div className="ml-2">
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

            {/* 메뉴 등록하기 버튼 */}
            <div className="flex">
              <div className="border-t border-gray-200 px-4 py-6 sm:px-6 ml-auto mr-2">
                <button
                  type="submit"
                  onClick={handleClickSave}
                  className="w-auto rounded-md border border-transparent bg-yellow-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                >
                  등록하기
                </button>
                <button
                  type="button"
                  onClick={moveToBack}
                  className="w-auto ml-2 rounded-md border border-transparent px-4 py-3 text-base font-medium text-black shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                >
                  돌아가기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddMenuComponent;
