import {
  MdOutlinePhotoLibrary,
  MdPercent,
  MdSpeed,
  MdOutlineManageAccounts,
  MdTune,
  MdBalance,
  MdCheckCircleOutline,
  MdOutlineCancel,
  MdExpandMore,
  MdExpandLess,
} from "react-icons/md";
import { IconContext } from "react-icons";
import { useState } from "react";

function App() {
  const FAQ = [
    {
      question: "Is Photo Scorer free?",
      answer:
        "Photo Scorer is 100% free. Additional paid features may be added in the future, but we want to keep the core high quality and free.",
      height: 50,
    },
    {
      question: "Why not use a 1-10 scale?",
      answer: (
        <>
          1-10 rating system has many problems:
          <ul className="list-inside mt-1">
            <li>
              <span className="inline-block mr-2 align-middle">
                <IconContext.Provider value={{ color: "#EF4444" }}>
                  <MdOutlineCancel />
                </IconContext.Provider>
              </span>
              <b className="font-semibold">Highly subjective</b>: people have different voting
              styles.
            </li>
            <li>
              <span className="inline-block mr-2 align-middle">
                <IconContext.Provider value={{ color: "#EF4444" }}>
                  <MdOutlineCancel />
                </IconContext.Provider>
              </span>
              <b className="font-semibold">Inconsistent</b>: The same person changes their voting
              style regularly.
            </li>
            <li>
              <span className="inline-block mr-2 align-middle">
                <IconContext.Provider value={{ color: "#EF4444" }}>
                  <MdOutlineCancel />
                </IconContext.Provider>
              </span>
              <b className="font-semibold">Tedious and slow</b>: Having 10 highly subjective options
              is slow and tiring.
            </li>
          </ul>
          <br />
          With a side-by-side voting system we aim for:
          <ul className="list-inside mt-1">
            <li>
              <span className="inline-block mr-2 align-middle">
                <IconContext.Provider value={{ color: "#0E9F6E" }}>
                  <MdCheckCircleOutline />
                </IconContext.Provider>
              </span>
              <b className="font-semibold">Fast and fun voting</b>: choosing the prefered picture is
              much simpler and quick.
            </li>
            <li>
              <span className="inline-block mr-2 align-middle">
                <IconContext.Provider value={{ color: "#0E9F6E" }}>
                  <MdCheckCircleOutline />
                </IconContext.Provider>
              </span>
              <b className="font-semibold">Consistency</b>: having a binary choice makes voting
              consistent.
            </li>
            <li>
              <span className="inline-block mr-2 align-middle">
                <IconContext.Provider value={{ color: "#0E9F6E" }}>
                  <MdCheckCircleOutline />
                </IconContext.Provider>
              </span>
              <b className="font-semibold">More votes and accuracy</b>: our method allows users to
              give 4 to 20 times more votes. Leading to higher accuracy and a quicker feedback. For
              each click, 2 votes happen: the winner and the loser.
            </li>
          </ul>
        </>
      ),
      height: 258,
    },
    {
      question: "How to interpret my picture's score?",
      answer: (
        <>
          <div>
            The score tells you how well you compare to others in terms of attractiveness, by giving
            you a percentile.
          </div>
          <br />
          <div>
            For example: Top 10% means that you are in the best 10%, better than 90% of the
            population. Or "Bottom 10%" means you are worse than 90% of the population.
          </div>
          <br />
          <div>
            Try not to take it personally, as many factors like photo quality, facial expression,
            etc. have a high effect. Instead, test multiple pictures to find out which ones people
            prefer.
          </div>
        </>
      ),
      height: 199,
    },
    {
      question: "How are the scores obtained?",
      answer: (
        <>
          <div>
            Our algorithm works similarly to the one used in chess or online gaming to calculate the
            "elo" of each image, but it is optimized for our case. For each match, depending on how
            strong the adversary is, the score is updated. The pictures are then sorted by elo and
            their % score can be inferred.
          </div>
          <br />
          <div>
            We also make sure to match 2 pictures with similar elos. This improves the accuracy,
            allows for a quicker convergence, and avoids big jumps in the score.
          </div>
        </>
      ),
      height: 174,
    },
  ];

  const Accordion = () => {
    const [openItem, setOpenItem] = useState(0);

    const handleClick = (index: number) => () => {
      if (openItem === index) {
        setOpenItem(-1);
      } else {
        setOpenItem(index);
      }
    };

    return (
      <div>
        {FAQ.map(({ question, answer, height }, index) => (
          <div key={question} className="border rounded-md p-6 mb-2">
            <div
              onClick={handleClick(index)}
              className="flex justify-between items-center cursor-pointer"
            >
              <div className="text-[20px] leading-[20px] font-medium text-[#374048]">
                {question}
              </div>
              <IconContext.Provider value={{ color: "#374048", size: "30" }}>
                {openItem === index ? <MdExpandLess /> : <MdExpandMore />}
              </IconContext.Provider>
            </div>
            <div className="overflow-hidden">
              <div
                className={`text-[15px] leading-[25px] font-light text-[#82898f] transition-all ease-in-out duration-500 ${
                  openItem === index ? `mt-6` : "mt-0"
                }`}
                style={{
                  maxHeight: openItem === index ? height : 0,
                }}
              >
                {answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="font-poppins">
      <section className="h-[100vh] min-h-[680px] bg-[#F8FBFD]">
        <div className="flex mx-5 sm:mx-[70px] my-auto h-full">
          <div className="w-[100%] my-auto">
            <div className="font-semibold text-[#374048 max-[350px]:text-2xl max-[500px]:text-[30px] max-[900px]:text-[35px] max-[900px]:leading-[35px] text-[68px] leading-[68px] mb-2 text-center">
              Find your best photo
            </div>
            <div className="text-[#8a9095] max-[350px]:text-lg max-[500px]:text-xl text-[24px] mb-[40px] text-center">
              Let strangers rate your pictures, in a fun side-by-side comparison
            </div>
            <div className="flex justify-center max-[370px]:gap-3 gap-5 mb-[40px]">
              <div className="cursor-pointer rounded-t-md shadow-md w-56">
                <div className="relative">
                  <div className="rounded-t-md overflow-hidden">
                    <img className="mx-auto w-full" src="/dude.jpg" alt="hero-pic" />
                  </div>
                </div>
                <div className="p-3 font-semibold text-[8px] min-[300px]:text-[10px] min-[350px]:text-xs xs:text-sm bg-white rounded-b-md">
                  <div className="flex justify-between">
                    <span>Score:</span> <span>Top 17%</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between">
                    <span>Votes:</span> <span>35</span>
                  </div>
                </div>
              </div>
              <div className="cursor-pointer rounded-t-md shadow-md w-56">
                <div className="relative">
                  <div className="rounded-t-md overflow-hidden">
                    <img className="mx-auto w-full" src="/dude2.jpg" alt="hero-pic" />
                  </div>
                </div>
                <div className="p-3 font-semibold text-[8px] min-[300px]:text-[10px] min-[350px]:text-xs xs:text-sm bg-white rounded-b-md">
                  <div className="flex justify-between">
                    <span>Score:</span> <span>Top 22%</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between">
                    <span>Votes:</span> <span>29</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <button className="bg-[#0084FF] hover:bg-[#006ACC] transition-colors ease-linear duration-300 max-[500px]:text-lg max-[500px]:py-4 max-[500px]:px-10 text-2xl py-5 font-medium text-white rounded-[60px] px-11">
                Test your photo
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="pt-20 md:pt-[104px] pb-[95px] px-5 sm:px-[70px]">
        <div className="text-3xl md:text-[48px] leading-[29px] text-[#374048] font-semibold text-center mb-[75px]">
          HOW IT WORKS
        </div>
        <div className="flex md:hidden gap-5 flex-col">
          <div className="bg-[#B2F7D5] rounded-3xl py-8 px-[15%] m-auto">
            <div className="rounded-lg overflow-hidden">
              <img src="/upload.png" alt="step1" />
            </div>
          </div>
          <div className="pl-3 lg:pl-20 my-auto">
            <div className="text-[#374048] text-2xl font-semibold mb-5">1. Upload Photo</div>
            <div className="text-[#82898f] text-base font-light mb-5">
              Upload a picture you want to get rated. You can upload multiple if you wish.
            </div>
            <button className="bg-[#0084FF] hover:bg-[#006ACC] transition-colors ease-linear duration-300 text-base py-4 px-8 font-medium text-white rounded-[60px]">
              Upload Photo
            </button>
          </div>
        </div>
        <div className="hidden md:flex gap-5 ">
          <div className="w-1/2 bg-[#B2F7D5] rounded-3xl py-8 px-[15%] m-auto">
            <div className="rounded-lg overflow-hidden">
              <img src="/upload.png" alt="step1" />
            </div>
          </div>
          <div className="w-1/2 pl-3 lg:pl-20 my-auto">
            <div className="text-[#374048] text-3xl lg:text-4xl font-semibold mb-5">
              1. Upload Photo
            </div>
            <div className="text-[#82898f] text-lg font-light mb-5">
              Upload a picture you want to get rated. You can upload multiple if you wish.
            </div>
            <button className="bg-[#0084FF] hover:bg-[#006ACC] transition-colors ease-linear duration-300 max-[500px]:text-lg max-[500px]:py-4 max-[500px]:px-10 text-lg py-[18px] px-[34px] font-medium text-white rounded-[60px]">
              Upload Photo
            </button>
          </div>
        </div>

        <div className="flex md:hidden gap-5 flex-col mt-20">
          <div className="bg-[#B2E6F7] rounded-3xl py-8 px-[15%] m-auto">
            <div className="rounded-lg overflow-hidden">
              <img src="/side-by-side-click.png" alt="step2" />
            </div>
          </div>
          <div className="pl-3 lg:pl-20 my-auto">
            <div className="text-[#374048] text-2xl font-semibold mb-5">2. Receive Votes</div>
            <div className="text-[#82898f] text-base font-light mb-5">
              Get rated by strangers based on attractiveness. Our unique side-by-side voting system
              allows for more votes and avoids gray areas typical in 1-10 rating.
            </div>
            <button className="bg-[#0084FF] hover:bg-[#006ACC] transition-colors ease-linear duration-300 text-base py-4 px-8 font-medium text-white rounded-[60px]">
              Start Voting Now
            </button>
          </div>
        </div>

        <div className="hidden md:flex gap-5 mt-[100px]">
          <div className="w-1/2 pr-3 lg:pr-20 my-auto">
            <div className="text-[#374048] text-3xl lg:text-4xl font-semibold mb-5">
              2. Receive Votes
            </div>
            <div className="text-[#82898f] text-lg font-light mb-5">
              Get rated by strangers based on attractiveness. Our unique side-by-side voting system
              allows for more votes and avoids gray areas typical in 1-10 rating.
            </div>
            <button className="bg-[#0084FF] hover:bg-[#006ACC] transition-colors ease-linear duration-300 max-[500px]:text-lg max-[500px]:py-4 max-[500px]:px-10 text-lg py-[18px] px-[34px] font-medium text-white rounded-[60px]">
              Start Voting Now
            </button>
          </div>
          <div className="w-1/2 bg-[#B2E6F7] rounded-3xl p-8 m-auto">
            <div className="rounded-lg overflow-hidden">
              <img src="/side-by-side-click.png" alt="step2" />
            </div>
          </div>
        </div>

        <div className="flex md:hidden gap-5 flex-col mt-20">
          <div className="bg-[#FFFFB2] rounded-3xl py-8 px-[15%] m-auto">
            <div className="rounded-lg overflow-hidden">
              <img src="/score.png" alt="step3" />
            </div>
          </div>
          <div className="pl-3 lg:pl-20 my-auto">
            <div className="text-[#374048] text-2xl font-semibold mb-5">3. Get Score</div>
            <div className="text-[#82898f] text-base font-light mb-5">
              Discover how does you photo compare to the general population.
            </div>
            <button className="bg-[#0084FF] hover:bg-[#006ACC] transition-colors ease-linear duration-300 text-base py-4 px-8 font-medium text-white rounded-[60px]">
              Find your rating
            </button>
          </div>
        </div>
        <div className="hidden md:flex gap-5 mt-[100px]">
          <div className="w-1/2 bg-[#FFFFB2] rounded-3xl px-[9%] pt-8 m-auto">
            <div className="rounded-t-lg overflow-hidden">
              <img src="/score.png" alt="step3" />
            </div>
          </div>
          <div className="w-1/2 pl-3 lg:pl-20 my-auto">
            <div className="text-[#374048] text-3xl lg:text-4xl font-semibold mb-5">
              3. Get Score
            </div>
            <div className="text-[#82898f] text-lg font-light mb-5">
              Discover how does you photo compare to the general population.
            </div>
            <button className="bg-[#0084FF] hover:bg-[#006ACC] transition-colors ease-linear duration-300 max-[500px]:text-lg max-[500px]:py-4 max-[500px]:px-10 text-lg py-[18px] px-[34px] font-medium text-white rounded-[60px]">
              Find your rating
            </button>
          </div>
        </div>
      </section>
      <section className="py-20 md:py-[111px] px-5 sm:px-[70px] bg-[#F8FBFD]">
        <div className="text-3xl md:text-[48px] leading-[29px] text-[#374048] font-semibold text-center mb-[25px]">
          FEATURES
        </div>
        <div className="mb-[25px]">
          <div className="w-[82px] h-[6px] bg-[#eee] mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <div className="mt-[60px] md:px-[15px]">
            <div className="flex">
              <div className="w-[70px] min-w-[70px] flex justify-center items-start">
                <IconContext.Provider value={{ color: "#0084ff", className: "text-[36px]" }}>
                  <MdOutlinePhotoLibrary />
                </IconContext.Provider>
              </div>
              <div>
                <div className="text-[#374048] text-[20px] leading-[20px] font-semibold mb-[6px]">
                  Many Votes Quickly
                </div>
                <div className="text-[#82898f] text-[14px] leading-[22px] font-light">
                  Our side-by-side makes voting easy and fun, leading to more votes and greater
                  accuracy.
                </div>
              </div>
            </div>
          </div>
          <div className="mt-[60px] md:px-[15px]">
            <div className="flex">
              <div className="w-[70px] min-w-[70px] flex justify-center items-start">
                <IconContext.Provider value={{ color: "#0084ff", className: "text-[36px]" }}>
                  <MdOutlineManageAccounts />
                </IconContext.Provider>
              </div>
              <div>
                <div className="text-[#374048] text-[20px] leading-[20px] font-semibold mb-[6px]">
                  Choose Your Judges
                </div>
                <div className="text-[#82898f] text-[14px] leading-[22px] font-light">
                  Select the age and gender of your voters for targeted feedback.
                </div>
              </div>
            </div>
          </div>
          <div className="mt-[60px] md:px-[15px]">
            <div className="flex">
              <div className="w-[70px] min-w-[70px] flex justify-center items-start">
                <IconContext.Provider value={{ color: "#0084ff", className: "text-[36px]" }}>
                  <MdSpeed />
                </IconContext.Provider>
              </div>
              <div>
                <div className="text-[#374048] text-[20px] leading-[20px] font-semibold mb-[6px]">
                  High Accuracy
                </div>
                <div className="text-[#82898f] text-[14px] leading-[22px] font-light">
                  Our algorithm is designed for speed and precision, delivering reliable photo
                  rankings quickly.
                </div>
              </div>
            </div>
          </div>
          <div className="mt-[60px] md:px-[15px]">
            <div className="flex">
              <div className="w-[70px] min-w-[70px] flex justify-center items-start">
                <IconContext.Provider value={{ color: "#0084ff", className: "text-[36px]" }}>
                  <MdTune />
                </IconContext.Provider>
              </div>
              <div>
                <div className="text-[#374048] text-[20px] leading-[20px] font-semibold mb-[6px]">
                  Vote Your Way
                </div>
                <div className="text-[#82898f] text-[14px] leading-[22px] font-light">
                  Pick the photos you want to vote based on age and gender preferences.
                </div>
              </div>
            </div>
          </div>
          <div className="mt-[60px] md:px-[15px]">
            <div className="flex">
              <div className="w-[70px] min-w-[70px] flex justify-center items-start">
                <IconContext.Provider value={{ color: "#0084ff", className: "text-[36px]" }}>
                  <MdBalance />
                </IconContext.Provider>
              </div>
              <div>
                <div className="text-[#374048] text-[20px] leading-[20px] font-semibold mb-[6px]">
                  Bias-Free Voting
                </div>
                <div className="text-[#82898f] text-[14px] leading-[22px] font-light">
                  Binary decisions remove ambiguity, making each vote more meaningful and reliable.
                </div>
              </div>
            </div>
          </div>
          <div className="mt-[60px] md:px-[15px]">
            <div className="flex">
              <div className="w-[70px] min-w-[70px] flex justify-center items-start">
                <IconContext.Provider value={{ color: "#0084ff", className: "text-[36px]" }}>
                  <MdPercent />
                </IconContext.Provider>
              </div>
              <div>
                <div className="text-[#374048] text-[20px] leading-[20px] font-semibold mb-[6px]">
                  Where Do You Rank?
                </div>
                <div className="text-[#82898f] text-[14px] leading-[22px] font-light">
                  Find out your photo's numerical rank against others.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <section className="pt-[98px] pb-[78px] px-[70px]">
        <div className="text-[48px] leading-[29px] text-[#374048] font-semibold text-center mb-[25px]">
          FAQ
        </div>
        <div className="mb-[25px]">
          <div className="text-[#969da3] text-xl text-center leading-8 font-thin mb-5 mx-[130px]">
            Got more questions? Feel free to send us an email to{" "}
            <a href="#" className="text-[#0084ff]">
              hello@product.com
            </a>
          </div>
          <div className="w-[82px] h-[6px] bg-[#eee] mx-auto" />
        </div>
        <Accordion />
      </section> */}
    </div>
  );
}

export default App;
