import Button from "@/Components/Button";
import Textfield from "@/Components/TextField";
import { HOME } from "@/Constants/routes";
import { forgotPassword } from "@/Services/auth";
import { PASSWORD_RESET_NOT_NEEDED } from "@shared/constants/errorCodes";
import axios from "axios";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const loginbtnRef = useRef<HTMLDivElement>(null);

  const [email, setEmail] = useState("");

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.currentTarget.value);
  };

  const handleSendResetCode = async () => {
    try {
      await forgotPassword(email);
      navigate(HOME);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.error === PASSWORD_RESET_NOT_NEEDED) {
          toast.error(
            "This account is using a login method, that does not require password (e.g Google or Facebook)"
          );
        }
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSendResetCode();
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12">
      <h2 className="text-center text-2xl font-bold leading-9 tracking-tight">Forgot Password</h2>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="space-y-6">
          <Textfield
            value={email}
            onChange={handleEmailChange}
            label="Email address"
            type="email"
            autocomplete="email"
            onKeyDown={handleKeyDown}
          />

          <div ref={loginbtnRef}>
            <Button onClick={handleSendResetCode}>Send Reset Code</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
