import { HTMLInputTypeAttribute } from "react";
import { AutocompleteOption } from "@/types/web";
import Label from "./Label";
import { inputField } from "@/globalClasses";

interface ITextField {
  label?: string;
  type?: HTMLInputTypeAttribute;
  autocomplete?: AutocompleteOption;
  disaplayValue?: string;
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
          className={inputField}
        />
      </div>
    </div>
  );
}
