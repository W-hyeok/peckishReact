import { useState } from 'react';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/24/outline';
import useCustomMove from '../../hooks/useCustomMove';
import ResultModal from './ResultModal';
import { Result } from 'postcss';
import { deleteOne } from '../../api/shopApi';

const RemoveModal = ({
  title,
  content,
  callbackFn,
  shopId,
  infoType,
  shopDetailId,
}) => {
  const [open, setOpen] = useState(true);
  const [result, setResult] = useState(null);

  const { moveToMain } = useCustomMove();

  // 삭제 성공
  const handleShopDelete = () => {
    deleteOne(shopId, infoType, shopDetailId)
      .then((data) => {
        console.log('상점 제보 정보를 삭제합니다!!!');
        console.log(data);
        setResult('shopRemove');
      })
      .catch((err) => console.log('전송실패', err));
    console.log('모달 Close!!! -> 리뷰 삭제 확인 모달로 이동');
    console.log('리뷰삭제 확인 완료');
    setOpen(false);
    setResult(true);
  };

  // 삭제 취소
  const handleClose = () => {
    console.log('리뷰 삭제를 취소합니다');
    setOpen(false);
    if (callbackFn) {
      callbackFn();
    }
  };

  // 모달 닫기
  const closeModal = () => {
    setResult(null);
    moveToMain('/');
  };
  return (
    <>
      {result && (
        <ResultModal
          title={'상점 정보를 삭제'}
          content={'상점 정보 삭제 완료했습니다'}
          callbackFn={closeModal}
        />
      )}
      <Dialog open={open} onClose={handleClose} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div>
                <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-red-100">
                  <CheckIcon
                    aria-hidden="true"
                    className="size-6 text-red-400"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold text-gray-900"
                  >
                    {title}
                  </DialogTitle>
                  <div className="mt-3">
                    <p className="text-sm text-gray-500">{content}</p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  onClick={handleShopDelete}
                  className="inline-flex w-full justify-center bg-white text-red-500 px-6 py-3 text-xl font-semibold rounded-[8px] mt-8 border-[2px] border-red-500 hover:bg-red-500 hover:text-white"
                >
                  {/* className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                             > */}
                  확인
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="inline-flex w-full justify-center bg-white text-blue-600 px-6 py-3 text-xl font-semibold rounded-[8px] mt-8 border-[2px] border-blue-600 hover:bg-blue-600 hover:text-white"
                >
                  {/* className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                             > */}
                  취소
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default RemoveModal;
