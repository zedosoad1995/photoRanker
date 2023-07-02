import Label from "../components/Label";
import Link from "../components/Link";
import Textfield from "../components/TextField";

export default function Register() {
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12">
        <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-normal-text">
          Sign up your account
        </h2>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action="#" method="POST">
            <Textfield label="Name" type="text" autocomplete="name" required />
            <Textfield
              label="Email address"
              type="email"
              autocomplete="email"
              required
            />
            <Textfield
              label="Password"
              type="password"
              autocomplete="new-password"
              required
            />

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Next
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-light-text">
            Already have an account? <Link url="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </>
  );
}
