import { HTMLInputTypeAttribute } from "react";
import { AutocompleteOption } from "@/types/web";
import Label from "./Label";
import { inputField } from "@/app/globalClasses";
import { UseFormRegisterReturn } from "react-hook-form";

interface ITextField {
  label?: string;
  type?: HTMLInputTypeAttribute;
  autocomplete?: AutocompleteOption;
  required?: boolean;
  register?: UseFormRegisterReturn;
  error?: string;
  value?: string | number | readonly string[];
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}

export default function Textfield({
  label,
  type,
  autocomplete,
  required,
  register,
  error,
  value,
  onChange: handleChange,
  onKeyDown: handleKeyDown,
}: ITextField) {
  return (
    <div>
      {label && <Label name={label} />}
      <div className="mt-2">
        <input
          type={type}
          autoComplete={autocomplete}
          required={required}
          className={`${inputField} ${error ? "!ring-danger !focus:ring-danger" : ""}`}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          {...register}
        />
        {error && <div className="text-error-text mt-1 text-danger">{error}</div>}
      </div>
    </div>
  );
}
