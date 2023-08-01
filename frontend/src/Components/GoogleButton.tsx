import { useAuth } from "@/Contexts/auth";
import { HOME } from "@/Constants/routes";
import { useNavigate } from "react-router-dom";
import { GoogleLoginButton } from "react-social-login-buttons";

interface IGoogleButton {
  text?: string;
}

export default function GoogleButton({
  text = "Sign in with Google",
}: IGoogleButton) {
  const navigate = useNavigate();
  const { loginGoogle } = useAuth();

  const handleGoogleLoginClick = () => {
    const client = window?.google?.accounts?.oauth2.initCodeClient({
      client_id: import.meta.env.VITE_GOOGLE_AUTH_ID,
      scope: "openid profile email",
      callback: async (response) => {
        await loginGoogle(response.code);
        navigate(HOME);
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
      className="!h-10 !rounded-md !w-full !my-6 !mx-0 !text-sm !font-semibold !shadow-none"
      style={{ border: "1px solid rgb(209,213,219)" }}
    />
  );
}
