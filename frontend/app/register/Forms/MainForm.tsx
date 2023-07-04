import Textfield from "@/components/TextField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ICreateUserMain,
  createUserMainSchema,
} from "@/schemas/user/createUserMain";
import { forwardRef, useImperativeHandle } from "react";

interface IProps {
  updateData: (data: Partial<ICreateUserMain>) => void;
  name: string;
  email: string;
  password: string;
}

const MainForm = forwardRef(
  ({ updateData, name, email, password }: IProps, ref) => {
    const {
      register,
      handleSubmit,
      formState: { isValid, errors },
    } = useForm<ICreateUserMain>({
      resolver: zodResolver(createUserMainSchema),
      defaultValues: {
        name,
        email,
        password,
      },
    });

    useImperativeHandle(ref, () => ({
      checkValid() {
        handleSubmit(() => {})();
        return isValid;
      },
    }));

    const handleChange =
      (label: keyof ICreateUserMain) =>
      (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        updateData({ [label]: e.target.value });
      };

    return (
      <>
        <Textfield
          label="Name"
          type="text"
          autocomplete="name"
          register={register("name", {
            onChange: handleChange("name"),
          })}
          error={errors.name?.message}
        />
        <Textfield
          label="Email address"
          type="email"
          autocomplete="email"
          register={register("email", {
            onChange: handleChange("email"),
          })}
          error={errors.email?.message}
        />
        <Textfield
          label="Password"
          type="password"
          autocomplete="new-password"
          register={register("password", {
            onChange: handleChange("password"),
          })}
          error={errors.password?.message}
        />
      </>
    );
  }
);

export default MainForm;
