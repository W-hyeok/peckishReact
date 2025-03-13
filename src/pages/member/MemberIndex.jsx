import BasicLayout from '../../layouts/BasicLayout';
import { Outlet } from 'react-router-dom';

const MemberIndex = () => {
  return (
    <BasicLayout>
      <div className="">
        <main>
          <Outlet />
        </main>
      </div>
    </BasicLayout>
  );
};

export default MemberIndex;
