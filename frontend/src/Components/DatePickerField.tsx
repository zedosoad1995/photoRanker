import { useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { DateValueType } from "react-tailwindcss-datepicker/dist/types";
import { inputField } from "@/globalClasses";
import { CalendarIcon, XMarkIcon } from "@heroicons/react/20/solid";
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
  const [isFocused, setIsFocused] = useState(false);

  const labelStyle = `absolute z-10 left-2 px-1 origin-top-left text-gray-600 bg-white transition-all duration-200 ease-in-out transform pointer-events-none ${
    isFocused || value
      ? "scale-75 -translate-y-[37.5%] top-0"
      : "top-1/2 scale-100 -translate-y-1/2"
  } focus-within:text-gray-400`;

  const transformedValue = {
    startDate: value,
    endDate: value,
  };

  const correctTypeHandleChange = (value: DateValueType) => {
    const callValue = Boolean(value?.startDate) ? value?.startDate : "";

    handleChange(callValue as string);
  };

  return (
    <div onKeyDown={handleKeyDown} onBlur={() => setIsFocused(false)}>
      <div className="mt-2 relative">
        <label className={labelStyle}>{label}</label>
        <div onFocus={() => setIsFocused(true)}>
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
              return open ? (
                <CalendarIcon className="h-5 w-5" />
              ) : (
                <XMarkIcon className="h-5 w-5" />
              );
            }}
          />
        </div>
      </div>
      {error && <div className="text-error-text mt-1 text-danger">{error}</div>}
    </div>
  );
}
