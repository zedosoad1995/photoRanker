import { FacebookLoginButton } from "react-social-login-buttons";

export default function FacebookButton() {
  const handleFacebookClick = () => {
    const redirectUri = "http://localhost:3000/auth/facebook";

    const facebookLoginUrl = `https://www.facebook.com/v4.0/dialog/oauth?client_id=${
      import.meta.env.VITE_FACEBOOK_AUTH_ID
    }&redirect_uri=${redirectUri}&response_type=code&display=popup&auth_type=rerequest`;

    window.location.href = facebookLoginUrl;
  };

  return (
    <FacebookLoginButton
      onClick={handleFacebookClick}
      className="!h-10 !rounded-md !w-full !my-6 !mx-0 !text-sm !font-semibold !shadow-none"
    />
  );
}
