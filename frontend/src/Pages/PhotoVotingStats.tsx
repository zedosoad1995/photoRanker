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
      {stats.map((stat) => (
        <div className="flex">
          <img src={String(stat.winner)} />
          <img src={String(stat.loser)} />
        </div>
      ))}
    </>
  );
};
