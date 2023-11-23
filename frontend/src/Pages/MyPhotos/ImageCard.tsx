import { useRef, useState, useEffect, useMemo } from "react";
import Menu from "@/Components/Menu";
import { ImageSkeleton } from "@/Components/Skeletons/ImageSkeleton";
import { useProgressiveImage } from "@/Hooks/useProgressiveImage";
import { IPictureWithPercentile } from "@/Types/picture";
import { IUser } from "@/Types/user";
import { isAdmin, isRegular } from "@/Utils/role";
import { EllipsisVerticalIcon, LockClosedIcon, XMarkIcon } from "@heroicons/react/20/solid";
import BuyUnlimitedVotesModal from "./Modals/BuyUnlimitedVotesModal";
import { UNLIMITED_VOTE_ALL_ON } from "@shared/constants/purchase";

interface IPhotoCard {
  pic: string;
  loggedUser: IUser;
  index: number;
  isGlobal?: boolean;
  onClickDeletePic: (event: React.MouseEvent) => Promise<void>;
  onClickBanUser: (event: React.MouseEvent) => Promise<void>;
  picInfo: IPictureWithPercentile;
}

const getHumanReadablePerc = (perc: number) => {
  if (perc < 50) {
    if (perc < 0.1) return `Bottom <0.1%`;
    return `Bottom ${perc.toFixed(1)}%`;
  } else {
    if (perc > 99.9) return `Top <0.1%`;
    return `Top ${(100 - perc).toFixed(1)}%`;
  }
};

export const PhotoCard = ({
  pic,
  loggedUser,
  picInfo,
  index,
  isGlobal,
  onClickDeletePic: handleClickDeletePic,
  onClickBanUser: handleClickBanUser,
}: IPhotoCard) => {
  const { img } = useProgressiveImage(pic);

  const cardRef = useRef<HTMLDivElement | null>(null);

  const [isOpenUnlockVotesModal, setIsOpenUnlockVotesModal] = useState(false);
  const [width, setWidth] = useState(0);
  const isSmall = useMemo(() => width < 240, [width]);

  useEffect(() => {
    if (!cardRef.current) {
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(cardRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <>
      <BuyUnlimitedVotesModal
        pictureId={picInfo.id}
        currNumVotes={picInfo.numPaidVotes}
        isOpen={isOpenUnlockVotesModal}
        onClose={() => {
          setIsOpenUnlockVotesModal(false);
        }}
      />
      <div ref={cardRef} className="w-full min-[350px]:w-1/2 md:w-1/3 lg:w-1/4 p-2">
        <div className="cursor-pointer rounded-b-md shadow-md h-full">
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
              <div
                className={`mx-auto flex w-fit absolute left-1/2 bottom-0 -translate-x-1/2 ${
                  isSmall ? "text-xs" : "text-sm"
                }`}
              >
                <div className="text-white bg-slate-800 rounded-ss-md py-[6px] flex-1 text-center px-2">
                  Votes
                </div>
                <div className="bg-white rounded-se-md py-[6px] flex-1 text-center font-bold px-2">
                  {picInfo.numVotes}
                </div>
              </div>

              {img && <img className="mx-auto w-full" src={img} alt={`picture-${index}`} />}
              {!img && (
                <div className="relative -z-10">
                  <ImageSkeleton divClass="aspect-square" />
                </div>
              )}
            </div>
          </div>
          <div className={`p-3 pb-4 font-semibold ${isSmall ? "text-xs" : "text-sm"}`}>
            <div className="flex justify-between mb-1">
              <span>Score</span>{" "}
              <span>
                {picInfo.numVotes > 0 && picInfo.percentile
                  ? isGlobal
                    ? getHumanReadablePerc(picInfo.percentile)
                    : picInfo.percentile.toFixed(1)
                  : "-"}
              </span>
            </div>
            <div className="rounded-md h-2 bg-light-contour overflow-hidden">
              <div
                className="rounded-md bg-primary h-full"
                style={{
                  width:
                    picInfo.percentile === null ? "0%" : (picInfo.percentile * 99) / 100 + 1 + "%",
                }}
              />
            </div>
            {picInfo.cannotSeeAllVotes && UNLIMITED_VOTE_ALL_ON && (
              <>
                <div className="flex justify-between mb-1 mt-2">
                  <span>Score ({picInfo.numPaidVotes} votes)</span>{" "}
                </div>
                <div className="relative group">
                  <LockClosedIcon
                    onClick={() => {
                      setIsOpenUnlockVotesModal(true);
                    }}
                    className={`${
                      isSmall ? "w-5 h-5" : "w-6 h-6"
                    } absolute z-20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:opacity-70 transition-opacity duration-300`}
                  />
                  <div
                    className="bg-white absolute h-full w-full"
                    style={{
                      background:
                        "linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 70%)",
                    }}
                  />
                  <div className="rounded-md h-2 bg-light-contour overflow-hidden">
                    <div
                      className="rounded-md bg-amber-400 h-full"
                      style={{
                        width: "100%",
                      }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
