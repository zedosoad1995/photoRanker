import Button from "@/Components/Button";
import Textfield from "@/Components/TextField";
import { HOME } from "@/Constants/routes";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const loginbtnRef = useRef<HTMLDivElement>(null);

  const [email, setEmail] = useState("");

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.currentTarget.value);
  };

  const handleSendResetCode = async () => {
    navigate(HOME);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSendResetCode();
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12">
      <h2 className="text-center text-2xl font-bold leading-9 tracking-tight">
        Forgot Password
      </h2>
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
