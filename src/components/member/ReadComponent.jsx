import { getCookie } from '../../util/cookieUtil';
import LeftComponent from './LeftComponent';
import RightComponent from './RightComponent';

const ReadComponent = () => {
  const cookieMember = getCookie('member');

  return (
    <div>
      <main className="mt-10 pb-4">
        <div className="mx-auto max-w-3xl px-2 sm:px-6 lg:max-w-7xl lg:px-8">
          <h1 className="sr-only">Main Page</h1>
          {/* Main 3 column grid */}
          <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
            <LeftComponent email={cookieMember.email} />
            <RightComponent email={cookieMember.email} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReadComponent;
