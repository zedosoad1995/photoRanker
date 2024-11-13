export const VotingDetails = () => {
  return (
    <section className="py-20 md:py-[111px] px-5 sm:px-[70px] bg-[#F8FBFD]">
      <div
        className={`text-3xl md:text-[48px] leading-[29px] text-[#374048] font-semibold text-center mb-[25px]`}
      >
        Voting Details
      </div>
      <div className="mb-[25px] w-[82px] h-[6px] bg-[#eee] mx-auto" />
      <div className="text-[#82898f] text-base font-light mb-5 text-center">
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
    </section>
  );
};
