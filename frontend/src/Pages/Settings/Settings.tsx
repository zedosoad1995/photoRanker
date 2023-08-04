import Button from "@/Components/Button";
import DeleteAccountModal from "./DeleteAccountModal";
import { useState } from "react";

export default function Settings() {
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);

  const handleOpenDeleteAccountModal = () => {
    setIsDeleteAccountModalOpen(true);
  };

  const handleCloseDeleteAccountModal = () => {
    setIsDeleteAccountModalOpen(false);
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
      <div className="text-3xl font-semibold text-center mb-10">Settings</div>
      <div className="max-w-sm mx-auto mt-5">
        <Button onClick={handleOpenDeleteAccountModal} style="danger">
          Delete Account
        </Button>
      </div>
    </>
  );
}
