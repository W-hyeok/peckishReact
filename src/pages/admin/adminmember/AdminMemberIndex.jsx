import { Outlet } from 'react-router-dom';
import BasicLayout from '../../../layouts/BasicLayout';
import PageAdminMemberHeader from '../PageAdminMemberHeader';

const AdminMemberIndex = () => {
  return (
    <BasicLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageAdminMemberHeader title={'Admin'} />
        <main>
          <Outlet />
        </main>
      </div>
    </BasicLayout>
  );
};

export default AdminMemberIndex;
