import BasicLayout from '../../layouts/BasicLayout';
import { Outlet } from 'react-router-dom';

const MemberIndex = () => {
  return (
    <BasicLayout>
      {/* <div className="flex min-h-full items-center justify-center mx-auto px-4 sm:px-6 lg:px-8"> */}
        <main>
          <Outlet />
        </main>
      {/* </div> */}
    </BasicLayout>
  );
};

export default MemberIndex;
