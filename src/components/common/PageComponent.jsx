// Pagination
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from '@heroicons/react/20/solid';

const PageComponent = ({ serverData, move }) => {
  return (
    <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
      <div className="-mt-px flex w-0 flex-1">
        {serverData.prev ? (
          <div
            onClick={() => move({ page: serverData.prevPage })}
            className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
          >
            <ArrowLongLeftIcon
              aria-hidden="true"
              className="mr-3 size-5 text-gray-400"
            />
            Previous
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="hidden md:-mt-px md:flex">
        {serverData.pageNumList.map((pageNum) => (
          <div
            key={pageNum}
            onClick={() => move({ page: pageNum })}
            className={`inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium 
              ${
                serverData.current === pageNum
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            {pageNum}
          </div>
        ))}
      </div>
      <div className="-mt-px flex w-0 flex-1 justify-end">
        {serverData.next ? (
          <div
            onClick={() => move({ page: serverData.nextPage })}
            className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
          >
            Next
            <ArrowLongRightIcon
              aria-hidden="true"
              className="ml-3 size-5 text-gray-400"
            />
          </div>
        ) : (
          <></>
        )}
      </div>
    </nav>
  );
};

export default PageComponent;
