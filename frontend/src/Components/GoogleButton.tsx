import { useAuth } from "@/Contexts/auth";
import { VOTE } from "@/Constants/routes";
import { useNavigate } from "react-router-dom";
import { GoogleLoginButton } from "react-social-login-buttons";
import { toast } from "react-hot-toast";
import axios from "axios";
import {
  BANNED_ACCOUNT,
  INVALID_LOGIN_METHOD_EMAIL,
  INVALID_LOGIN_METHOD_FACEBOOK,
} from "@shared/constants/errorCodes";

interface IGoogleButton {
  text?: string;
}

export default function GoogleButton({ text = "Sign in with Google" }: IGoogleButton) {
  const navigate = useNavigate();
  const { loginGoogle } = useAuth();

  const handleGoogleLoginClick = () => {
    const client = window?.google?.accounts?.oauth2.initCodeClient({
      client_id: import.meta.env.VITE_GOOGLE_AUTH_ID,
      scope: "openid profile email",
      callback: async (response) => {
        try {
          await loginGoogle(response.code);
          navigate(VOTE);
        } catch (error) {
          if (axios.isAxiosError(error)) {
            if (error.response?.data?.error === INVALID_LOGIN_METHOD_EMAIL) {
              toast.error(
                "You already have an account with this email. Please log in with that method",
                { id: "must-login-email" }
              );
            } else if (error.response?.data?.error === INVALID_LOGIN_METHOD_FACEBOOK) {
              toast.error(
                "You already have an account with facebook. Please log in with that method",
                {
                  id: "must-login-facebook",
                }
              );
            } else if (error.response?.data?.error === BANNED_ACCOUNT) {
              toast.error("Account has been banned", {
                id: "banned-account",
              });
            }
          } else {
            toast.error("Something went wrong", { id: "error-google-login" });
          }
        }
      },
      error_callback: (error) => {
        console.error(error);
      },
      ux_mode: "popup",
    });
    client.requestCode();
  };

  return (
    <GoogleLoginButton
      onClick={handleGoogleLoginClick}
      text={text}
      className="!h-10 !rounded-md !w-full !my-0 !mx-0 !text-sm !font-semibold !shadow-none"
      style={{ border: "1px solid rgb(209,213,219)" }}
    />
  );
}
