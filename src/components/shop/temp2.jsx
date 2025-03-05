<TabGroup className="lg:col-span-7">
  <div className="mx-auto  sm:px-8 sm:py-10 lg:max-w-7xl lg:px-8">
    <TabList className="-mb-px flex space-x-8">
      {/* First tab: 제보된 정보 */}
      <Tab
        onClick={() => handleTabChange('USER')}
        className="whitespace-nowrap border-b-2 border-transparent text-sm font-medium text-gray-700 hover:border-gray-300 hover:text-gray-800 data-[selected]:border-indigo-600 data-[selected]:text-indigo-600"
      >
        제보된 정보
      </Tab>
      {/* Second tab: 인증된 정보 */}
      <Tab
        onClick={() => handleTabChange('OWNER')}
        className="whitespace-nowrap border-b-2 border-transparent text-sm font-medium text-gray-700 hover:border-gray-300 hover:text-gray-800 data-[selected]:border-indigo-600 data-[selected]:text-indigo-600"
      >
        인증된 정보
      </Tab>
    </TabList>
  </div>
  <button onClick={checkShop}>shop log click</button>
  {/* TabPanels containing content for each tab */}
  <TabPanels as={Fragment}>
    {/* 첫 번째 탭: 제보된 정보 */}
    <TabPanel className="text-sm text-gray-500">
      <div className="lg:grid lg:grid-cols-7 lg:grid-rows-1 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
        {/* 제보된 정보 내용 시작 shop.shopUserDTO.  */}
        <div className="lg:col-span-7">
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
            {/* 왼쪽 컬럼 */}
            <div className="lg:col-span-1">
              <div className="lg:col-span-4 lg:row-end-1 pb-6">
                {/* <img
                            alt={shop.shopUserDTO.title}
                            src={shop.shopUserDTO.filename}
                            className="aspect-[4/3] w-full rounded-lg bg-gray-100 object-cover"
                          /> */}
              </div>
              {/*탭 bar */}
              <div className="mx-auto mt-16 w-full max-w-2xl lg:col-span-4 lg:mt-0 lg:max-w-none">
                <TabGroup>
                  <div className="border-b border-gray-200">
                    <TabList className="-mb-px flex space-x-8">
                      <Tab className="whitespace-nowrap border-b-2 border-transparent py-6 text-sm font-medium text-gray-700 hover:border-gray-300 hover:text-gray-800 data-[selected]:border-indigo-600 data-[selected]:text-indigo-600">
                        정보
                      </Tab>
                      <Tab className="whitespace-nowrap border-b-2 border-transparent py-6 text-sm font-medium text-gray-700 hover:border-gray-300 hover:text-gray-800 data-[selected]:border-indigo-600 data-[selected]:text-indigo-600">
                        메뉴
                      </Tab>
                      <Tab className="whitespace-nowrap border-b-2 border-transparent py-6 text-sm font-medium text-gray-700 hover:border-gray-300 hover:text-gray-800 data-[selected]:border-indigo-600 data-[selected]:text-indigo-600">
                        리뷰
                      </Tab>
                    </TabList>
                  </div>
                  <TabPanels as={Fragment}>
                    <TabPanel className="text-sm text-gray-500">
                      <h3 className="sr-only">상점 정보</h3>

                      <dl>영업일 : {shop.shopUserDTO.days} </dl>
                      <dl>
                        {' '}
                        영업시간 : {shop.shopUserDTO.openTime} ~{' '}
                        {shop.shopUserDTO.closeTime}
                      </dl>
                      <dl></dl>
                    </TabPanel>
                    <TabPanel className="text-sm text-gray-500">
                      <h3 className="sr-only">Frequently Asked Questions</h3>

                      <dl>
                        {shop.menuUserList.map((menuUser, idx) => (
                          <Fragment key={idx}>
                            <dt className="mt-10 font-medium text-gray-900">
                              {menuUser.menuName}
                            </dt>
                            <dd className="mt-2 text-sm/6 text-gray-500">
                              <p>{menuUser.price}</p>
                            </dd>
                          </Fragment>
                        ))}
                      </dl>
                    </TabPanel>
                    <TabPanel className="-mb-10">
                      <h3 className="sr-only">Customer Reviews</h3>

                      {reviews.featured.map((review, reviewIdx) => (
                        <div
                          key={review.id}
                          className="flex space-x-4 text-sm text-gray-500"
                        >
                          <div className="flex-none py-10">
                            <img
                              alt=""
                              src={review.avatarSrc}
                              className="size-10 rounded-full bg-gray-100"
                            />
                          </div>
                          <div
                            className={classNames(
                              reviewIdx === 0 ? '' : 'border-t border-gray-200',
                              'py-10'
                            )}
                          >
                            <h3 className="font-medium text-gray-900">
                              {review.author}
                            </h3>
                            <p>
                              <time dateTime={review.datetime}>
                                {review.date}
                              </time>
                            </p>

                            <div className="mt-4 flex items-center">
                              {[0, 1, 2, 3, 4].map((rating) => (
                                <StarIcon
                                  key={rating}
                                  aria-hidden="true"
                                  className={classNames(
                                    review.rating > rating
                                      ? 'text-yellow-400'
                                      : 'text-gray-300',
                                    'size-5 shrink-0'
                                  )}
                                />
                              ))}
                            </div>
                            <p className="sr-only">
                              {review.rating} out of 5 stars
                            </p>

                            <div
                              dangerouslySetInnerHTML={{
                                __html: review.content,
                              }}
                              className="mt-4 text-sm/6 text-gray-500"
                            />
                          </div>
                        </div>
                      ))}
                    </TabPanel>
                  </TabPanels>
                </TabGroup>
              </div>
            </div>

            {/* 오른쪽 컬럼 */}
            <div className="lg:col-span-1">
              {/* shop details */}
              <div className="mx-auto mt-14 max-w-2xl sm:mt-16 lg:col-span-3 lg:row-span-2 lg:row-end-2 lg:mt-0 lg:max-w-none">
                <div className="flex flex-col-reverse">
                  <div className="mt-4">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                      {shop.shopUserDTO.title} 상점제목
                    </h1>

                    <h2 id="information-heading" className="sr-only">
                      shop information
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                      최근 수정일 : {shop.shopUserDTO.updateDate} ( Updated
                      <time dateTime={shop.shopUserDTO.updateDate}></time>)
                    </p>
                  </div>

                  <div>
                    <h3 className="sr-only">Reviews</h3>
                    <div className="flex items-center">
                      {[0, 1, 2, 3, 4].map((rating) => (
                        <StarIcon
                          key={rating}
                          aria-hidden="true"
                          className={classNames(
                            reviews.average > rating
                              ? 'text-yellow-400'
                              : 'text-gray-300',
                            'size-5 shrink-0'
                          )}
                        />
                      ))}
                    </div>
                    <p className="sr-only">{reviews.average} out of 5 stars</p>
                  </div>
                </div>

                <p className="mt-6 text-gray-500">
                  {shop.shopUserDTO.location} 상점위치
                </p>
                {/**방문 인증 여부 */}
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                  <button
                    type="button"
                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                  >
                    방문 성공
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-50 px-8 py-3 text-base font-medium text-indigo-700 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                    onClick={handleVisitedFail}
                  >
                    방문 실패
                  </button>
                </div>

                <div className="mt-10 border-t border-gray-200 pt-10">
                  <h3 className="text-sm font-medium text-gray-900">
                    방문 인증 기록
                  </h3>
                  <div className="mt-4">
                    <ul
                      role="list"
                      className="list-disc space-y-1 pl-5 text-sm/6 text-gray-500 marker:text-gray-300"
                    >
                      {/*index : 각각의 항목의 인덱스 - 가격 정보 가져오기 위해서 추가 
                  떡볶이 : 2000원
                   */}
                      <li> 성공 {visitedSuccess}회</li>
                      <li> 실패 {visitedFail}회 </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-10 border-t border-gray-200 pt-6">
                  <h3 className="text-sm font-medium text-gray-900"></h3>
                  <p className="mt-4 text-sm text-gray-500">
                    <a className="font-medium text-indigo-600 hover:text-indigo-500"></a>
                  </p>
                  <div className=" flex flex-col items-center space-y-4">
                    <button
                      type="button"
                      onClick={handleClickAddMenu}
                      className="w-3/4 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                    >
                      메뉴 추가하기
                    </button>
                    <button
                      type="button"
                      className="w-3/4 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                    >
                      수정하기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* 제보된 정보 내용 끝 */}
      </div>
    </TabPanel>

    {/* 두 번째 탭: 인증된 정보 */}
    <TabPanel className="text-sm text-gray-500">
      <div className="lg:grid lg:grid-cols-7 lg:grid-rows-1 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
        {/* 인증된 정보 내용 시작*/}
        <div className="lg:col-span-7">
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
            {/* 왼쪽 컬럼 */}
            <div className="lg:col-span-1">
              {/* shop image */}
              <div className="lg:col-span-4 lg:row-end-1 pb-6">
                {/* <img
                            alt={shop.shopOwnerDTO.imageAlt}
                            src={shop.shopOwnerDTO.imageSrc}
                            className="aspect-[4/3] w-full rounded-lg bg-gray-100 object-cover"
                          /> */}
              </div>
              {/*탭 bar */}
              <div className="mx-auto mt-16 w-full max-w-2xl lg:col-span-4 lg:mt-0 lg:max-w-none">
                <TabGroup>
                  <div className="border-b border-gray-200">
                    <TabList className="-mb-px flex space-x-8">
                      <Tab className="whitespace-nowrap border-b-2 border-transparent py-6 text-sm font-medium text-gray-700 hover:border-gray-300 hover:text-gray-800 data-[selected]:border-indigo-600 data-[selected]:text-indigo-600">
                        메뉴
                      </Tab>
                      <Tab className="whitespace-nowrap border-b-2 border-transparent py-6 text-sm font-medium text-gray-700 hover:border-gray-300 hover:text-gray-800 data-[selected]:border-indigo-600 data-[selected]:text-indigo-600">
                        방문 리뷰
                      </Tab>
                    </TabList>
                  </div>
                  <TabPanels as={Fragment}>
                    <TabPanel className="text-sm text-gray-500">
                      <h3 className="sr-only">Frequently Asked Questions</h3>
                      <dl>영업일 : {shop.shopUserDTO.days}</dl>
                      <dl>
                        영업시간 : {shop.shopOwnerDTO.openTime} ~{' '}
                        {shop.shopOwnerDTO.closeTime}
                      </dl>
                      <dl></dl>
                      <dl>
                        {shop.menuOwnerList.map((menuOwner, idx) => (
                          <Fragment key={idx}>
                            <div className="flex-none py-10">
                              {/* <img
                                          alt="Preview"
                                          src={menuitem.menuFilename}
                                          className="size-10 rounded-full bg-gray-100"
                                        /> */}
                            </div>
                            <dt className="mt-10 font-medium text-gray-900">
                              {menuOwner.menuName}
                            </dt>
                            <dd className="mt-2 text-sm/6 text-gray-500">
                              <p>{menuOwner.price}</p>
                            </dd>
                          </Fragment>
                        ))}
                      </dl>
                    </TabPanel>
                    <TabPanel className="-mb-10">
                      <h3 className="sr-only">Customer Reviews</h3>

                      {reviews.featured.map((review, reviewIdx) => (
                        <div
                          key={review.id}
                          className="flex space-x-4 text-sm text-gray-500"
                        >
                          <div className="flex-none py-10">
                            <img
                              alt=""
                              src={review.avatarSrc}
                              className="size-10 rounded-full bg-gray-100"
                            />
                          </div>
                          <div
                            className={classNames(
                              reviewIdx === 0 ? '' : 'border-t border-gray-200',
                              'py-10'
                            )}
                          >
                            <h3 className="font-medium text-gray-900">
                              {review.author}
                            </h3>
                            <p>
                              <time dateTime={review.datetime}>
                                {review.date}
                              </time>
                            </p>

                            <div className="mt-4 flex items-center">
                              {[0, 1, 2, 3, 4].map((rating) => (
                                <StarIcon
                                  key={rating}
                                  aria-hidden="true"
                                  className={classNames(
                                    review.rating > rating
                                      ? 'text-yellow-400'
                                      : 'text-gray-300',
                                    'size-5 shrink-0'
                                  )}
                                />
                              ))}
                            </div>
                            <p className="sr-only">
                              {review.rating} out of 5 stars
                            </p>

                            <div
                              dangerouslySetInnerHTML={{
                                __html: review.content,
                              }}
                              className="mt-4 text-sm/6 text-gray-500"
                            />
                          </div>
                        </div>
                      ))}
                    </TabPanel>

                    <TabPanel className="pt-10">
                      <h3 className="sr-only">License</h3>

                      <div
                        dangerouslySetInnerHTML={{
                          __html: license.content,
                        }}
                        className="text-sm text-gray-500 [&>:first-child]:mt-0 [&_h4]:mt-5 [&_h4]:font-medium [&_h4]:text-gray-900 [&_li::marker]:text-gray-300 [&_li]:pl-2 [&_p]:my-2 [&_p]:text-sm/6 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_ul]:text-sm/6"
                      />
                    </TabPanel>
                  </TabPanels>
                </TabGroup>
              </div>
            </div>

            {/* 오른쪽 컬럼 */}
            <div className="lg:col-span-1">
              {/* shop details */}
              <div className="mx-auto mt-14 max-w-2xl sm:mt-16 lg:col-span-3 lg:row-span-2 lg:row-end-2 lg:mt-0 lg:max-w-none">
                <div className="flex flex-col-reverse">
                  <div className="mt-4">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                      {shop.shopOwnerDTO.title}
                    </h1>

                    <h2 id="information-heading" className="sr-only">
                      shop information
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                      최근 수정일 : {shop.shopOwnerDTO.updateDate} ( Updated
                      <time dateTime={shop.shopOwnerDTO.updateDate}></time>)
                    </p>
                  </div>

                  <div>
                    <h3 className="sr-only">Reviews</h3>
                    <div className="flex items-center">
                      {[0, 1, 2, 3, 4].map((rating) => (
                        <StarIcon
                          key={rating}
                          aria-hidden="true"
                          className={classNames(
                            reviews.average > rating
                              ? 'text-yellow-400'
                              : 'text-gray-300',
                            'size-5 shrink-0'
                          )}
                        />
                      ))}
                    </div>
                    <p className="sr-only">{reviews.average} out of 5 stars</p>
                  </div>
                </div>

                <p className="mt-6 text-gray-500">
                  점포 위치 {shop.shopOwnerDTO.location}
                </p>
                {/**방문 인증 여부 */}
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                  <button
                    type="button"
                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                    onClick={handleVisitedSuccess}
                  >
                    방문 성공
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-50 px-8 py-3 text-base font-medium text-indigo-700 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                    onClick={handleVisitedFail}
                  >
                    방문 실패
                  </button>
                </div>

                <div className="mt-10 border-t border-gray-200 pt-10">
                  <h3 className="text-sm font-medium text-gray-900">
                    방문 인증 기록
                  </h3>
                  <div className="mt-4">
                    <ul
                      role="list"
                      className="list-disc space-y-1 pl-5 text-sm/6 text-gray-500 marker:text-gray-300"
                    >
                      {/*index : 각각의 항목의 인덱스 - 가격 정보 가져오기 위해서 추가 
      떡볶이 : 2000원
      */}
                      <li> 성공 {visitedSuccess}회</li>
                      <li> 실패 {visitedFail}회 </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-10 border-t border-gray-200 pt-6">
                  <h3 className="text-sm font-medium text-gray-900"></h3>
                  <p className="mt-4 text-sm text-gray-500">
                    <a className="font-medium text-indigo-600 hover:text-indigo-500"></a>
                  </p>
                  <div className=" flex flex-col items-center space-y-4">
                    <button
                      type="button"
                      onClick={handleClickAddMenu}
                      className="w-3/4 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                    >
                      메뉴 추가하기
                    </button>
                    <button
                      type="button"
                      className="w-3/4 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                    >
                      수정하기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* 인증된 정보 내용 끝 */}
      </div>
    </TabPanel>
  </TabPanels>
</TabGroup>;
