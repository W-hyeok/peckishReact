import { getCookie } from '../../util/cookieUtil';
import LeftModifyInfoComponent from './LeftModifyInfoComponent';
import RightComponent from './RightComponent';

const ModifyInfoComponent = () => {
  const cookieMember = getCookie('member');

  return (
    <div>
      <main className="mt-10 pb-4">
        <div className="mx-auto max-w-3xl px-2 sm:px-6 lg:max-w-5xl lg:px-8">
          <h1 className="object-center sr-only">내 페이지</h1>
          <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-1 lg:gap-8">
            <LeftModifyInfoComponent />
            {/* <RightComponent email={cookieMember.email} /> */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ModifyInfoComponent;
