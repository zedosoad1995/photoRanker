import { HTMLInputTypeAttribute, useState, useMemo } from "react";
import { AutocompleteOption } from "@/Types/web";
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
  const [isFocused, setIsFocused] = useState(false);

  const toggleShowPassword = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setIsShowPassword((val) => !val);
  };

  const transformedType = useMemo(
    () => (type === "password" && isShowPassword === true ? "text" : type),
    [type, isShowPassword]
  );

  const labelStyle = `absolute z-10 left-2 px-1 origin-top-left text-light-text bg-white transition-all duration-200 ease-in-out transform pointer-events-none ${
    isFocused || value
      ? "scale-75 -translate-y-[37.5%] top-0"
      : "top-1/2 scale-100 -translate-y-1/2"
  }`;

  return (
    <div onBlur={() => setIsFocused(false)}>
      <div className="relative">
        <label className={labelStyle}>{label}</label>
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
          onFocus={() => setIsFocused(true)}
          {...register}
        />
      </div>
      {error && <div className="text-error-text mt-1 text-danger">{error}</div>}
    </div>
  );
}
