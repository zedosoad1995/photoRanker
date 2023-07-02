import { HTMLInputTypeAttribute } from "react";
import { AutocompleteOption } from "../types/web";
import Label from "./Label";

interface ITextField {
  label?: string;
  type?: HTMLInputTypeAttribute;
  autocomplete?: AutocompleteOption;
  required?: boolean;
}

export default function Textfield({
  label,
  type,
  autocomplete,
  required,
}: ITextField) {
  return (
    <div>
      {label && <Label name={label} />}
      <div className="mt-2">
        <input
          type={type}
          autoComplete={autocomplete}
          required={required}
          className="block w-full rounded-md border-0 py-1.5 text-indigo-600 shadow-sm ring-1 ring-inset ring-normal-contour placeholder:text-placeholder-text focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
        />
      </div>
    </div>
  );
}
