import { useState, useRef, useEffect } from "react";
import Label from "@/Components/Label";
import Link from "@/Components/Link";
import Textfield from "@/Components/TextField";
import Button from "@/Components/Button";
import { HOME, REGISTER } from "@/constants/routes";
import { useAuth } from "@/Contexts/auth";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

export default function SignIn() {
  const navigate = useNavigate();

  const { user, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginBtnWidth, setLoginBtnWidth] = useState("");
  const loginBtnRef = useRef<HTMLDivElement | null>(null);

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

  if (Boolean(user)) {
    navigate(HOME);
  }

  useEffect(() => {
    const handleResize = () => {
      if (loginBtnRef.current) {
        setLoginBtnWidth(String(loginBtnRef.current.offsetWidth));
      }
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

            <div ref={loginBtnRef}>
              <Button type="submit" onClick={handleSignIn}>
                Sign in
              </Button>
            </div>

            <GoogleLogin onSuccess={console.log} onError={console.error} width={loginBtnWidth} />
          </div>

          <p className="mt-10 text-center text-sm text-light-text">
            Not a member? <Link url={REGISTER}>Sign Up</Link>
          </p>
        </div>
      </div>
    </>
  );
}
