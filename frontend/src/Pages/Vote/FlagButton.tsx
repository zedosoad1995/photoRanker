import Button from "@/Components/Button";
import ReportModal from "./ReportModal";
import { useState } from "react";
import { FlagIcon } from "@heroicons/react/24/outline";
import { createReport } from "@/Services/report";
import { toast } from "react-hot-toast";
import { IMatch } from "@/Types/match";

interface IFlagButton {
  pic1: string;
  pic2: string;
  match: IMatch;
  onReport: () => void;
}

export const FlagButton = ({ pic1, pic2, match, onReport: handleReportParent }: IFlagButton) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClickReport = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleReport = async (seletedPics: [boolean, boolean]) => {
    if (!match) return;

    try {
      for (let i = 0; i < seletedPics.length; i++) {
        if (seletedPics[i]) {
          await createReport(match.pictures[i].id);
        }
      }

      setIsModalOpen(false);
      handleReportParent();

      toast.success("Report successful. We will take a look");
    } catch (error) {
      toast.error("Something went wrong", { id: "report" });
    }
  };

  return (
    <>
      <ReportModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        pic1={pic1}
        pic2={pic2}
        onReport={handleReport}
      />
      <div className="w-fit">
        <Button style="danger" variant="outline" onClick={handleClickReport}>
          <FlagIcon className="w-6 h-6" />
        </Button>
      </div>
    </>
  );
};
