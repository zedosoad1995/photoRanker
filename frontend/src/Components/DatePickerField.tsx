import Datepicker from "react-tailwindcss-datepicker";
import { DateValueType } from "react-tailwindcss-datepicker/dist/types";
import { inputField } from "@/globalClasses";
import { CalendarIcon, XMarkIcon } from "@heroicons/react/20/solid";
import Label from "./Label";
import { subtractYears } from "@/Utils/date";

interface IDatePickerField {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  maxDate?: Date;
  error?: string;
}

export default function DatePickerField({
  label,
  value,
  maxDate = subtractYears(new Date(), 18),
  onChange: handleChange,
  onKeyDown: handleKeyDown,
  error,
}: IDatePickerField) {
  const transformedValue = {
    startDate: value,
    endDate: value,
  };

  const correctTypeHandleChange = (value: DateValueType) => {
    const callValue = Boolean(value?.startDate) ? value?.startDate : "";

    handleChange(callValue as string);
  };

  return (
    <div onKeyDown={handleKeyDown}>
      {label && <Label name={label} />}
      <div className="mt-2 relative">
        <Datepicker
          inputClassName={`${inputField} ${error ? "!ring-danger !focus:ring-danger" : ""}`}
          value={transformedValue}
          onChange={correctTypeHandleChange}
          asSingle={true}
          useRange={false}
          startFrom={maxDate}
          maxDate={maxDate}
          toggleClassName="absolute right-0 h-full px-2 text-light-text focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
          toggleIcon={(open) => {
            return open ? <CalendarIcon className="h-5 w-5" /> : <XMarkIcon className="h-5 w-5" />;
          }}
        />
        {error && <div className="text-error-text mt-1 text-danger">{error}</div>}
      </div>
    </div>
  );
}
