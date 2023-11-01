import { useRef, useCallback } from "react";
import Button from "@/Components/Button";
import Filters from "./Filters/Filters";
import { isAdmin } from "@/Utils/role";
import { debounce } from "underscore";
import { IUser } from "@/Types/user";

const DEFAULT_SORT = "score desc";

interface IHeader {
  getPictures: (cursor?: string) => Promise<void>;
  setIsFetchingFilter: React.Dispatch<React.SetStateAction<boolean>>;
  loggedUser: IUser;
  hasReachedPicsLimit: boolean;
  setFilterSelectedOption: React.Dispatch<React.SetStateAction<string>>;
  setSortValue: React.Dispatch<React.SetStateAction<string>>;
  setGender: React.Dispatch<React.SetStateAction<string | undefined>>;
  setMinAge: React.Dispatch<React.SetStateAction<number | undefined>>;
  setMaxAge: React.Dispatch<React.SetStateAction<number | undefined>>;
  filterSelectedOption: string;
  sortValue: string;
  gender: string | undefined;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectedImage: {
    image: string;
    width: number;
    height: number;
  } | null;
  filename: string | null;
}

export const Header = ({
  setIsFetchingFilter,
  loggedUser,
  hasReachedPicsLimit,
  setFilterSelectedOption,
  setSortValue,
  setGender,
  setMinAge,
  setMaxAge,
  filterSelectedOption,
  sortValue,
  gender,
  handleFileChange,
}: IHeader) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
      fileInputRef.current.value = "";
    }
  };

  const handleFilterSelect = (selectedOption: string) => {
    setIsFetchingFilter(true);
    setFilterSelectedOption((val) => {
      if (val === selectedOption) {
        if (val === "hasReport" && sortValue.includes("reportedDate")) {
          setSortValue(DEFAULT_SORT);
        }

        return "";
      }

      return selectedOption;
    });
  };

  const handleSortSelect = (selectedOption: string) => {
    setIsFetchingFilter(true);
    const orderByKey = selectedOption.split(" ")[0];

    if (orderByKey === "reportedDate") {
      setFilterSelectedOption("hasReport");
    }

    setSortValue(selectedOption);
  };

  const handleGenderSelect = (selectedOption: string) => {
    setIsFetchingFilter(true);
    setGender((val) => {
      if (val === selectedOption) {
        return "";
      }

      return selectedOption;
    });
  };

  const debouncedUpdateAgeRange = useCallback(
    debounce((minAge: number, maxAge: number) => {
      setIsFetchingFilter(true);
      setMaxAge(maxAge);
      setMinAge(minAge);
    }, 400),
    []
  );

  return (
    <>
      <input
        type="file"
        accept="image/jpeg, image/png"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <div
        className={`flex gap-4 flex-col ${
          isAdmin(loggedUser.role) ? "lg:flex-row" : "min-[330px]:flex-row"
        }`}
      >
        <div className="w-full sm:w-fit">
          <Button
            disabled={hasReachedPicsLimit}
            onClick={handleFileSelect}
            isFull={true}
            isHeightFull={true}
          >
            <div className="flex items-center justify-center">
              <div className="mr-3 text-xl -translate-y-[1px]">+</div>
              <div>Add Photo</div>
            </div>
          </Button>
        </div>
        <Filters
          isAdmin={isAdmin(loggedUser.role)}
          filterSelectedOption={filterSelectedOption}
          handleFilterSelect={handleFilterSelect}
          sortValue={sortValue}
          handleSortSelect={handleSortSelect}
          genderOption={gender}
          handleGenderSelect={handleGenderSelect}
          updateAgeRange={debouncedUpdateAgeRange}
        />
      </div>
    </>
  );
};
