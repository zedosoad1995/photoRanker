"use client";

import { useState } from "react";
import { Combobox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import Label from "./Label";
import { inputField } from "@/globalClasses";

interface ISelect {
  options: string[];
  label?: string;
  value: string;
  onChange: (value: string) => void;
}

export default function Select({
  options,
  label,
  value,
  onChange: handleChange,
}: ISelect) {
  const [query, setQuery] = useState("");

  const filteredOptions =
    query === ""
      ? options
      : options.filter((option) => {
          return option.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <div>
      {label && <Label name={label} />}
      <div className="mt-2 relative">
        <Combobox value={value} onChange={handleChange}>
          <div className="relative">
            <Combobox.Input
              onChange={(event) => setQuery(event.target.value)}
              className={`pr-6 ${inputField}`}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-light-text" />
            </Combobox.Button>
          </div>
          <Combobox.Options
            className={`absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 sm:text-sm z-10 ${
              filteredOptions.length === 0 ? "hidden" : ""
            }`}
          >
            {filteredOptions.map((option) => (
              <Combobox.Option
                key={option}
                value={option}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 px-4 ${
                    active ? "bg-primary-contrast text-primary-text" : ""
                  }`
                }
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
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
