import { COUNTRIES, ETHNICITY } from "../../../../../backend/src/constants/user";
import Select from "@/Components/Select";
import DateField from "@/Components/DateField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateUserPersonalInfoSchema,
  ICreateUserPersonalInfo,
} from "@/Schemas/User/createUserPersonalInfo";
import { forwardRef, useImperativeHandle } from "react";

interface IData {
  ethnicity: string;
  countryOfOrigin: string;
  dateOfBirth: string;
  onKeyDown: React.KeyboardEventHandler<HTMLInputElement>;
}

type IProps = {
  updateData: (data: Partial<IData>) => void;
} & IData;

const PersonalInfoForm = forwardRef(
  (
    { updateData, countryOfOrigin, ethnicity, dateOfBirth, onKeyDown: handleKeyDown }: IProps,
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
