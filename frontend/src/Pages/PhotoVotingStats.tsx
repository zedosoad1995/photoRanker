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
          <div className="mb-6 rounded-lg border shadow overflow-clip bg-white">
            <div className="flex items-center">
              <div className={`relative`}>
                <img src={String(selectedPic)} />
                {stat.is_winner && (
                  <div
                    style={{
                      background:
                        "linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(34, 197, 94, 0.9) 100%)",
                    }}
                    className="absolute -translate-x-1/2 left-1/2 top-0 text-center pb-4 w-full font-semibold text-white"
                  >
                    Winner
                  </div>
                )}
                {!stat.is_winner && (
                  <div
                    style={{
                      background:
                        "linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(255, 0, 0, 0.9) 100%)",
                    }}
                    className="absolute -translate-x-1/2 left-1/2 top-0 text-center pb-4 w-full font-semibold text-white"
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
                        "linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(34, 197, 94, 0.9) 100%)",
                    }}
                    className="absolute -translate-x-1/2 left-1/2 top-0 text-center pb-4 w-full font-semibold text-white"
                  >
                    Winner
                  </div>
                )}
                {stat.is_winner && (
                  <div
                    style={{
                      background:
                        "linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(255, 0, 0, 0.9) 100%)",
                    }}
                    className="absolute -translate-x-1/2 left-1/2 top-0 text-center pb-4 w-full font-semibold text-white"
                  >
                    Loser
                  </div>
                )}
              </div>
            </div>
            <div>
              <div className="text-sm text-center font-medium py-1 bg-primary text-white">
                Voter Info
              </div>
              <div className="border-b-2 mx-2" />
              <div className="flex bg-white">
                <div className="flex flex-col w-1/4 items-center py-2">
                  <div className="font-semibold text-placeholder-text text-xs">GENDER</div>
                  <div className="font-semibold">{stat.voter_gender}</div>
                </div>
                <div className="my-2 w-0 border-l-2" />
                <div className="flex flex-col w-1/4 items-center py-2">
                  <div className="font-semibold text-placeholder-text text-xs">AGE</div>
                  <div className="font-semibold">{stat.voter_age}</div>
                </div>
                <div className="my-2 w-0 border-l-2" />
                <div className="flex flex-col w-1/4 items-center py-2">
                  <div className="font-semibold text-placeholder-text text-xs">COUNTRY</div>
                  <div className="font-semibold">{stat.voter_country}</div>
                </div>
                <div className="my-2 w-0 border-l-2" />
                <div className="flex flex-col w-1/4 items-center py-2">
                  <div className="font-semibold text-placeholder-text text-xs">ETHNICITY</div>
                  <div className="font-semibold">{stat.voter_ethnicity}</div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};
