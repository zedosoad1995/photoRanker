import { Dialog } from "@headlessui/react";
import Button from "@/Components/Button";
import { useState } from "react";

interface IReportModal {
  isOpen: boolean;
  onClose: () => void;
  onReport: (seletedPics: [boolean, boolean]) => Promise<void>;
  pic1: string;
  pic2: string;
}

export default function ReportModal({
  isOpen,
  onClose: handleClose,
  onReport: handleReport,
  pic1,
  pic2,
}: IReportModal) {
  if (!isOpen) return null;

  const [isReportLoading, setIsReportLoading] = useState(false);
  const [isPic1Selected, setIsPic1Selected] = useState(false);
  const [isPic2Selected, setIsPic2Selected] = useState(false);

  const handleClickReportButton = async () => {
    setIsReportLoading(true);
    await handleReport([isPic1Selected, isPic2Selected]);
    alteredHandleClose();
    setIsReportLoading(false);
  };

  const alteredHandleClose = () => {
    handleClose();
    setIsPic1Selected(false);
    setIsPic2Selected(false);
  };

  return (
    <Dialog
      as="div"
      className="fixed inset-0 flex items-center justify-center mx-5 z-50"
      open={isOpen}
      onClose={alteredHandleClose}
    >
      <div className="fixed inset-0 bg-black/50 cursor-pointer" />
      <Dialog.Panel className="bg-white p-6 w-[500px] rounded-xl z-10 max-h-[80vh] overflow-y-auto">
        <div className="font-bold text-lg">Report Pictures</div>
        <div className="mt-4">Select the pictures you want to report:</div>
        <div className="flex justify-between mt-4">
          <img
            src={pic1}
            onClick={() => setIsPic1Selected((val) => !val)}
            className={`w-[48%] cursor-pointer outline-4 outline-primary ${
              isPic1Selected ? "outline-primary outline" : "hover:outline-primary/50 hover:outline"
            }`}
          />
          <img
            src={pic2}
            onClick={() => setIsPic2Selected((val) => !val)}
            className={`w-[48%] cursor-pointer outline-4 outline-primary ${
              isPic2Selected ? "outline-primary outline" : "hover:outline-primary/50 hover:outline"
            }`}
          />
        </div>
        <div className="flex justify-end gap-2 mt-8">
          <Button onClick={alteredHandleClose} isFull={false} style="none">
            Cancel
          </Button>
          <Button
            onClick={handleClickReportButton}
            isFull={false}
            style="danger"
            variant="solid"
            disabled={!isPic1Selected && !isPic2Selected}
            isLoading={isReportLoading}
          >
            Report
          </Button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
