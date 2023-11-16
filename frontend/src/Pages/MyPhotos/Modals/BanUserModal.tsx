import { Dialog } from "@headlessui/react";
import Button from "@/Components/Button";
import { banUser, getUser } from "@/Services/user";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface IBanUserModal {
  isOpen: boolean;
  onClose: () => void;
  userIdToBan: string | null;
  getPictures: () => Promise<void> | undefined;
}

export default function BanUserModal({
  isOpen,
  onClose: handleClose,
  userIdToBan,
  getPictures,
}: IBanUserModal) {
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!userIdToBan) return;

    getUser(userIdToBan).then(({ user }) => {
      setEmail(user.email);
    });
  }, [userIdToBan]);

  const handleBanUser = async () => {
    if (!userIdToBan) return;

    try {
      await banUser(userIdToBan);
      toast.success(`User ${email} has been banned`, { id: "ban-user-success" });
      getPictures();
      handleClose();
    } catch (error) {
      toast.error("Something went wrong", { id: "ban-user-fail" });
    }
  };

  return (
    <Dialog
      as="div"
      className="fixed inset-0 flex items-center justify-center mx-5"
      open={isOpen}
      onClose={handleClose}
    >
      <div className="fixed inset-0 bg-black/50 cursor-pointer" />
      <Dialog.Panel className="bg-white p-6 w-[500px] rounded-xl z-30">
        <div className="font-bold text-lg">Ban User</div>
        <div className="mt-4">
          Are you sure you want to ban user <b>{email}</b>?
        </div>
        <div className="flex justify-end gap-2 mt-8">
          <Button onClick={handleClose} isFull={false} style="none">
            Cancel
          </Button>
          <Button onClick={handleBanUser} isFull={false} style="danger">
            Ban
          </Button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
