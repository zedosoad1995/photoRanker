import Link from "@/components/Link";
import MainForm from "./Forms/MainForm";
import Button from "@/components/Button";
import PersonalInfoForm from "./Forms/PersonalInfoForm";

export default function Register() {
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12">
        <h2 className="text-center text-2xl font-bold leading-9 tracking-tight">
          Sign up your account
        </h2>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action="#" method="POST">
            <PersonalInfoForm />

            <Button>Next</Button>
          </form>

          <p className="mt-10 text-center text-sm text-light-text">
            Already have an account? <Link url="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </>
  );
}
