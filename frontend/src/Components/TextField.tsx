import { HTMLInputTypeAttribute, useState, useMemo } from "react";
import { AutocompleteOption } from "@/Types/web";
import Label from "./Label";
import { inputField } from "@/globalClasses";
import { UseFormRegisterReturn } from "react-hook-form";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";

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
  const [isShowPassword, setIsShowPassword] = useState(false);

  const toggleShowPassword = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setIsShowPassword((val) => !val);
  };

  const transformedType = useMemo(
    () => (type === "password" && isShowPassword === true ? "text" : type),
    [type, isShowPassword]
  );

  return (
    <div>
      {label && <Label name={label} />}
      <div className="mt-2">
        <div className="relative">
          {type === "password" && (
            <div
              onClick={toggleShowPassword}
              className="absolute right-4 w-6 h-6 top-1/2 -translate-y-1/2 cursor-pointer text-placeholder-text"
            >
              {isShowPassword && <EyeSlashIcon />}
              {!isShowPassword && <EyeIcon />}
            </div>
          )}
          <input
            type={transformedType}
            autoComplete={autocomplete}
            required={required}
            className={`${inputField} ${error ? "!ring-danger !focus:ring-danger" : ""}`}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            {...register}
          />
        </div>
        {error && <div className="text-error-text mt-1 text-danger">{error}</div>}
      </div>
    </div>
  );
}
