import {
  MdOutlinePhotoLibrary,
  MdPercent,
  MdSpeed,
  MdOutlineManageAccounts,
  MdTune,
  MdBalance,
  MdCheckCircleOutline,
  MdOutlineCancel,
} from "react-icons/md";
import { IconContext } from "react-icons";

function App() {
  return (
    <div className="font-poppins">
      <section className="h-[100vh] min-h-[680px] bg-[#F8FBFD]">
        <div className="flex mx-[70px] my-auto h-full">
          <div className="w-[100%] my-auto">
            <div className="font-semibold text-[#374048] text-[68px] leading-[68px] mb-2 text-center">
              Find your best photo
            </div>
            <div className="text-[#8a9095] text-[24px] mb-[40px] text-center">
              Let strangers rate your pictures, in a fun side-by-side comparison
            </div>
            <div className="flex justify-center gap-5 mb-[40px]">
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
              <button className="bg-[#0084FF] hover:bg-[#006ACC] transition-colors ease-linear duration-300 text-[22px] leading-[65px] font-medium text-white rounded-[60px] px-[45px]">
                Test your photo now
              </button>
            </div>
          </div>
          {/* <div className="hidden xl:flex h-full items-center gap-6">
            <div className="w-[60%]">
              <div className="font-semibold text-white text-[68px] mb-[20px]">
                Find your best look
              </div>
              <div className="text-white/70 text-[24px] mb-[40px]">
                Let strangers rate your pictures, in a fun side-by-side comparison
              </div>
              <button className="bg-[#a52a2a] hover:bg-[#7c2020] transition-colors ease-linear duration-300 text-[22px] leading-[65px] font-medium text-white rounded-[60px] px-[45px]">
                Test your photo now
              </button>
            </div>
            <div className="flex justify-center gap-5">
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
          </div> */}
        </div>
      </section>
      <section className="pt-[104px] pb-[95px] px-[70px]">
        <div className="text-[48px] leading-[29px] text-[#374048] font-semibold text-center mb-[75px]">
          HOW IT WORKS
        </div>
        <div className="flex gap-5">
          <div className="w-1/2 bg-[#B2F7D5] rounded-3xl py-8 px-[15%]">
            <div className="rounded-lg overflow-hidden">
              <img src="/upload.png" alt="step1" />
            </div>
          </div>
          <div className="w-1/2 pl-20 my-auto">
            <div className="text-[#374048] text-4xl font-semibold mb-5">1. Upload Photo</div>
            <div className="text-[#82898f] text-lg font-light mb-5">
              Upload a picture you want to get rated. You can upload multiple if you wish.
            </div>
            <button className="bg-[#0084FF] hover:bg-[#006ACC] transition-colors ease-linear duration-300 text-[22px] leading-[65px] font-medium text-white rounded-[60px] px-[45px]">
              Upload photo
            </button>
          </div>
        </div>
        <div className="flex gap-5 mt-[100px]">
          <div className="w-1/2 pr-20 my-auto">
            <div className="text-[#374048] text-4xl font-semibold mb-5">2. Receive Votes</div>
            <div className="text-[#82898f] text-lg font-light mb-5">
              Get rated by strangers based on attractiveness. Our unique side-by-side voting system
              allows for more votes and avoids gray areas typical in 1-10 rating.
            </div>
            <button className="bg-[#0084FF] hover:bg-[#006ACC] transition-colors ease-linear duration-300 text-[22px] leading-[65px] font-medium text-white rounded-[60px] px-[45px]">
              Start Voting Now
            </button>
          </div>
          <div className="w-1/2 bg-[#82E6F7] rounded-3xl p-8">
            <div className="rounded-t-lg overflow-hidden">
              <img src="/side-by-side-click.png" alt="step2" />
            </div>
          </div>
        </div>
        <div className="flex gap-5 mt-[100px]">
          <div className="w-1/2 bg-[#FFFFB2] rounded-3xl px-[9%] pt-8">
            <div className="rounded-t-lg overflow-hidden">
              <img src="/score.png" alt="step3" />
            </div>
          </div>
          <div className="w-1/2 pl-20 my-auto">
            <div className="text-[#374048] text-4xl font-semibold mb-5">3. Get Score</div>
            <div className="text-[#82898f] text-lg font-light mb-5">
              Discover how does you photo compare to the general population.
            </div>
            <button className="bg-[#0084FF] hover:bg-[#006ACC] transition-colors ease-linear duration-300 text-[22px] leading-[65px] font-medium text-white rounded-[60px] px-[45px]">
              Find your rating
            </button>
          </div>
        </div>
      </section>
      <section className="py-[111px] px-[70px] bg-[#F8FBFD]">
        <div className="text-[48px] leading-[29px] text-[#374048] font-semibold text-center mb-[25px]">
          FEATURES
        </div>
        <div className="mb-[25px]">
          <div className="w-[82px] h-[6px] bg-[#eee] mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <div className="mt-[60px] px-[15px]">
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
          <div className="mt-[60px] px-[15px]">
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
          <div className="mt-[60px] px-[15px]">
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
          <div className="mt-[60px] px-[15px]">
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
          <div className="mt-[60px] px-[15px]">
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
          <div className="mt-[60px] px-[15px]">
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
      <section className="pt-[98px] pb-[78px] px-[70px]">
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
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="mt-[60px] px-[15px]">
            <div className="text-[20px] leading-[20px] font-medium text-[#374048] mb-[8px]">
              Is it free?
            </div>
            <div className="text-[15px] leading-[25px] font-light text-[#82898f]">
              For now it is 100% free. But this may change in the future.
            </div>
          </div>
          <div className="mt-[60px] px-[15px]">
            <div className="text-[20px] leading-[20px] font-medium text-[#374048] mb-[8px]">
              Why not use a 1-10 scale?
            </div>
            <div className="text-[15px] leading-[25px] font-light text-[#82898f]">
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
                  <b className="font-semibold">Inconsistent</b>: The same person changes their
                  voting style regularly.
                </li>
                <li>
                  <span className="inline-block mr-2 align-middle">
                    <IconContext.Provider value={{ color: "#EF4444" }}>
                      <MdOutlineCancel />
                    </IconContext.Provider>
                  </span>
                  <b className="font-semibold">Tedious and slow</b>: Having 10 highly subjective
                  options is slow and tiring.
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
                  <b className="font-semibold">Fast and fun voting</b>: choosing the prefered
                  picture is much simpler and quick.
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
                  <b className="font-semibold">More votes and accuracy</b>: our method allows users
                  to give 4 to 20 times more votes. Leading to higher accuracy and a quicker
                  feedback. For each click, 2 votes happen: the winner and the loser.
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-[60px] px-[15px]">
            <div className="text-[20px] leading-[20px] font-medium text-[#374048] mb-[8px]">
              How to interpret my picture's score?
            </div>
            <div className="text-[15px] leading-[25px] font-light text-[#82898f]">
              <div>
                The score tells you how well you compare to others in terms of attractiveness, by
                giving you a percentile.
              </div>
              <br />
              <div>
                For example: Top 10% means that you are in the best 10%, better than 90% of the
                population. Or "Bottom 10%" means you are worse than 90% of the population.
              </div>
              <br />
              <div>
                Try not to take it personally, as many factors like photo quality, facial
                expression, etc. have a high effect. Instead, test multiple pictures to find out
                which ones people prefer.
              </div>
            </div>
          </div>
          <div className="mt-[60px] px-[15px]">
            <div className="text-[20px] leading-[20px] font-medium text-[#374048] mb-[8px]">
              How are the scores obtained?
            </div>
            <div className="text-[15px] leading-[25px] font-light text-[#82898f]">
              <div>
                Our algorithm works similarly to the one used in chess or online gaming to calculate
                the "elo" of each image, but it is optimized for our case. For each match, depending
                on how strong the adversary is, the score is updated. The pictures are then sorted
                by elo and their % score can be inferred.
              </div>
              <br />
              <div>
                We also make sure to match 2 pictures with similar elos. This improves the accuracy,
                allows for a quicker convergence, and avoids big jumps in the score.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
