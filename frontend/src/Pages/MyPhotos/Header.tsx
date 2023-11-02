import { useRef, useCallback } from "react";
import Button from "@/Components/Button";
import Filters from "./Filters/Filters";
import { isAdmin } from "@/Utils/role";
import { debounce } from "underscore";
import { IUser } from "@/Types/user";
import { MyPhotosAction, MyPhotosState } from "./Contexts/myPhotos";

const DEFAULT_SORT = "score desc";

interface IHeader {
  getPictures: (cursor?: string) => Promise<void>;
  setIsFetchingFilter: React.Dispatch<React.SetStateAction<boolean>>;
  loggedUser: IUser;
  hasReachedPicsLimit: boolean;
  filterState: MyPhotosState;
  filterDispatch: React.Dispatch<MyPhotosAction>;
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
  filterState,
  filterDispatch,
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
    let value = "";

    if (filterState.filterSelect === selectedOption) {
      if (
        filterState.filterSelect === "hasReport" &&
        filterState.sortValue.includes("reportedDate")
      ) {
        filterDispatch({ key: "sortValue", value: DEFAULT_SORT });
      }
    } else {
      value = selectedOption;
    }

    if (value === filterState.filterSelect) return;

    setIsFetchingFilter(true);
    filterDispatch({ key: "filterSelect", value });
  };

  const handleSortSelect = (selectedOption: string) => {
    if (selectedOption === filterState.sortValue) return;

    setIsFetchingFilter(true);
    const orderByKey = selectedOption.split(" ")[0];

    if (orderByKey === "reportedDate") {
      filterDispatch({ key: "filterSelect", value: "hasReport" });
    }

    filterDispatch({ key: "sortValue", value: selectedOption });
  };

  const handleGenderSelect = (selectedOption: string) => {
    if (selectedOption === filterState.sortValue) return;

    setIsFetchingFilter(true);

    filterDispatch({
      key: "gender",
      value: filterState.gender === selectedOption ? "" : selectedOption,
    });
  };

  const debouncedUpdateAgeRange = useCallback(
    debounce((minAge: number, maxAge: number) => {
      if (minAge === filterState.minAge && maxAge === filterState.maxAge) return;

      setIsFetchingFilter(true);
      filterDispatch({ key: "minAge", value: minAge });
      filterDispatch({ key: "maxAge", value: maxAge });
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
          filterSelectedOption={filterState.filterSelect}
          handleFilterSelect={handleFilterSelect}
          sortValue={filterState.sortValue}
          handleSortSelect={handleSortSelect}
          genderOption={filterState.gender}
          handleGenderSelect={handleGenderSelect}
          updateAgeRange={debouncedUpdateAgeRange}
          minAgeInit={filterState.minAge}
          maxAgeInit={filterState.maxAge}
        />
      </div>
    </>
  );
};
