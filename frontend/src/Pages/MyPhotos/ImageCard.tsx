import { useRef, useState, useEffect, useMemo } from "react";
import Menu from "@/Components/Menu";
import { ImageSkeleton } from "@/Components/Skeletons/ImageSkeleton";
import { useProgressiveImage } from "@/Hooks/useProgressiveImage";
import { IPictureWithPercentile } from "@/Types/picture";
import { IUser } from "@/Types/user";
import { isAdmin } from "@/Utils/role";
import {
  EllipsisVerticalIcon,
  LockClosedIcon,
  PauseIcon,
  PlayIcon,
} from "@heroicons/react/20/solid";
import BuyUnlimitedVotesModal from "./Modals/BuyUnlimitedVotesModal";
import { UNLIMITED_VOTE_ALL_ON, UNLIMITED_VOTE_MULTIPLE_ON } from "@shared/constants/purchase";
import { Tooltip } from "@/Components/Tooltip";
import { updateImage } from "@/Services/picture";
import { useMyPhotos } from "./Contexts/myPhotos";
import PauseUnpauseModal from "./Modals/PauseUnpauseModal";
import { useNavigate } from "react-router-dom";
import { PHOTO_VOTING_STATS_PATH } from "@/Constants/routes";
import Button from "@/Components/Button";

interface IPhotoCard {
  pic: string;
  loggedUser: IUser;
  index: number;
  isGlobal?: boolean;
  onClickDeletePic: (event: React.MouseEvent) => Promise<void>;
  onClickBanUser: (event: React.MouseEvent) => Promise<void>;
  picInfo: IPictureWithPercentile;
  ageGroupStr?: string;
}

const getHumanReadablePerc = (perc: number) => {
  /* if (perc > 99.9) return `Top <0.1%`;
  return `Top ${(100 - perc).toFixed(1)}%`; */
  return perc.toFixed() + "%";
};

