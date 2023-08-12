import { Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import Label from "./Label";
import { useState, useRef, useEffect } from "react";

interface ISelect {
  options: readonly string[];
  title: string;
  label?: string;
  value: string | string[];
  isMultiple?: boolean;
  onChange: (value: any) => void;
}

export default function Select({
  options,
  title,
  label,
  value,
  isMultiple,
  onChange: handleChange,
}: ISelect) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const closeOpenMenus = (event: MouseEvent) => {
    if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeOpenMenus);

    return () => {
      document.removeEventListener("mousedown", closeOpenMenus);
    };
  }, []);

  return (
    <div>
      {label && <Label name={label} />}
      <div ref={selectRef} className={`${label ? "mt-2" : ""} relative`}>
        <Listbox value={value} onChange={handleChange} multiple={isMultiple}>
          <Listbox.Button
            onClick={() => setIsOpen((val) => !val)}
            className="relative w-full rounded-md pl-1.5 shadow-sm ring-1 ring-inset ring-normal-contour  sm:text-sm sm:leading-6 h-10"
          >
            <div className="truncate flex">{title}</div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-light-text" />
            </div>
          </Listbox.Button>
          {isOpen && (
            <Listbox.Options
              static
              className={`absolute mt-1 max-h-44 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 sm:text-sm z-10 ${
                options.length === 0 || !isOpen ? "hidden" : ""
              }`}
            >
              {options.map((option) => {
                const isSelected = value.includes(option);

                return (
                  <Listbox.Option
                    key={option}
                    value={option}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-2 pl-4 pr-9 ${
                        active ? "bg-primary-contrast text-primary-text" : ""
                      }`
                    }
                  >
                    <span
                      className={`block truncate ${isSelected ? "font-medium" : "font-normal"}`}
                    >
                      {option}
                    </span>
                    {isSelected ? (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-primary-text">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </Listbox.Option>
                );
              })}
            </Listbox.Options>
          )}
        </Listbox>
      </div>
    </div>
  );
}
