import { useNavigate, useSearchParams } from 'react-router-dom';
import ListShopComponent from '../../components/admin/ListShopComponent';
// admin/list?page=1&size=10
const ListShopPage = () => {
  // todo/list?page=1&size=10
  const [queryParams] = useSearchParams();
  const page = queryParams.get('page') ? parseInt(queryParams.get('page')) : 1;
  const size = queryParams.get('size') ? parseInt(queryParams.get('size')) : 10;

  const navigate = useNavigate();
  const moveToRead = (shopId) => {
    navigate({ pathname: `/admin/read/${shopId}` });
  };

  return (
    <>
      {/* <div className="overflow-hidden bg-white shadow sm:rounded-lg"> */}
      <div className="px-4 py-5 sm:p-6">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-lg sm:text-sm font-bold sm:mt-6 text-gray-900">
                관리자 페이지 <span aria-hidden="true"> &rsaquo;&rsaquo; </span>
                전체 상점 목록
              </h1>
              <p className="mt-4 text-xl text-gray-700">
                {page} - {size}
              </p>
            </div>
          </div>
          <div className="mt-8 flow-root">
            <ListShopComponent />
          </div>
        </div>
      </div>
      {/* </div> */}
    </>
  );
};

export default ListShopPage;
