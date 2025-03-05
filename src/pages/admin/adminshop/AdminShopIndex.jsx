import { Outlet } from 'react-router-dom';
import BasicLayout from '../../../layouts/BasicLayout';
import PageShopHeader from '../PageShopHeader';

const AdminShopIndex = () => {
  return (
    <BasicLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageShopHeader title={'Admin'} />
        <main>
          <Outlet />
        </main>
      </div>
    </BasicLayout>
  );
};

export default AdminShopIndex;
