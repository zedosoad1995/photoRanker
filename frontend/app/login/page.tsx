import Label from "@/components/Label";
import Link from "@/components/Link";
import Textfield from "@/components/TextField";
import Button from "@/components/Button";
import { REGISTER } from "@/constants/routes";

export default function SignIn() {
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12">
        <h2 className="text-center text-2xl font-bold leading-9 tracking-tight">
          Sign in to your account
        </h2>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action="#" method="POST">
            <Textfield
              label="Email address"
              type="email"
              autocomplete="email"
              required
            />

            <div>
              <div className="flex items-center justify-between">
                <Label name="Password" />
                <Link url="#">Forgot password?</Link>
              </div>
              <Textfield
                type="password"
                autocomplete="current-password"
                required
              />
            </div>

            <Button type="submit">Sign in</Button>
          </form>

          <p className="mt-10 text-center text-sm text-light-text">
            Not a member? <Link url={REGISTER}>Sign Up</Link>
          </p>
        </div>
      </div>
    </>
  );
}
