import Button from "@/Components/Button";
import DeleteAccountModal from "./DeleteAccountModal";
import { useCallback, useEffect, useState } from "react";
import { deleteMe } from "@/Services/user";
import { useAuth } from "@/Contexts/auth";
import { isAdmin } from "@/Utils/role";
import ButtonGroup from "@/Components/ButtonGroup";
import MultipleRangeSlider from "@/Components/MultipleRangeSlider";
import { getPreferences, updatePreferences } from "@/Services/preference";
import { GENDER, MIN_AGE } from "@shared/constants/user";
import { Genders } from "@shared/types/user";
import { IUpdatePreferencesBody } from "@/Types/preference";
import { Spinner } from "@/Components/Loading/Spinner";
import { debounce } from "underscore";

export default function Settings() {
  const { user, logout } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [canUpdate, setCanUpdate] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);

  const [contentGender, setContentGender] = useState<Genders | null>(null);
  const [initialContentMinAge, setInitialContentMinAge] = useState(MIN_AGE);
  const [initialContentMaxAge, setInitialContentMaxAge] = useState<number | null>(null);
  const [contentMinAge, setContentMinAge] = useState(MIN_AGE);
  const [contentMaxAge, setContentMaxAge] = useState<number | null>(null);

  const [exposureGender, setExposureGender] = useState<Genders | null>(null);
  const [initialExposureMinAge, setInitialExposureMinAge] = useState(MIN_AGE);
  const [initialExposureMaxAge, setInitialExposureMaxAge] = useState<number | null>(null);
  const [exposureMinAge, setExposureMinAge] = useState(MIN_AGE);
  const [exposureMaxAge, setExposureMaxAge] = useState<number | null>(null);

  const debouncedUpdatePreferences = useCallback(
    debounce(
      (userId: string, body: IUpdatePreferencesBody) => updatePreferences(userId, body),
      250
    ),
    [updatePreferences]
  );

  const handleOpenDeleteAccountModal = () => {
    setIsDeleteAccountModalOpen(true);
  };

  const handleCloseDeleteAccountModal = async () => {
    await deleteMe();
    await logout();

    setIsDeleteAccountModalOpen(false);
  };

  const handleShowMeGenderSelection = (selectedGender: Genders | "Both") => {
    if (selectedGender === "Both") {
      setContentGender(null);
    } else {
      setContentGender(selectedGender);
    }
  };

  const handleVoterGenderSelection = (selectedGender: Genders | "Both") => {
    if (selectedGender === "Both") {
      setExposureGender(null);
    } else {
      setExposureGender(selectedGender);
    }
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    getPreferences(user.id).then(({ preference }) => {
      setContentGender(preference.contentGender);
      setExposureGender(preference.exposureGender);
      setInitialContentMinAge(preference.contentMinAge);
      setInitialExposureMinAge(preference.exposureMinAge);
      setInitialContentMaxAge(preference.contentMaxAge);
      setInitialExposureMaxAge(preference.exposureMaxAge);
      setContentMinAge(preference.contentMinAge);
      setExposureMinAge(preference.exposureMinAge);
      setContentMaxAge(preference.contentMaxAge);
      setExposureMaxAge(preference.exposureMaxAge);
      setIsLoading(false);
    });
  }, [user]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    setCanUpdate(true);
  }, [isLoading]);

  useEffect(() => {
    if (!user || !canUpdate) {
      return;
    }

    debouncedUpdatePreferences(user.id, {
      contentGender,
      contentMaxAge,
      contentMinAge,
      exposureGender,
      exposureMaxAge,
      exposureMinAge,
    });
  }, [
    user,
    contentGender,
    contentMaxAge,
    contentMinAge,
    exposureGender,
    exposureMaxAge,
    exposureMinAge,
  ]);

  return (
    <>
      <DeleteAccountModal
        isOpen={isDeleteAccountModalOpen}
        onClose={() => {
          setIsDeleteAccountModalOpen(false);
        }}
        onDelete={handleCloseDeleteAccountModal}
      />
      {isLoading && <Spinner />}
      {isLoading === false && (
        <>
          <div className="text-xl min-[300px]:text-2xl font-semibold text-center mb-5">
            Settings
          </div>
          <hr className="my-4" />
          <div className="font-bold">Show me</div>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-0 mt-3 mb-1">
            <div className="w-full sm:w-[50%] lg:w-[41.6%]">
              <div className="mb-1">Gender</div>
              <ButtonGroup
                selectedOption={contentGender ?? "Both"}
                options={[GENDER.Male, GENDER.Female, "Both"]}
                //@ts-ignore
                onClick={handleShowMeGenderSelection}
              />
            </div>
            <div className="w-full sm:w-[50%] lg:w-[41.6%] flex flex-col">
              <div className="flex justify-between mb-1 max-w-full sm:max-w-xs">
                <div>Age Range</div>
                <div>
                  {contentMinAge}-
                  {contentMaxAge === null || contentMaxAge === 100 ? "100+" : contentMaxAge}
                </div>
              </div>
              <div className="max-w-full sm:max-w-xs">
                <MultipleRangeSlider
                  initialValue={[initialContentMinAge, initialContentMaxAge ?? 100]}
                  min={18}
                  max={100}
                  onChange={(leftVal: number, rightVal: number) => {
                    setContentMinAge(leftVal);
                    setContentMaxAge(rightVal);
                  }}
                />
              </div>
            </div>
          </div>
          <hr className="my-4" />
          <div className="font-bold">Get votes from</div>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-0 mt-3 mb-1">
            <div className="w-full sm:w-[50%] lg:w-[41.6%]">
              <div className="mb-1">Gender</div>
              <ButtonGroup
                selectedOption={exposureGender ?? "Both"}
                options={[GENDER.Male, GENDER.Female, "Both"]}
                //@ts-ignore
                onClick={handleVoterGenderSelection}
              />
            </div>
            <div className="w-full sm:w-[50%] lg:w-[41.6%] flex flex-col">
              <div className="flex justify-between mb-1 max-w-full sm:max-w-xs">
                <div>Age Range</div>
                <div>
                  {exposureMinAge}-
                  {exposureMaxAge === null || exposureMaxAge === 100 ? "100+" : exposureMaxAge}
                </div>
              </div>
              <div className="max-w-full sm:max-w-xs">
                <MultipleRangeSlider
                  initialValue={[initialExposureMinAge, initialExposureMaxAge ?? 100]}
                  min={18}
                  max={100}
                  onChange={(leftVal: number, rightVal: number) => {
                    setExposureMinAge(leftVal);
                    setExposureMaxAge(rightVal);
                  }}
                />
              </div>
            </div>
          </div>
          <hr className="my-4" />
          <div className="max-w-full sm:max-w-sm mx-auto mt-5">
            <Button
              onClick={handleOpenDeleteAccountModal}
              disabled={user ? isAdmin(user.role) : true}
              style="danger"
              variant="outline"
            >
              Delete Account
            </Button>
          </div>
        </>
      )}
    </>
  );
}
