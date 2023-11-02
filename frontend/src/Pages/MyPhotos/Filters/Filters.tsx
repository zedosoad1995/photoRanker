import MiscFilter from "./MiscFilter";
import Sorting from "./Sorting";
import GenderFilter from "./GenderFilter";
import MultipleRangeSlider from "@/Components/MultipleRangeSlider";
import { useState } from "react";
import { MIN_AGE } from "@shared/constants/user";

interface IFilters {
  isAdmin: boolean;
  filterSelectedOption: string;
  handleFilterSelect: (value: string) => void;
  sortValue: string;
  handleSortSelect: (value: string) => void;
  genderOption?: string;
  handleGenderSelect: (value: string) => void;
  updateAgeRange: (minAge: number, maxAge: number) => void;
  minAgeInit?: number;
  maxAgeInit?: number;
}

const INI_MAX_AGE = 100;

const Filters = ({
  isAdmin,
  filterSelectedOption,
  handleFilterSelect,
  sortValue,
  handleSortSelect,
  genderOption,
  handleGenderSelect,
  updateAgeRange,
  minAgeInit,
  maxAgeInit,
}: IFilters) => {
  const [minAge, setMinAge] = useState(MIN_AGE);
  const [maxAge, setMaxAge] = useState(INI_MAX_AGE);

  const handleAgeRangeChange = (minAge: number, maxAge: number) => {
    updateAgeRange(minAge, maxAge);
    setMinAge(minAge);
    setMaxAge(maxAge);
  };

  return (
    <>
      <div className="flex flex-wrap gap-4 w-full">
        <div
          className={`flex-1 ${
            isAdmin ? "min-[520px]:max-w-[180px] max-[520px]:min-w-[90px]" : "hidden"
          }`}
        >
          <MiscFilter
            isAdmin={isAdmin}
            option={filterSelectedOption}
            onChange={handleFilterSelect}
          />
        </div>
        <div
          className={`flex-1 ${
            isAdmin ? "min-[520px]:max-w-[180px] max-[520px]:min-w-[90px]" : "sm:max-w-[180px]"
          }`}
        >
          <Sorting isAdmin={isAdmin} option={sortValue} onChange={handleSortSelect} />
        </div>
        <div
          className={`flex-1 ${
            isAdmin ? "min-[520px]:max-w-[180px] max-[520px]:min-w-[90px]" : "hidden"
          }`}
        >
          <GenderFilter isAdmin={isAdmin} option={genderOption} onChange={handleGenderSelect} />
        </div>

        <div
          className={`flex-1 hidden items-center ${
            isAdmin ? "sm:max-w-[180px] min-w-[90px] sm:flex sm:flex-col" : ""
          }`}
        >
          <div className="flex justify-between w-full text-sm">
            <div>Age Range</div>
            <div>
              {minAge}-{maxAge === 100 ? "100+" : maxAge}
            </div>
          </div>
          <MultipleRangeSlider
            initialValue={[minAgeInit ?? 18, maxAgeInit ?? 100]}
            min={18}
            max={100}
            onChange={handleAgeRangeChange}
          />
        </div>
      </div>
      <div
        className={`flex-1 items-center ${
          isAdmin ? "sm:max-w-[180px] min-w-[90px] flex flex-col sm:hidden" : "hidden"
        }`}
      >
        <div className="flex justify-between w-full">
          <div>Age Range</div>
          <div>
            {minAge}-{maxAge === 100 ? "100+" : maxAge}
          </div>
        </div>
        <MultipleRangeSlider
          initialValue={[minAgeInit ?? 18, maxAgeInit ?? 100]}
          min={18}
          max={100}
          onChange={handleAgeRangeChange}
        />
      </div>
    </>
  );
};

export default Filters;
