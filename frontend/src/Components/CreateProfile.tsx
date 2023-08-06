import Button from "@/Components/Button";
import { useRef, useState } from "react";
import { createProfile } from "@/Services/auth";
import { GENDER } from "@shared/constants/user";
import _ from "underscore";
import PersonalInfoForm from "@/Pages/Register/Forms/PersonalInfoForm";
import { useAuth } from "@/Contexts/auth";

interface IFormRef {
  checkValid: () => Promise<boolean>;
}

interface IData {
  ethnicity: string;
  countryOfOrigin: string;
  gender: string;
  dateOfBirth: string;
}

const INITIAL_DATA: IData = {
  ethnicity: "White",
  countryOfOrigin: "Portugal",
  gender: GENDER.Male,
  dateOfBirth: "",
};

const forms = [PersonalInfoForm];
const numForms = forms.length;

export default function CreateProfile() {
  const formRef = useRef<IFormRef>(null);

  const { user, updateUser } = useAuth();

  const [data, setData] = useState(INITIAL_DATA);
  const [formStage, setFormStage] = useState(0);

  const Form = forms[formStage];

  const isLastForm = formStage >= numForms - 1;
  const nextButtonLabel = isLastForm ? "Create Profile" : "Next";

  const updateData = (data: Partial<IData>) => {
    setData((prev) => {
      return { ...prev, ...data };
    });
  };

  const handleNext = async () => {
    const isValid = await formRef.current?.checkValid();
    if (!isValid) return;

    if (isLastForm) {
      if (user) {
        await createProfile(user.id, data);
        updateUser();
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
      <h2 className="text-center text-2xl font-bold leading-9 tracking-tight">Create Profile</h2>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="space-y-6">
          <Form ref={formRef} updateData={updateData} onKeyDown={handleKeyDown} {...data} />

          <div className="flex gap-2">
            {formStage > 0 && <Button onClick={handleBack}>Back</Button>}
            <Button onClick={handleNext}>{nextButtonLabel}</Button>
          </div>
        </div>
      </div>
    </>
  );
}
