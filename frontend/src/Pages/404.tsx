import Button from "@/Components/Button";
import Link from "@/Components/Link";
import PaymentModal from "@/Components/Payment/PaymentModal";
import { HOME } from "@/Constants/routes";
import { useState } from "react";

export const NotFoundPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <PaymentModal isOpen={isOpen} amount={5000} onClose={handleCloseModal} />
      <div className="flex items-center justify-center flex-col h-full">
        <div className="text-9xl">404</div>
        <div>Page not found</div>
        <div>
          Click <Link url={HOME}>here</Link> to return to the homepage.
        </div>
        <Button onClick={handleOpenModal} isFull={false}>
          Pay it
        </Button>
      </div>
    </>
  );
};
