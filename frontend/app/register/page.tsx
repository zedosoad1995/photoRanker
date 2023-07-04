"use client";

import Link from "@/components/Link";
import MainForm from "./Forms/MainForm";
import PersonalInfoForm from "./Forms/PersonalInfoForm";
import Button from "@/components/Button";
import { useRef, useState } from "react";

interface IFormRef {
  checkValid: () => boolean;
}

interface IData {
  email: string;
  name: string;
  password: string;
  ethnicity: string;
  countryOfOrigin: string;
  dateOfBirth: string;
}

const INITIAL_DATA = {
  email: "",
  name: "",
  password: "",
  ethnicity: "White",
  countryOfOrigin: "Portugal",
  dateOfBirth: "",
};

const forms = [MainForm, PersonalInfoForm];
const numForms = forms.length;

export default function Register() {
  const formRef = useRef<IFormRef>(null);

  const [data, setData] = useState(INITIAL_DATA);
  const [formStage, setFormStage] = useState(0);

  const Form = forms[formStage];

  const isLastForm = formStage >= numForms - 1;
  const nextButtonName = isLastForm ? "Sign Up" : "Next";

  const updateData = (data: Partial<IData>) => {
    setData((prev) => {
      return { ...prev, ...data };
    });
  };

  const handleNext = () => {
    const isValid = formRef.current?.checkValid();
    if (!isValid) return;

    if (isLastForm) {
      console.log(data);
    } else {
      setFormStage((val) => val + 1);
    }
  };

  const handleBack = () => {
    setFormStage((val) => val - 1);
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12">
        <h2 className="text-center text-2xl font-bold leading-9 tracking-tight">
          Sign up your account
        </h2>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-6">
            <Form ref={formRef} updateData={updateData} {...data} />

            <div className="flex gap-2">
              {formStage > 0 && <Button onClick={handleBack}>Back</Button>}
              <Button onClick={handleNext}>{nextButtonName}</Button>
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-light-text">
            Already have an account? <Link url="/login">Sign Up</Link>
          </p>
        </div>
      </div>
    </>
  );
}
