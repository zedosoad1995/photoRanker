import Button from "@/Components/Button";
import DeleteAccountModal from "./DeleteAccountModal";
import { useState } from "react";
import { deleteMe } from "@/Services/user";
import { useAuth } from "@/Contexts/auth";
import { isAdmin } from "@/Utils/role";

export default function Settings() {
  const { user, logout } = useAuth();

  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);

  const handleOpenDeleteAccountModal = () => {
    setIsDeleteAccountModalOpen(true);
  };

  const handleCloseDeleteAccountModal = async () => {
    await deleteMe();
    await logout();

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
