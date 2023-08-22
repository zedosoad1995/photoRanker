import { Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import Label from "./Label";
import { useState, useRef, useEffect } from "react";

interface IValue {
  id: string;
  label: string;
}

interface ISelect {
  options: readonly IValue[];
  title: string;
  label?: string;
  value: string | string[];
  onChange: (value: any) => void;
}

export default function Select({ options, title, label, value, onChange: handleChange }: ISelect) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const hasMultiple = Array.isArray(value);

  const closeOpenMenus = (event: MouseEvent) => {
    if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  const handleSelectOption = () => {
    if (!hasMultiple) {
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
        <Listbox value={value} onChange={handleChange}>
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
              className={`absolute mt-1 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 sm:text-sm z-20 ${
                options.length === 0 || !isOpen ? "hidden" : ""
              }`}
            >
              {options.map((option) => {
                if (hasMultiple) {
                  var isSelected = value.some((val) => option.id === val);
                } else {
                  var isSelected = value === option.id;
                }

                return (
                  <Listbox.Option
                    key={option.id}
                    value={option.id}
                    onClick={handleSelectOption}
                    className="relative cursor-pointer select-none py-2 pl-4 pr-9 hover:bg-primary-contrast hover:text-primary-text"
                  >
                    <span
                      className={`block truncate ${isSelected ? "font-medium" : "font-normal"}`}
                    >
                      {option.label}
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
