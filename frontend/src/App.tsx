import {
  MdOutlinePhotoLibrary,
  MdPercent,
  MdSpeed,
  MdOutlineManageAccounts,
  MdTune,
  MdBalance,
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
        <div className="text-[48px] leading-[29px] text-[#374048] font-semibold text-center mb-[25px]">
          HOW IT WORKS
        </div>
        <div className="text-[#4E575F] text-xl text-center leading-8 font-thin mb-[70px] mx-[130px]">
          Get honest feedback from strangers to find out your best photo. Our fun side-by-side
          voting system allows for a high number of votes and precision.
        </div>
        <div className="flex w-full">
          <div className="flex flex-grow justify-center">
            <img alt="step 1" src="/desktop.png" />
          </div>
          <div className="flex-grow-0 flex items-center">
            <img alt="next arrow" src="/right-angle.png" />
          </div>
          <div className="flex flex-grow justify-center">
            <img alt="step 2" src="/toggles.png" />
          </div>
          <div className="flex-grow-0 flex items-center">
            <img alt="next arrow" src="/right-angle.png" />
          </div>
          <div className="flex flex-grow justify-center">
            <img alt="step 3" src="/trophy.png" />
          </div>
        </div>
        <div className="grid grid-cols-3 w-full mt-[60px]">
          <div className="px-[15px]">
            <div className="text-[#374048] font-semibold text-[26px] leading-[26px] text-center mb-[8px]">
              Upload Photo
            </div>
            <div className="text-[#737C85] font-light text-center">
              Upload a picture you want to get rated. You can upload multiple if you wish.
            </div>
          </div>
          <div className="px-[15px]">
            <div className="text-[#374048] font-semibold text-[26px] leading-[26px] text-center mb-[8px]">
              Get votes
            </div>
            <div className="text-[#737C85] font-light text-center">
              Get rated by strangers based on attractiveness. Our unique side-by-side voting system
              allows for more votes and avoids gray areas typical in 1-10 rating.
            </div>
          </div>
          <div className="px-[15px]">
            <div className="text-[#374048] font-semibold text-[26px] leading-[26px] text-center mb-[8px]">
              Receive Score
            </div>
            <div className="text-[#737C85] font-light text-center">
              Discover how does you photo compares to the general population (e.g top 10%).
            </div>
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
          <div className="mt-[60px] px-[15px]">
            <div className="flex">
              <div className="w-[70px] min-w-[70px] flex justify-center items-start">
                <IconContext.Provider value={{ color: "#0084ff", className: "text-[36px]" }}>
                  <MdOutlinePhotoLibrary />
                </IconContext.Provider>
              </div>
              <div>
                <div className="text-[#374048] text-[20px] leading-[20px] font-semibold mb-[6px]">
                  Speed Up the Votes
                </div>
                <div className="text-[#82898f] text-[14px] leading-[22px] font-light">
                  Our side-by-side voting is quick and enjoyable, ensuring more votes and greater
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
                  High Accuracy, Fewer Votes
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
                  Pick photos based on age and gender preferences.
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
        </div>
      </section>
      <section className="pt-[110px] pb-[160px] px-[70px]">
        <div className="text-[48px] leading-[29px] text-[#374048] font-semibold text-center mb-[25px]">
          THE PRODUCT
        </div>
        <div className="text-[#969da3] text-xl text-center leading-8 font-thin mb-5 mx-[130px]">
          Get honest feedback from strangers to find out your best photo. Our fun side-by-side
          voting system allows for a high number of votes and precision.
        </div>
        <div className="w-[82px] h-[6px] bg-[#eee] mx-auto mb-[50px]" />
        <div className="pt-[35px]">
          <img className="mx-auto" alt="hero-img" src="/apple-watch-2.png" />
        </div>
      </section>
      <section className="pt-[98px] pb-[78px] px-[70px] bg-[#F8FBFD]">
        <div className="text-[48px] leading-[29px] text-[#374048] font-semibold text-center mb-[25px]">
          FAQ
        </div>
        <div className="mb-[25px]">
          <div className="text-[#969da3] text-xl text-center leading-8 font-thin mb-5 mx-[130px]">
            Got questions? We've got answers. If you have some other questions, feel free to send us
            an email to{" "}
            <a href="#" className="text-[#0084ff]">
              hello@product.com
            </a>
          </div>
          <div className="w-[82px] h-[6px] bg-[#eee] mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="mt-[60px] px-[15px]">
            <div className="text-[20px] leading-[20px] font-medium text-[#374048] mb-[8px]">
              Mommy, how do babies work?
            </div>
            <div className="text-[15px] leading-[25px] font-light text-[#82898f]">
              Watch took center stage at this year's Product Show with a preview of watch OS 2. The
              next generation of Watch software is packed with features that just might turn the
              device from a nice-to-have into a must-have. If you already own an Apple Watch, you'll
              have to live with the old software until fall. You'll love it at the first use.
            </div>
          </div>
          <div className="mt-[60px] px-[15px]">
            <div className="text-[20px] leading-[20px] font-medium text-[#374048] mb-[8px]">
              Mommy, how do babies work?
            </div>
            <div className="text-[15px] leading-[25px] font-light text-[#82898f]">
              Watch took center stage at this year's Product Show with a preview of watch OS 2. The
              next generation of Watch software is packed with features that just might turn the
              device from a nice-to-have into a must-have. If you already own an Apple Watch, you'll
              have to live with the old software until fall. You'll love it at the first use.
            </div>
          </div>
          <div className="mt-[60px] px-[15px]">
            <div className="text-[20px] leading-[20px] font-medium text-[#374048] mb-[8px]">
              Mommy, how do babies work?
            </div>
            <div className="text-[15px] leading-[25px] font-light text-[#82898f]">
              Watch took center stage at this year's Product Show with a preview of watch OS 2. The
              next generation of Watch software is packed with features that just might turn the
              device from a nice-to-have into a must-have. If you already own an Apple Watch, you'll
              have to live with the old software until fall. You'll love it at the first use.
            </div>
          </div>
          <div className="mt-[60px] px-[15px]">
            <div className="text-[20px] leading-[20px] font-medium text-[#374048] mb-[8px]">
              Mommy, how do babies work?
            </div>
            <div className="text-[15px] leading-[25px] font-light text-[#82898f]">
              Watch took center stage at this year's Product Show with a preview of watch OS 2. The
              next generation of Watch software is packed with features that just might turn the
              device from a nice-to-have into a must-have. If you already own an Apple Watch, you'll
              have to live with the old software until fall. You'll love it at the first use.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
