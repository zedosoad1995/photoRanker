import { COUNTRIES, ETHNICITY, GENDER } from "@shared/constants/user";
import Select from "@/Components/AutoCompleteSelect";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateUserPersonalInfoSchema,
  ICreateUserPersonalInfo,
} from "@/Schemas/User/CreateUserPersonalInfo";
import { forwardRef, useImperativeHandle, useState } from "react";
import { ICreateUser } from "@/Types/user";
import Textfield from "@/Components/TextField";

type IData = Pick<
  ICreateUser,
  "countryOfOrigin" | "ethnicity" | "dateOfBirth" | "gender"
>;

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
        gender,
        ethnicity,
        countryOfOrigin,
      },
      mode: "onSubmit",
    });

    const [day, setDay] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");

    useImperativeHandle(ref, () => ({
      checkValid() {
        handleSubmit(() => {})();
        return isValid;
      },
    }));

    const handleChange = (label: keyof IData) => (value: string) => {
      setValue(label, value, { shouldValidate: true });
      updateData({ [label]: value });
    };

    const handleChangeDate =
      (dateType: "day" | "month" | "year") =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const val = event.currentTarget.value;

        let newDay = day;
        let newMonth = month;
        let newYear = year;

        if (dateType === "day") {
          setDay(val);
          newDay = val;
        } else if (dateType === "month") {
          setMonth(val);
          newMonth = val;
        } else {
          setYear(val);
          newYear = val;
        }

        const newDate = `${newYear.padStart(4, "0")}-${newMonth.padStart(
          2,
          "0"
        )}-${newDay.padStart(2, "0")}`;

        setValue("dateOfBirth", newDate, { shouldValidate: true });
        updateData({ dateOfBirth: newDate });
      };

    return (
      <>
        <div>
          <Select
            label="Country of Origin"
            options={COUNTRIES}
            value={countryOfOrigin}
            onChange={handleChange("countryOfOrigin")}
            onKeyDown={handleKeyDown}
          />
          {errors.countryOfOrigin?.message && (
            <div className="text-error-text mt-1 text-danger">
              {errors.countryOfOrigin?.message}
            </div>
          )}
        </div>
        <div>
          <Select
            label="Ethnicity"
            options={ETHNICITY}
            value={ethnicity}
            onChange={handleChange("ethnicity")}
            onKeyDown={handleKeyDown}
          />
          {errors.ethnicity?.message && (
            <div className="text-error-text mt-1 text-danger">
              {errors.ethnicity?.message}
            </div>
          )}
        </div>
        <div>
          <Select
            label="Gender"
            options={Object.values(GENDER)}
            value={gender}
            onChange={handleChange("gender")}
            onKeyDown={handleKeyDown}
          />
          {errors.gender?.message && (
            <div className="text-error-text mt-1 text-danger">
              {errors.gender?.message}
            </div>
          )}
        </div>
        <div>
          <div className="flex gap-2">
            <Textfield
              label="Day"
              placeholder="DD"
              onChange={handleChangeDate("day")}
              value={day}
              autocomplete="bday-day"
              maxLen={2}
              isNumeric
            />
            <Textfield
              label="Month"
              placeholder="MM"
              onChange={handleChangeDate("month")}
              value={month}
              autocomplete="bday-month"
              maxLen={2}
              isNumeric
            />
            <Textfield
              label="Year"
              placeholder="YYYY"
              onChange={handleChangeDate("year")}
              value={year}
              autocomplete="bday-year"
              maxLen={4}
              isNumeric
            />
          </div>
          {Boolean(errors.dateOfBirth?.message) && (
            <div className="text-error-text mt-1 text-danger">
              {errors.dateOfBirth?.message}
            </div>
          )}
        </div>
      </>
    );
  }
);

export default PersonalInfoForm;
