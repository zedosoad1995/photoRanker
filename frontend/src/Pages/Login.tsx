import { useState, useRef, useEffect } from "react";
import Label from "@/Components/Label";
import Link from "@/Components/Link";
import Textfield from "@/Components/TextField";
import Button from "@/Components/Button";
import { FORGOT_PASSWORD, HOME, REGISTER } from "@/Constants/routes";
import { useAuth } from "@/Contexts/auth";
import { useNavigate } from "react-router-dom";
import GoogleButton from "@/Components/GoogleButton";
import FacebookButton from "@/Components/FacebookButton";
import { toast } from "react-hot-toast";
import axios from "axios";
import {
  BANNED_ACCOUNT,
  INVALID_CREDENTIALS,
  INVALID_LOGIN_METHOD_FACEBOOK,
  INVALID_LOGIN_METHOD_GOOGLE,
} from "@shared/constants/errorCodes";
import FullPageLoading from "@/Components/Loading/FullPageLoading";

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
    await login(email, password)
      .then(() => {
        navigate(HOME);
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          if (error.response?.data?.error === INVALID_CREDENTIALS) {
            toast.error("Invalid Credentials", {
              id: "invalid-credentials",
            });
          } else if (error.response?.data?.error === INVALID_LOGIN_METHOD_GOOGLE) {
            toast.error("You already have an account with google. Please log in with that method", {
              id: "must-login-google",
            });
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
          toast.error("Something went wrong", { id: "error-google-email" });
        }
      });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSignIn();
    }
  };

  useEffect(() => {
    if (Boolean(user)) {
      navigate(HOME);
    }
  }, [user]);

  if (Boolean(user)) {
    return <FullPageLoading />;
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12">
      <h2 className="text-center text-2xl font-bold leading-9 tracking-tight">Login</h2>
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

          <div>
            <div className="flex items-center justify-between">
              <Label name="Password" />
              <Link url={FORGOT_PASSWORD}>Forgot password?</Link>
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

          <div className="flex items-center">
            <div className="h-[1px] flex-grow bg-light-contour"></div>
            <div className="px-3 text-light-text">OR</div>
            <div className="h-[1px] flex-grow bg-light-contour"></div>
          </div>

          <GoogleButton />
          <FacebookButton />
        </div>

        <p className="mt-10 text-center text-sm text-light-text">
          Not a member? <Link url={REGISTER}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
