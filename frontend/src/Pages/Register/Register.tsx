import Link from "@/Components/Link";
import MainForm from "./Forms/MainForm";
import PersonalInfoForm from "./Forms/PersonalInfoForm";
import Button from "@/Components/Button";
import { useRef, useState } from "react";
import { createProfile, register } from "@/Services/auth";
import { HOME, LOGIN } from "@/constants/routes";
import { useNavigate } from "react-router-dom";
import { GENDER } from "../../../../backend/src/constants/user";
import _ from "underscore";
import { getLoggedUser, setLoggedUser } from "@/Utils/user";
import GoogleButton from "@/Components/GoogleButton";

interface IFormRef {
  checkValid: () => Promise<boolean>;
}

interface IData {
  email: string;
  name: string;
  password: string;
  ethnicity: string;
  countryOfOrigin: string;
  gender: string;
  dateOfBirth: string;
}

const INITIAL_DATA: IData = {
  email: "",
  name: "",
  password: "",
  ethnicity: "White",
  countryOfOrigin: "Portugal",
  gender: GENDER.Male,
  dateOfBirth: "",
};

const forms = [MainForm, PersonalInfoForm];
const numForms = forms.length;

export default function Register() {
  const navigate = useNavigate();

  const formRef = useRef<IFormRef>(null);

  const loggedUser = getLoggedUser();

  const incompleteProfile = loggedUser && loggedUser.isProfileCompleted === false;

  const [data, setData] = useState(INITIAL_DATA);
  const [formStage, setFormStage] = useState(() => (incompleteProfile ? 1 : 0));

  const Form = forms[formStage];

  const isLastForm = formStage >= numForms - 1;
  const nextButtonLabel = isLastForm ? "Sign Up" : "Next";

  const updateData = (data: Partial<IData>) => {
    setData((prev) => {
      return { ...prev, ...data };
    });
  };

  const handleNext = async () => {
    const isValid = await formRef.current?.checkValid();
    if (!isValid) return;

    if (isLastForm) {
      if (incompleteProfile) {
        const { user } = await createProfile(
          loggedUser.id,
          _.omit(data, ["email", "password", "name"])
        );
        setLoggedUser(user);
        return navigate(HOME);
      } else {
        await register(data);
      }

      navigate(LOGIN);
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
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12">
        <h2 className="text-center text-2xl font-bold leading-9 tracking-tight">
          Sign up your account
        </h2>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-6">
            <Form ref={formRef} updateData={updateData} onKeyDown={handleKeyDown} {...data} />

            <div className="flex gap-2">
              {formStage > 0 && !incompleteProfile && <Button onClick={handleBack}>Back</Button>}
              <Button onClick={handleNext}>{nextButtonLabel}</Button>
            </div>

            {formStage === 0 && <GoogleButton />}
          </div>

          <p className="mt-10 text-center text-sm text-light-text">
            Already have an account? <Link url={LOGIN}>Sign In</Link>
          </p>
        </div>
      </div>
    </>
  );
}
