import { useEffect, useRef, useState, useCallback } from 'react';
import { getMenuList } from '../../api/shopApi';
import { API_SERVER_HOST } from '../../api/todoApi';
import useCustomMove from '../../hooks/useCustomMove';

const host = `${API_SERVER_HOST}`;
const PAGE_SIZE = 10; // 한 번에 불러올 아이템 개수

const AddMenuComponent = ({ shopId, infoType }) => {
  const { moveToBack } = useCustomMove();
  const [menuItems, setMenuItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  useEffect(() => {
    loadMenus(1, true);
  }, [shopId, infoType]);

  const loadMenus = async (pageNum, isFirstLoad = false) => {
    try {
      const data = await getMenuList(shopId, infoType, pageNum, PAGE_SIZE);
      if (data.RESULT.length < PAGE_SIZE) setHasMore(false);
      if (isFirstLoad) {
        setMenuItems(data.RESULT);
      } else {
        setMenuItems((prev) => [...prev, ...data.RESULT]);
      }
    } catch (err) {
      console.error('메뉴 불러오기 실패', err);
    }
  };

  const lastMenuElementRef = useCallback(
    (node) => {
      if (!hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setPage((prevPage) => {
              const nextPage = prevPage + 1;
              loadMenus(nextPage);
              return nextPage;
            });
          }
        },
        { threshold: 1.0 }
      );
      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  return (
    <div className="flex justify-center p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {menuItems.map((menu, index) => (
          <div
            key={menu.menuId}
            className="flex flex-col items-center border rounded-lg p-4 shadow-md bg-white"
            ref={index === menuItems.length - 1 ? lastMenuElementRef : null}
          >
            <img
              alt="Preview"
              src={`${host}/api/shop/view/${menu.menuFilename}`}
              className="w-24 h-24 object-cover rounded-full mb-2"
            />
            <p className="text-lg font-semibold text-gray-900">
              {menu.menuName}
            </p>
            <span className="text-sm text-gray-700">{menu.price} 원</span>
          </div>
        ))}
      </div>
      {!hasMore && (
        <p className="text-center py-4 text-gray-500 w-full">
          더 이상 메뉴가 없습니다.
        </p>
      )}
    </div>
  );
};

export default AddMenuComponent;
