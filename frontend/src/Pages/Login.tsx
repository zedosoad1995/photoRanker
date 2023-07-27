import { useState, useRef } from "react";
import Label from "@/Components/Label";
import Link from "@/Components/Link";
import Textfield from "@/Components/TextField";
import Button from "@/Components/Button";
import { HOME, REGISTER } from "@/constants/routes";
import { useAuth } from "@/Contexts/auth";
import { useNavigate } from "react-router-dom";
import { loginGoogle } from "@/Services/auth";
import GoogleButton from "@/Components/GoogleButton";

export default function SignIn() {
  const navigate = useNavigate();
  const loginbtnRef = useRef<HTMLDivElement>(null);

  const { user, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.currentTarget.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.currentTarget.value);
  };

  const handleSignIn = async () => {
    await login(email, password);
    navigate(HOME);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSignIn();
    }
  };

  const handleGoogleLoginClick = () => {
    const client = window?.google?.accounts?.oauth2.initCodeClient({
      client_id: import.meta.env.VITE_GOOGLE_AUTH_ID,
      scope: "openid profile email",
      callback: (response) => {
        loginGoogle(response.code);
      },
      error_callback: (error) => {
        console.error(error);
      },
      ux_mode: "popup",
    });
    client.requestCode();
  };

  if (Boolean(user)) {
    navigate(HOME);
  }

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12">
        <h2 className="text-center text-2xl font-bold leading-9 tracking-tight">
          Sign in to your account
        </h2>
        <div className="mt-10 mx-auto w-full max-w-sm">
          <div className="space-y-6">
            <Textfield
              value={email}
              onChange={handleEmailChange}
              label="Email address"
              type="email"
              autocomplete="email"
              onKeyDown={handleKeyDown}
            />

            <div>
              <div className="flex items-center justify-between">
                <Label name="Password" />
                <Link url="#">Forgot password?</Link>
              </div>
              <Textfield
                value={password}
                onChange={handlePasswordChange}
                type="password"
                autocomplete="current-password"
                onKeyDown={handleKeyDown}
              />
            </div>

            <div ref={loginbtnRef}>
              <Button type="submit" onClick={handleSignIn}>
                Sign in
              </Button>
            </div>

            <GoogleButton onClick={handleGoogleLoginClick} />
          </div>

          <p className="mt-10 text-center text-sm text-light-text">
            Not a member? <Link url={REGISTER}>Sign Up</Link>
          </p>
        </div>
      </div>
    </>
  );
}
