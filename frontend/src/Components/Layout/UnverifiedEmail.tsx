import { resendEmail } from "@/Services/auth";
import Button from "../Button";

export default function UnverifiedEmail() {
  const handleEmailResend = () => {
    resendEmail();
  };

  return (
    <div>
      <h1 className="text-xl font-bold">Verify Your Account</h1>
      <div className="mt-2 mb-4">
        <p className="mb-2">Check your email to verify you account.</p>
        <p>
          If you didn't receive the email, click on the button below to resend the verification
          email.
        </p>
      </div>
      <Button isFull={false} onClick={handleEmailResend}>
        Resend Email
      </Button>
    </div>
  );
}
