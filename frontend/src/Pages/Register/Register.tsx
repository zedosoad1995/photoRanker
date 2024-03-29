import Link from "@/Components/Link";
import MainForm from "./Forms/MainForm";
import PersonalInfoForm from "./Forms/PersonalInfoForm";
import Button from "@/Components/Button";
import { useRef, useState } from "react";
import { register } from "@/Services/auth";
import { LOGIN, VOTE } from "@/Constants/routes";
import { useNavigate } from "react-router-dom";
import _ from "underscore";
import GoogleButton from "@/Components/GoogleButton";
import { useAuth } from "@/Contexts/auth";
import { ICreateUser } from "@/Types/user";
import { BANNED_ACCOUNT } from "@shared/constants/errorCodes";
import { toast } from "react-hot-toast";
import axios from "axios";

interface IFormRef {
  checkValid: () => Promise<boolean>;
}

const INITIAL_DATA: ICreateUser = {
  email: "",
  name: "",
  password: "",
  ethnicity: "",
  countryOfOrigin: "",
  gender: "",
  dateOfBirth: "",
};

const forms = [MainForm, PersonalInfoForm];
const numForms = forms.length;

export default function Register() {
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  const formRef = useRef<IFormRef>(null);

  const [data, setData] = useState(INITIAL_DATA);
  const [formStage, setFormStage] = useState(0);

  const Form = forms[formStage];

  const isLastForm = formStage >= numForms - 1;
  const nextButtonLabel = isLastForm ? "Sign Up" : "Next";

  const updateData = (data: Partial<ICreateUser>) => {
    setData((prev) => {
      return { ...prev, ...data };
    });
  };

  const handleNext = async () => {
    const isValid = await formRef.current?.checkValid();
    if (!isValid) return;

    if (isLastForm) {
      try {
        await register(data);
        await updateUser();

        navigate(VOTE);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.data?.error === BANNED_ACCOUNT) {
            toast.error("Account has been banned", {
              id: "banned-account",
            });
          }
        }
      }
    } else {
      setFormStage((val) => val + 1);
    }
  };

  const handleBack = () => {
    setFormStage((val) => val - 1);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleNext();
    }
  };

  return (
    <>
      <div className="flex flex-1 flex-col justify-center px-6 py-8">
        <h2 className="text-center text-2xl font-bold leading-9 tracking-tight">Register</h2>
        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="flex gap-4 flex-col">
            <Form ref={formRef} updateData={updateData} onKeyDown={handleKeyDown} {...data} />

            <div className="flex gap-2 mt-1">
              {formStage > 0 && <Button onClick={handleBack}>Back</Button>}
              <Button onClick={handleNext}>{nextButtonLabel}</Button>
            </div>

            {formStage === 0 && (
              <div className="flex items-center">
                <div className="h-[1px] flex-grow bg-light-contour"></div>
                <div className="px-3 text-light-text">OR</div>
                <div className="h-[1px] flex-grow bg-light-contour"></div>
              </div>
            )}
            {formStage === 0 && <GoogleButton text="Sign up with Google" />}
          </div>

          <p className="mt-6 text-center text-sm text-light-text">
            Already have an account? <Link url={LOGIN}>Sign In</Link>
          </p>
        </div>
      </div>
    </>
  );
}
