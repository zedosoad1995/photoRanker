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
  title?: string;
  label?: string;
  value: string | string[];
  onChange: (value: any) => void;
}

export default function Select({
  options,
  title,
  label,
  value,
  onChange: handleChange,
}: ISelect) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRightAlign, setIsRightAlign] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLElement>(null);

  const hasMultiple = Array.isArray(value);

  useEffect(() => {
    const setDropdownHeight = () => {
      if (!dropdownRef.current) return;

      const rect = dropdownRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const maxHeight = viewportHeight - rect.top;

      dropdownRef.current.style.maxHeight = `${maxHeight - 4}px`;
    };

    setDropdownHeight();

    window.addEventListener("resize", setDropdownHeight);

    return () => {
      window.removeEventListener("resize", setDropdownHeight);
    };
  }, [dropdownRef, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const setDropdownWidth = () => {
      if (!dropdownRef.current || !selectRef.current) return;

      if (dropdownRef.current.clientWidth > selectRef.current.clientWidth)
        return;

      dropdownRef.current.style.width = `${selectRef.current.clientWidth}px`;
    };

    setDropdownWidth();

    window.addEventListener("resize", setDropdownWidth);

    return () => {
      window.removeEventListener("resize", setDropdownWidth);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setIsRightAlign(false);
    }

    if (!dropdownRef.current) return;

    const rect = dropdownRef.current.getBoundingClientRect();

    setIsRightAlign(window.innerWidth < rect.right);
  }, [isOpen]);

  const handleOpenMenu = () => {
    setIsOpen((val) => !val);
  };

  const closeOpenMenu = (event: MouseEvent | TouchEvent) => {
    if (
      selectRef.current &&
      !selectRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  const handleSelectOption = () => {
    if (!hasMultiple) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeOpenMenu);
    document.addEventListener("touchstart", closeOpenMenu);

    return () => {
      document.removeEventListener("mousedown", closeOpenMenu);
      document.removeEventListener("touchstart", closeOpenMenu);
    };
  }, []);

  const selectedLabel = options.find((o) => {
    if (Array.isArray(value)) {
      if (value.length) {
        return o.id === value[0];
      } else {
        return;
      }
    } else {
      return o.id === value;
    }
  })?.label;

  return (
    <div>
      {label && <Label name={label} />}
      <div ref={selectRef} className={`${label ? "mt-2" : ""} relative`}>
        <Listbox value={value} onChange={handleChange}>
          <Listbox.Button
            onClick={handleOpenMenu}
            className="relative w-full rounded-md pl-1.5 shadow-sm ring-1 ring-inset ring-normal-contour text-sm max-[296px]:text-xs sm:leading-6 h-10"
          >
            <div className="truncate flex">{title ?? selectedLabel}</div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-light-text" />
            </div>
          </Listbox.Button>
          {isOpen && (
            <Listbox.Options
              static
              ref={dropdownRef}
              className={`fixed mt-1 overflow-y-auto max-h-0 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 text-sm max-[296px]:text-xs z-20 ${
                options.length === 0 || !isOpen ? "hidden" : ""
              } ${isRightAlign ? "right-2" : ""}`}
            >
              {options.map((option) => {
                let isSelected = value === option.id;

                if (hasMultiple) {
                  isSelected = value.some((val) => option.id === val);
                }

                return (
                  <Listbox.Option
                    key={option.id}
                    value={option.id}
                    onClick={handleSelectOption}
                    className="relative cursor-pointer select-none py-2 pl-4 pr-9 hover:bg-primary-contrast hover:text-primary-text"
                  >
                    <span
                      className={`block truncate ${
                        isSelected ? "font-medium" : "font-normal"
                      }`}
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
