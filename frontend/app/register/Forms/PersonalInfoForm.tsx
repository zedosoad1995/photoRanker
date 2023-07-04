import Select from "@/components/Select";
import { COUNTRIES, ETHNICITY } from "../../../../backend/src/constants/user";
import DateField from "@/components/DateField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ICreateUserPersonalInfo,
  createUserPersonalInfoSchema,
} from "@/schemas/user/createUserPersonalInfo";
import { forwardRef, useImperativeHandle } from "react";

interface IData {
  ethnicity: string;
  countryOfOrigin: string;
  dateOfBirth: string;
}

interface IProps {
  updateData: (data: Partial<IData>) => void;
  countryOfOrigin: string;
  ethnicity: string;
  dateOfBirth: string;
}

const PersonalInfoForm = forwardRef(
  ({ updateData, countryOfOrigin, ethnicity, dateOfBirth }: IProps, ref) => {
    const {
      handleSubmit,
      setValue,
      formState: { isValid, errors },
    } = useForm<ICreateUserPersonalInfo>({
      resolver: zodResolver(createUserPersonalInfoSchema),
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
        />
        <Select
          label="Ethnicity"
          options={ETHNICITY}
          value={ethnicity}
          onChange={handleChange("ethnicity")}
        />
        <DateField
          label="Date of Birth"
          value={dateOfBirth}
          onChange={handleChangeDate}
          error={errors.dateOfBirth?.message}
        />
      </>
    );
  }
);

export default PersonalInfoForm;
