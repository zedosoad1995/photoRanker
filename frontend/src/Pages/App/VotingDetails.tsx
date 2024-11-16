import { useInView } from "react-intersection-observer";

export const VotingDetails = () => {
  const { ref: rootRef, inView: inViewRoot } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  return (
    <div
      ref={rootRef}
      className={`${
        inViewRoot ? "opacity-100" : "opacity-0"
      } transition-opacity duration-500 ease-in`}
    >
      <div className="text-[#374048] text-3xl lg:text-4xl font-semibold mb-5 text-center">
        Voting Details
      </div>
      <div className="text-[#82898f] text-lg font-light mb-5 text-center">
        Analyse all your votes you've received: who did you win/lose against;
        demographic information about the voter (gender, age, nationality,
        ethnicity).
      </div>
      <div className="flex justify-center">
        <img
          className="mx-auto w-full max-w-lg"
          src="/vote_details.webp"
          alt="vote details"
        />
      </div>
    </div>
  );
};
