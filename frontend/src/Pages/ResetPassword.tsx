import Button from "@/Components/Button";
import Textfield from "@/Components/TextField";
import { HOME } from "@/Constants/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  IResetPassword,
  ResetPasswordSchema,
} from "@/Schemas/User/ResetPassword";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();
  let { token } = useParams();

  const [password, setPassword] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IResetPassword>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.currentTarget.value);
  };

  const handleSendResetCode = async ({ password }: IResetPassword) => {
    console.log(password, token);

    //await forgotPassword(email);
    navigate(HOME);
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12">
      <h2 className="text-center text-2xl font-bold leading-9 tracking-tight">
        Reset Password
      </h2>
      <form
        onSubmit={handleSubmit(handleSendResetCode)}
        className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm"
      >
        <div className="space-y-6">
          <Textfield
            value={password}
            register={register("password", { onChange: handlePasswordChange })}
            label="New Password"
            type="password"
            autocomplete="new-password"
            error={errors.password?.message}
          />

          <Button>Reset Password</Button>
        </div>
      </form>
    </div>
  );
}
