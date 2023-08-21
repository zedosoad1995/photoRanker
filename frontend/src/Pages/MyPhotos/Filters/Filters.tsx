import MiscFilter from "./MiscFilter";
import Sorting from "./Sorting";
import GenderFilter from "./GenderFilter";
import MultipleRangeSlider from "@/Components/MultipleRangeSlider";
import { Spinner } from "@/Components/Loading/Spinner";

interface IFilters {
  isAdmin: boolean;
  isFetchingFilter: boolean;
  filterSelectedOption: string;
  handleFilterSelect: (value: string) => void;
  sortValue: string;
  handleSortSelect: (value: string) => void;
  genderOption: string;
  handleGenderSelect: (value: string) => void;
}

const Filters = ({
  isAdmin,
  isFetchingFilter,
  filterSelectedOption,
  handleFilterSelect,
  sortValue,
  handleSortSelect,
  genderOption,
  handleGenderSelect,
}: IFilters) => {
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
            isAdmin ? "sm:max-w-[180px] min-w-[90px] sm:flex" : ""
          }`}
        >
          <MultipleRangeSlider
            initialValue={[18, 100]}
            min={18}
            max={100}
            onChange={(leftVal: number, rightVal: number) => {}}
          />
        </div>
      </div>
      <div
        className={`flex-1 items-center ${
          isAdmin ? "sm:max-w-[180px] min-w-[90px] flex sm:hidden" : "hidden"
        }`}
      >
        <MultipleRangeSlider
          initialValue={[18, 100]}
          min={18}
          max={100}
          onChange={(leftVal: number, rightVal: number) => {}}
        />
      </div>
      {isFetchingFilter && <Spinner />}
    </>
  );
};

export default Filters;
