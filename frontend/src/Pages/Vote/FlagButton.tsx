import Button from "@/Components/Button";
import { FlagIcon } from "@heroicons/react/20/solid";
import ReportModal from "./ReportModal";

interface IFlagButton {
  pic1: string;
  pic2: string;
}

export const FlagButton = ({ pic1, pic2 }: IFlagButton) => {
  const handleClickReport = () => {};

  return (
    <>
      <ReportModal isOpen={true} onClose={() => {}} onDelete={() => {}} pic1={pic1} pic2={pic2} />
      <div className="w-fit">
        <Button style="danger" variant="outline" onClick={handleClickReport}>
          <FlagIcon className="w-6 h-6" />
        </Button>
      </div>
    </>
  );
};
