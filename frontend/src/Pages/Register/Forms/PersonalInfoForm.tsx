import { COUNTRIES, ETHNICITY, GENDER } from "@shared/constants/user";
import Select from "@/Components/Select";
import DateField from "@/Components/DateField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateUserPersonalInfoSchema,
  ICreateUserPersonalInfo,
} from "@/Schemas/User/CreateUserPersonalInfo";
import { forwardRef, useImperativeHandle } from "react";
import { ICreateUser } from "@/Types/user";

type IData = Pick<ICreateUser, "countryOfOrigin" | "ethnicity" | "dateOfBirth" | "gender">;

type IProps = {
  updateData: (data: Partial<IData>) => void;
  onKeyDown: React.KeyboardEventHandler<HTMLInputElement>;
} & IData;

const PersonalInfoForm = forwardRef(
  (
    {
      updateData,
      countryOfOrigin,
      ethnicity,
      dateOfBirth,
      gender,
      onKeyDown: handleKeyDown,
    }: IProps,
    ref
  ) => {
    const {
      handleSubmit,
      setValue,
      formState: { isValid, errors },
    } = useForm<ICreateUserPersonalInfo>({
      resolver: zodResolver(CreateUserPersonalInfoSchema),
      defaultValues: {
        dateOfBirth,
      },
    });

    useImperativeHandle(ref, () => ({
      checkValid() {
        handleSubmit(() => {})();
        return isValid;
      },
    }));

    const handleChange = (label: keyof IData) => (value: string) => {
      updateData({ [label]: value });
    };

    const handleChangeDate = (value: string) => {
      setValue("dateOfBirth", value, { shouldValidate: true });
      updateData({ dateOfBirth: value });
    };

    return (
      <>
        <Select
          label="Country of Origin"
          options={COUNTRIES}
          value={countryOfOrigin}
          onChange={handleChange("countryOfOrigin")}
          onKeyDown={handleKeyDown}
        />
        <Select
          label="Ethnicity"
          options={ETHNICITY}
          value={ethnicity}
          onChange={handleChange("ethnicity")}
          onKeyDown={handleKeyDown}
        />
        <Select
          label="Gender"
          options={Object.values(GENDER)}
          value={gender}
          onChange={handleChange("gender")}
          onKeyDown={handleKeyDown}
        />
        <DateField
          label="Date of Birth"
          value={dateOfBirth}
          onChange={handleChangeDate}
          error={errors.dateOfBirth?.message}
          onKeyDown={handleKeyDown}
        />
      </>
    );
  }
);

export default PersonalInfoForm;
