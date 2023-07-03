"use client";

import { inputField } from "@/globalClasses";
import Label from "./Label";
import Datepicker from "react-tailwindcss-datepicker";
import { DateValueType } from "react-tailwindcss-datepicker/dist/types";
import { useState } from "react";
import { subtractYears } from "@/helpers/date";
import { CalendarIcon, XMarkIcon } from "@heroicons/react/20/solid";

interface IDateField {
  label?: string;
}

export default function DateField({ label }: IDateField) {
  const maxDate = subtractYears(new Date(), 18);

  const [value, setValue] = useState<DateValueType>({
    startDate: maxDate,
    endDate: maxDate,
  });

  const handleValueChange = (newValue: DateValueType) => {
    setValue(newValue);
  };

  return (
    <div>
      {label && <Label name={label} />}
      <div className="mt-2 relative">
        <Datepicker
          inputClassName={inputField}
          value={value}
          onChange={handleValueChange}
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
  );
}
