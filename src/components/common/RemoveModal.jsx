import { useState } from 'react';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/24/outline';
import useCustomMove from '../../hooks/useCustomMove';

const RemoveModal = ({ title, content, callbackFn }) => {
  const [open, setOpen] = useState(true);
  const [result, setResult] = useState();

  const { moveToShop } = useCustomMove();
  const handleClose = () => {
    console.log('모달 Close!!! -> 리뷰 삭제 확인 모달로 이동');
    setOpen(false);
    if (callbackFn) {
      callbackFn();
    }
    console.log('리뷰삭제 상세페이지로 이동');
    moveToShop(shopId);
    setResult(finishRemoveShop);
  };

  return (
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
              <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-yellow-100">
                <CheckIcon
                  aria-hidden="true"
                  className="size-6 text-yellow-400"
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
                onClick={handleClose}
                className="inline-flex w-full justify-center bg-white text-yellow-400 text-xl font-semibold rounded-[8px] px-3 py-2 mt-6 border-[2px] border-yellow-400 hover:bg-yellow-400 hover:text-white"
              >
                {/* className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                             > */}
                Close
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default RemoveModal;
