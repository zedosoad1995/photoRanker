import { useState } from "react";
import { Combobox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { inputField } from "@/globalClasses";

interface IAutoCompleteSelect {
  options: readonly string[];
  label?: string;
  value: string;
  onChange: (value: any) => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}

export default function AutoCompleteSelect({
  options,
  label,
  value,
  onChange: handleChange,
  onKeyDown: handleKeyDown,
}: IAutoCompleteSelect) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const filteredOptions =
    query === ""
      ? options
      : options.filter((option) => {
          return option.toLowerCase().includes(query.toLowerCase());
        });

  const labelStyle = `absolute z-10 left-2 px-1 origin-top-left text-gray-600 bg-white transition-all duration-200 ease-in-out transform pointer-events-none ${
    isFocused || value
      ? "scale-75 -translate-y-[37.5%] top-0"
      : "top-1/2 scale-100 -translate-y-1/2"
  } focus-within:text-gray-400`;

  return (
    <div onBlur={() => setIsFocused(false)}>
      <div className={`${label ? "mt-2" : ""} relative`}>
        <label className={labelStyle}>{label}</label>
        <Combobox value={value} onChange={handleChange}>
          <div className="relative">
            <Combobox.Input
              onChange={(event) => setQuery(event.target.value)}
              className={`pr-6 ${inputField}`}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-light-text" />
            </Combobox.Button>
          </div>
          <Combobox.Options
            className={`absolute z-20 mt-1 max-h-44 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 sm:text-sm ${
              filteredOptions.length === 0 ? "hidden" : ""
            }`}
          >
            {filteredOptions.map((option) => (
              <Combobox.Option
                key={option}
                value={option}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2 px-4 ${
                    active ? "bg-primary-contrast text-primary-text" : ""
                  }`
                }
              >
                {({ selected }) => (
                  <>
                    <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                      {option}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-primary-text">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Combobox>
      </div>
    </div>
  );
}
