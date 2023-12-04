import { getPictureVotingStats } from "@/Services/picture";
import { IPictureVotingStats } from "@/Types/picture";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const PhotoVotingStats = () => {
  const [stats, setStats] = useState<IPictureVotingStats[]>([]);

  const { pictureId } = useParams();

  useEffect(() => {
    if (!pictureId) {
      return;
    }

    getPictureVotingStats(pictureId).then(({ stats }) => setStats(stats));
  }, [pictureId]);

  return (
    <>
      {stats.map((stat) => {
        const selectedPic = stat.is_winner ? stat.winner : stat.loser;
        const otherPic = stat.is_winner ? stat.loser : stat.winner;

        return (
          <div className="mb-6 rounded-md border-2 p-4">
            <div className="text-xl font-bold mb-1">Voter Info</div>
            <div className="flex flex-wrap mb-4">
              <div className="mr-4">
                <b className="font-semibold">Gender</b>: {stat.voter_gender}
              </div>
              <div className="mr-4">
                <b className="font-semibold">Age</b>: {stat.voter_age}
              </div>
              <div className="mr-4">
                <b className="font-semibold">Country</b>: {stat.voter_country}
              </div>
              <div className="">
                <b className="font-semibold">Ethnicity</b>: {stat.voter_ethnicity}
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <div className={`relative`}>
                <img src={String(selectedPic)} />
                {stat.is_winner && (
                  <div
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(34, 197, 94, 0.9) 100%)",
                    }}
                    className="absolute -translate-x-1/2 -translate-y-full left-1/2 text-center pt-4 w-full font-semibold text-white"
                  >
                    Winner
                  </div>
                )}
                {!stat.is_winner && (
                  <div
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(255, 0, 0, 0.9) 100%)",
                    }}
                    className="absolute -translate-x-1/2 -translate-y-full left-1/2 text-center pt-4 w-full font-semibold text-white"
                  >
                    Loser
                  </div>
                )}
              </div>
              <div className={`relative`}>
                <img src={String(otherPic)} />
                {!stat.is_winner && (
                  <div
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(34, 197, 94, 0.9) 100%)",
                    }}
                    className="absolute -translate-x-1/2 -translate-y-full left-1/2 text-center pt-4 w-full font-semibold text-white"
                  >
                    Winner
                  </div>
                )}
                {stat.is_winner && (
                  <div
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(255, 0, 0, 0.9) 100%)",
                    }}
                    className="absolute -translate-x-1/2 -translate-y-full left-1/2 text-center pt-4 w-full font-semibold text-white"
                  >
                    Loser
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};
