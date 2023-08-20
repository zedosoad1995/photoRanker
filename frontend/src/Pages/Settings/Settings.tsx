import Button from "@/Components/Button";
import DeleteAccountModal from "./DeleteAccountModal";
import { useState } from "react";
import { deleteMe } from "@/Services/user";
import { useAuth } from "@/Contexts/auth";
import { isAdmin } from "@/Utils/role";
import ButtonGroup from "@/Components/ButtonGroup";
import MultipleRangeSlider from "@/Components/MultipleRangeSlider";

export default function Settings() {
  const { user, logout } = useAuth();

  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
  const [showMeGender, setShowMeGender] = useState("Both");

  const [left, setLeft] = useState(18);
  const [right, setRight] = useState(27);

  const handleOpenDeleteAccountModal = () => {
    setIsDeleteAccountModalOpen(true);
  };

  const handleCloseDeleteAccountModal = async () => {
    await deleteMe();
    await logout();

    setIsDeleteAccountModalOpen(false);
  };

  const handleShowMeGenderSelection = (selectedGender: string) => {
    setShowMeGender(selectedGender);
  };

  return (
    <>
      <DeleteAccountModal
        isOpen={isDeleteAccountModalOpen}
        onClose={() => {
          setIsDeleteAccountModalOpen(false);
        }}
        onDelete={handleCloseDeleteAccountModal}
      />
      <div className="text-3xl font-semibold text-center mb-5">Settings</div>
      <hr className="my-2" />
      <div className="font-bold">Show me</div>
      <div className="flex justify-between mt-3 mb-1">
        <div className="flex-[50%]">
          <div className="mb-1">Gender</div>
          <ButtonGroup
            selectedOption={showMeGender}
            options={["Male", "Female", "Both"]}
            onClick={handleShowMeGenderSelection}
          />
        </div>
        <div className="flex-[50%] flex flex-col">
          <div className="flex justify-between mb-3">
            <div>Age Range</div>
            <div>
              {left}-{right}
            </div>
          </div>
          <MultipleRangeSlider
            initialValue={[22, 31]}
            min={18}
            max={100}
            onChange={(leftVal: number, rightVal: number) => {
              setLeft(leftVal);
              setRight(rightVal);
            }}
          />
        </div>
      </div>
      <hr className="my-2" />
      <div className="max-w-sm mx-auto mt-5">
        <Button
          onClick={handleOpenDeleteAccountModal}
          disabled={user ? isAdmin(user.role) : true}
          style="danger"
        >
          Delete Account
        </Button>
      </div>
    </>
  );
}
