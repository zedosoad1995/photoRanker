import Menu from "@/Components/Menu";
import { ImageSkeleton } from "@/Components/Skeletons/ImageSkeleton";
import { useProgressiveImage } from "@/Hooks/useProgressiveImage";
import { IPictureWithPercentile } from "@/Types/picture";
import { IUser } from "@/Types/user";
import { isAdmin, isRegular } from "@/Utils/role";
import { EllipsisVerticalIcon, XMarkIcon } from "@heroicons/react/20/solid";

interface IPhotoCard {
  pic: string;
  loggedUser: IUser;
  index: number;
  onClickDeletePic: (event: React.MouseEvent) => Promise<void>;
  onClickBanUser: (event: React.MouseEvent) => Promise<void>;
  picInfo: IPictureWithPercentile;
}

export const PhotoCard = ({
  pic,
  loggedUser,
  picInfo,
  index,
  onClickDeletePic: handleClickDeletePic,
  onClickBanUser: handleClickBanUser,
}: IPhotoCard) => {
  const { img } = useProgressiveImage(pic);

  return (
    <div className="w-1/2 md:w-1/3 lg:w-1/4 float-left p-3">
      <div className="cursor-pointer rounded-b-md shadow-md">
        <div className="relative">
          {loggedUser && isAdmin(loggedUser.role) && (
            <div className="absolute right-[2%] top-[2%] origin-top-right">
              <Menu
                items={[
                  {
                    label: "Delete Photo",
                    onClick: handleClickDeletePic,
                  },
                  {
                    label: "Ban User",
                    onClick: handleClickBanUser,
                    disabled: loggedUser.id === picInfo.userId,
                  },
                ]}
              >
                <EllipsisVerticalIcon className="p-[2px] h-5 w-5 cursor-pointer rounded-full bg-white bg-opacity-30 hover:bg-opacity-60 transition duration-200" />
              </Menu>
            </div>
          )}
          {loggedUser && isRegular(loggedUser.role) && (
            <XMarkIcon
              onClick={handleClickDeletePic}
              className="absolute right-[2%] top-[2%] origin-top-right h-5 w-5 cursor-pointer rounded-full bg-white bg-opacity-30 hover:bg-opacity-60 transition duration-200"
            />
          )}
          <div className="rounded-t-md overflow-hidden">
            {img && (
              <img
                className="mx-auto w-full"
                src={img}
                onLoad={() => {}}
                alt={`picture-${index}`}
              />
            )}
            {!img && <ImageSkeleton divClass="aspect-square" />}
          </div>
        </div>
        <div className="p-3 font-semibold text-sm">
          <div>score: {picInfo.numVotes > 0 ? (picInfo.percentile / 10).toFixed(1) : "-"}</div>
          <div>votes: {picInfo.numVotes}</div>
        </div>
      </div>
    </div>
  );
};
