import MenuComponent from '../../components/shop/MenuComponent';

const MainPage = () => {
  return (
    <main className="mt-6 pb-6">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        {/* Main 3 column grid */}
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
          {/* Left column */}
          <div className="grid grid-cols-1 gap-4 lg:col-span-2">
            <section aria-labelledby="section-1-title">
              <h2 id="section-1-title" className="sr-only">
                홈/메뉴
              </h2>
              <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="p-6">{/* 지도 들어갈 부분 */}</div>
              </div>
            </section>
          </div>

          {/* right column */}
          <div className="grid grid-cols-1 gap-4">
            <section aria-labelledby="section-2-title">
              <h2 id="section-2-title" className="sr-only">
                댓글
              </h2>
              <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="p-6">
                  {/* Your content */}
                  {/* <ListComponent /> */}
                  <MenuComponent />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainPage;
