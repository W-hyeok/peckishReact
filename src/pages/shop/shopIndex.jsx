import { Outlet } from 'react-router-dom';
import BasicLayout from '../../layouts/BasicLayout';
import PageHeader from '../PageHeader';

const shopIndex = () => {
  return (
    <BasicLayout>
      <div className="mx-auto px-4 sm:px-8 lg:px-8">
        <main>
          <Outlet />
        </main>
      </div>
    </BasicLayout>
  );
};

export default shopIndex;