export const PhotoCard = ({
  pic,
  loggedUser,
  picInfo,
  index,
  isGlobal,
  onClickDeletePic: handleClickDeletePic,
  onClickBanUser: handleClickBanUser,
  ageGroupStr,
}: IPhotoCard) => {
  const { img } = useProgressiveImage(pic);
  const navigate = useNavigate();

  const cardRef = useRef<HTMLDivElement | null>(null);

  const [isOpenPauseUnpause, setIsOpenPauseUnpause] = useState(false);
  const [isOpenUnlockVotesModal, setIsOpenUnlockVotesModal] = useState(false);
  const [width, setWidth] = useState(0);
  const isSmall = useMemo(() => width < 240, [width]);

  const { dispatch, state } = useMyPhotos();

  const handleOpenPauseUnpauseModal = async () => {
    setIsOpenPauseUnpause(true);
  };

  const handlePauseUnpause = async () => {
    const picId = picInfo.id;

    const updatedPic = await updateImage(picId, { isActive: !picInfo.isActive });
    const updatedPics = state.picsInfo.reduce((pics, _pic) => {
      if (_pic.id !== picId) {
        return [...pics, _pic];
      }

      return [...pics, { ..._pic, isActive: updatedPic.isActive }];
    }, [] as IPictureWithPercentile[]);

    dispatch({ key: "picsInfo", value: updatedPics });
  };

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

  const overallScoreText = useMemo(() => {
    if (picInfo.numVotes === 0) {
      return (
        <>
          <div>You currently have no votes.</div>
          <div>Come back later to find out your score!</div>
        </>
      );
    }

    if (picInfo.percentile === null) {
      return null;
    }

    if (isGlobal) {
      return (
        <>
          <div>
            This photo is more attractive than {picInfo.percentile.toFixed(2)}% of the{" "}
            {loggedUser.gender} population in this app.
          </div>
        </>
      );
    }

    return (
      <>
        <div>
          This value is just a way to quantify how much better/worse each of your pictures is in
          relation to eachother. A score of 100, means it is your best picture.
        </div>
      </>
    );
  }, [picInfo.percentile]);

  const ageGroupScoreText = useMemo(() => {
    if (
      picInfo.numVotes === 0 ||
      picInfo.ageGroupPercentile === undefined ||
      ageGroupStr === undefined
    ) {
      return null;
    }

    return (
      <>
        <div>
          This photo is more attractive than {picInfo.ageGroupPercentile.toFixed(2)}% of the{" "}
          {loggedUser.gender} population for the age group {ageGroupStr}.
        </div>
      </>
    );
  }, [picInfo.percentile]);

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
      <PauseUnpauseModal
        isActive={picInfo.isActive}
        isOpen={isOpenPauseUnpause}
        onAccepted={handlePauseUnpause}
        onClose={() => {
          setIsOpenPauseUnpause(false);
        }}
      />
      <div ref={cardRef} className="w-full min-[365px]:w-1/2 md:w-1/3 lg:w-1/4 p-2 card-group">
        <div className="shadow-md h-full cursor-default rounded-md">
          <div className="relative">
            <div
              onClick={handleOpenPauseUnpauseModal}
              className={`absolute flex justify-center items-center gap-[2px] bg-white ${
                picInfo.isActive ? "card-group-child-active" : "card-group-child"
              } in rounded-xl py-1 px-2 left-1 top-1 cursor-pointer`}
            >
              {picInfo.isActive && (
                <>
                  <PauseIcon className="h-4 w-4 text-center" />
                  <div className="text-sm font-semibold leading-none">Active</div>
                </>
              )}
              {!picInfo.isActive && (
                <>
                  <PlayIcon className="h-4 w-4 text-center" />
                  <div className="text-sm font-semibold leading-none">Paused</div>
                </>
              )}
            </div>
            {loggedUser && (
              <div className="absolute right-[2%] top-[2%] origin-top-right">
                <Menu
                  items={[
                    {
                      label: picInfo.isActive ? "Pause Voting" : "Activate Photo",
                      onClick: handleOpenPauseUnpauseModal,
                    },
                    {
                      label: "Delete Photo",
                      onClick: handleClickDeletePic,
                    },
                    ...(isAdmin(loggedUser.role)
                      ? [
                          {
                            label: "Ban User",
                            onClick: handleClickBanUser,
                            disabled: loggedUser.id === picInfo.userId,
                          },
                        ]
                      : []),
                  ]}
                >
                  <EllipsisVerticalIcon className="p-[2px] h-5 w-5 cursor-pointer rounded-full bg-white bg-opacity-30 hover:bg-opacity-60 transition duration-200" />
                </Menu>
              </div>
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
          <div
            className={`bg-white p-3 pb-4 rounded-b-md font-semibold ${
              isSmall ? "text-xs" : "text-sm"
            }`}
          >
            <div className="flex justify-between mb-1">
              <span>{isGlobal ? "Overall" : "Score"}</span>{" "}
              <Tooltip tooltipText={overallScoreText}>
                <span>
                  {picInfo.numVotes > 0 && picInfo.percentile !== null
                    ? isGlobal
                      ? getHumanReadablePerc(picInfo.percentile)
                      : picInfo.percentile.toFixed(1)
                    : "-"}
                </span>
              </Tooltip>
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
            {ageGroupStr && picInfo.ageGroupPercentile !== undefined && (
              <>
                <div className="flex justify-between mb-1 mt-2">
                  <span>Age: {ageGroupStr}</span>{" "}
                  <Tooltip tooltipText={ageGroupScoreText}>
                    <span>
                      {picInfo.numVotes > 0
                        ? isGlobal
                          ? getHumanReadablePerc(picInfo.ageGroupPercentile)
                          : picInfo.ageGroupPercentile.toFixed(1)
                        : "-"}
                    </span>
                  </Tooltip>
                </div>
                <div className="rounded-md h-2 bg-light-contour overflow-hidden">
                  <div
                    className="rounded-md bg-orange-400 h-full"
                    style={{
                      width:
                        picInfo.ageGroupPercentile === undefined
                          ? "0%"
                          : (picInfo.ageGroupPercentile * 99) / 100 + 1 + "%",
                    }}
                  />
                </div>
              </>
            )}
            {picInfo.cannotSeeAllVotes && (UNLIMITED_VOTE_ALL_ON || UNLIMITED_VOTE_MULTIPLE_ON) && (
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
            <div className="mt-4 flex justify-center">
              <Button
                onClick={() => navigate(PHOTO_VOTING_STATS_PATH(picInfo.id))}
                isFull={false}
                variant="outline"
                size="small"
              >
                View Votes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
