import { FACEBOOK_CALLBACK_URI } from "@/Constants/uri";
import { FacebookLoginButton } from "react-social-login-buttons";

interface IFacebookButton {
  text?: string;
}

export default function FacebookButton({
  text = "Sign in with Facebook",
}: IFacebookButton) {
  const handleFacebookClick = () => {
    const facebookLoginUrl = `https://www.facebook.com/v4.0/dialog/oauth?client_id=${
      import.meta.env.VITE_FACEBOOK_AUTH_ID
    }&redirect_uri=${FACEBOOK_CALLBACK_URI}&response_type=code&display=popup&scope=email`;

    window.location.href = facebookLoginUrl;
  };

  return (
    <FacebookLoginButton
      onClick={handleFacebookClick}
      text={text}
      className="!h-10 !rounded-md !w-full !my-6 !mx-0 !text-sm !font-semibold !shadow-none"
    />
  );
}
