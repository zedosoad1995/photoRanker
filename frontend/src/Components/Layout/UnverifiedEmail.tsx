import { resendEmail } from "@/Services/auth";
import Button from "../Button";
import { useAuth } from "@/Contexts/auth";
import { useTimer } from "@/Hooks/useTimer";

export default function UnverifiedEmail() {
  const { user } = useAuth();
  const { seconds, resetTimer } = useTimer(60);

  const handleEmailResend = () => {
    resetTimer();
    resendEmail();
  };

  return (
    <div>
      <h1 className="text-xl font-bold">Verify Your Account</h1>
      <div className="mt-2 mb-4">
        <p className="mb-2">
          We sent a verification email to <b>{user?.email}</b>.
        </p>
        {seconds > 0 && (
          <p>
            If you do receive the email in the next <b>{seconds}</b> seconds, click the button
            below.
          </p>
        )}
        {seconds <= 0 && <p>If you didn't receive the email, click the button below.</p>}
      </div>
      <Button isFull={false} onClick={handleEmailResend} disabled={seconds > 0}>
        Resend Email
      </Button>
    </div>
  );
}
