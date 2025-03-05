import { useNavigate, useSearchParams } from 'react-router-dom';
import ListMemberComponent from '../../components/admin/ListMemberComponent';
// admin/list?page=1&size=10
const ListMemberPage = () => {
  // todo/list?page=1&size=10
  const [queryParams] = useSearchParams();
  const page = queryParams.get('page') ? parseInt(queryParams.get('page')) : 1;
  const size = queryParams.get('size') ? parseInt(queryParams.get('size')) : 10;

  const navigate = useNavigate();
  const moveToRead = (email) => {
    navigate({ pathname: `/admin/readmember/${email}` });
  };

  return (
    <>
      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h1 className="text-xl font-semibold text-indigo-900">
                  사업자 신청대상 목록
                </h1>
                <p className="mt-2 text-sm text-indigo-600">
                  {page} - {size}
                </p>
              </div>
            </div>
            <div className="mt-8 flow-root">
              <ListMemberComponent />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListMemberPage;
