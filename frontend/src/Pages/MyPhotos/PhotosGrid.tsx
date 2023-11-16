import { Spinner } from "@/Components/Loading/Spinner";
import { PhotoCard } from "./ImageCard";
import { PhotosLoaderCover } from "./PhotosLoaderCover";
import { IUser } from "@/Types/user";
import { IPictureWithPercentile } from "@/Types/picture";
import BanUserModal from "./Modals/BanUserModal";
import DeletePhotoModal from "./Modals/DeletePhotoModal";
import { useState } from "react";

interface IPhotoGrid {
  isFetchingFilter: boolean;
  isLoadingMorePhotos: boolean;
  loggedUser: IUser;
  picUrls: string[];
  picsInfo: IPictureWithPercentile[];
  getPictures: (cursor?: string) => Promise<void>;
  setPicUrls: React.Dispatch<React.SetStateAction<string[]>>;
  setPicsInfo: React.Dispatch<React.SetStateAction<IPictureWithPercentile[]>>;
  prevCursor: string | undefined;
  isGlobal?: boolean;
}

export const PhotosGird = ({
  isFetchingFilter,
  isLoadingMorePhotos,
  loggedUser,
  picUrls,
  picsInfo,
  getPictures,
  setPicUrls,
  setPicsInfo,
  prevCursor,
  isGlobal,
}: IPhotoGrid) => {
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenBan, setIsOpenBan] = useState(false);
  const [picToDeleteIndex, setPicToDeleteIndex] = useState<number | null>(null);
  const [userIdToBan, setUserIdToBan] = useState<string | null>(null);

  const handleClickDeletePic = (index: number) => async (event: React.MouseEvent) => {
    event.stopPropagation();

    setIsOpenDelete(true);
    setPicToDeleteIndex(index);
  };

  const handleClickBanUser = (index: number) => async (event: React.MouseEvent) => {
    event.stopPropagation();

    setIsOpenBan(true);
    setUserIdToBan(picsInfo[index].userId);
  };

  const handleCloseDeleteModal = () => {
    setIsOpenDelete(false);
  };

  const handleCloseBanModal = () => {
    setIsOpenBan(false);
  };

  return (
    <>
      <BanUserModal
        isOpen={isOpenBan}
        onClose={handleCloseBanModal}
        userIdToBan={userIdToBan}
        getPictures={getPictures}
      />
      <DeletePhotoModal
        isOpen={isOpenDelete}
        picToDeleteIndex={picToDeleteIndex}
        onClose={handleCloseDeleteModal}
        getPictures={() => getPictures(prevCursor)}
        picsInfo={picsInfo}
        setPics={setPicUrls}
        setPicsInfo={setPicsInfo}
      />
      {true && (
        <>
          <PhotosLoaderCover isLoading={isFetchingFilter} />
          <div className="-mx-2 mt-1 flow-root relative">
            {picUrls.map((pic, index) => (
              <PhotoCard
                key={pic}
                index={index}
                loggedUser={loggedUser}
                onClickBanUser={handleClickBanUser(index)}
                onClickDeletePic={handleClickDeletePic(index)}
                pic={pic}
                picInfo={picsInfo[index]}
                isGlobal={isGlobal}
              />
            ))}
          </div>
        </>
      )}
      {isLoadingMorePhotos && <Spinner />}
    </>
  );
};
