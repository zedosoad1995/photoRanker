function App() {
  return (
    <div className="font-poppins">
      <section
        className="bg-[url('/public/header_bg_alt.jpg')] h-[100vh] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(to bottom,rgba(0,0,0,0.6), rgba(0,0,0,0.6)),url('/public/header_bg_alt.jpg')",
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
          <img className="mx-auto" alt="hero-img" src="/public/the-watch-2.png" />
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
          <img className="mx-auto" alt="hero-img" src="/public/apple-watch-2.png" />
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
      </section>
    </div>
  );
}

export default App;
