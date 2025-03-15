import { getCookie } from '../../util/cookieUtil';
import LeftComponent from './LeftComponent';
import RightComponent from './RightComponent';

const ReadComponent = () => {
  const cookieMember = getCookie('member');

  return (
    <div>
      <main className="mt-4 pb-4">
        <div className="mx-auto max-w-3xl px-2 sm:px-6 lg:max-w-5xl lg:px-8">
          <h1 className="object-center sr-only">내 페이지</h1>
          {/* Main 3 column grid */}
          <div className="grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
            <LeftComponent email={cookieMember.email} />
            <RightComponent email={cookieMember.email} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReadComponent;
