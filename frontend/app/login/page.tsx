"use client";

import Label from "@/components/Label";
import Link from "@/components/Link";
import Textfield from "@/components/TextField";
import Button from "@/components/Button";
import { REGISTER } from "@/constants/routes";
import { login } from "@/services/auth";
import { useState } from "react";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.currentTarget.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.currentTarget.value);
  };

  const handleSignIn = () => {
    login({ email, password });
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12">
        <h2 className="text-center text-2xl font-bold leading-9 tracking-tight">
          Sign in to your account
        </h2>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-6">
            <Textfield
              value={email}
              onChange={handleEmailChange}
              label="Email address"
              type="email"
              autocomplete="email"
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
              />
            </div>

            <Button type="submit" onClick={handleSignIn}>
              Sign in
            </Button>
          </div>

          <p className="mt-10 text-center text-sm text-light-text">
            Not a member? <Link url={REGISTER}>Sign Up</Link>
          </p>
        </div>
      </div>
    </>
  );
}
