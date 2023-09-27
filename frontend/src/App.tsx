function App() {
  return (
    <div className="font-poppins">
      <section
        className="bg-[url('/header_bg_alt.jpg')] h-[100vh] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(to bottom,rgba(0,0,0,0.6), rgba(0,0,0,0.6)),url('/header_bg_alt.jpg')",
        }}
      >
        <div className="flex mx-[70px] pt-16">
          <div className="w-1/2 my-auto">
            <div className="font-semibold text-white text-[68px] mb-[20px]">
              Find your best look
            </div>
            <div className="text-white/70 text-[24px] mb-[40px]">
              Let strangers rate your best picture, in a fun side-by-side comparison
            </div>
            <button className="bg-[#0084FF] hover:bg-[#006ACC] transition-colors ease-linear duration-300 text-[22px] leading-[65px] font-medium text-white rounded-[60px] px-[45px]">
              Test your photo now
            </button>
          </div>
          <img className="mx-auto" alt="hero-img" src="/the-watch-2.png" />
        </div>
      </section>
      <section className="pt-[110px] pb-[160px] mx-[70px]">
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
      <section className="pt-[104px] pb-[95px] px-[70px] bg-[#F8FBFD]">
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
        <div className="flex justify-around w-full mt-[60px]">
          <div className="px-[15px]">
            <div className="text-[#374048] font-semibold text-[26px] leading-[26px] text-center mb-[8px]">
              Step 1
            </div>
            <div className="text-[#737C85] font-light text-center">
              Lorem ipsum dolor sit amet, consectetur de elit, sed do tempor incididunt ut labore
              eta rehenderit in voluptate velit.
            </div>
          </div>
          <div className="px-[15px]">
            <div className="text-[#374048] font-semibold text-[26px] leading-[26px] text-center mb-[8px]">
              Step 2
            </div>
            <div className="text-[#737C85] font-light text-center">
              Lorem ipsum dolor sit amet, consectetur de elit, sed do tempor incididunt ut labore
              eta rehenderit in voluptate velit.
            </div>
          </div>
          <div className="px-[15px]">
            <div className="text-[#374048] font-semibold text-[26px] leading-[26px] text-center mb-[8px]">
              Step 3
            </div>
            <div className="text-[#737C85] font-light text-center">
              Lorem ipsum dolor sit amet, consectetur de elit, sed do tempor incididunt ut labore
              eta rehenderit in voluptate velit.
            </div>
          </div>
        </div>
      </section>
      <section className="py-[117px] mx-[70px]">
        <div className="text-[48px] leading-[29px] text-[#374048] font-semibold text-center mb-[25px]">
          THE BENEFITS
        </div>
        <div className="text-[#969da3] text-xl text-center leading-8 font-thin mb-5 mx-[130px]">
          List out your product’s benefit here. A small description about what it is and how it
          helps the user. You can also add some icons.
        </div>
        <div className="w-[82px] h-[6px] bg-[#eee] mx-auto mb-[50px]" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <div>hey</div>
          <div>hey</div>
          <div>hey</div>
          <div>hey</div>
          <div>hey</div>
          <div>hey</div>
        </div>
      </section>
    </div>
  );
}

export default App;
