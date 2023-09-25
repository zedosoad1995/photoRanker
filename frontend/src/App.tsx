function App() {
  return (
    <section
      className="bg-[url('/public/header_bg_alt.jpg')] h-full bg-cover bg-center bg-no-repeat font-poppins"
      style={{
        backgroundImage:
          "linear-gradient(to bottom,rgba(0,0,0,0.6), rgba(0,0,0,0.6)),url('/public/header_bg_alt.jpg')",
      }}
    >
      <div className="flex mx-[70px] pt-16">
        <div className="w-1/2 my-auto">
          <div className="font-semibold text-white text-[68px] mb-[20px]">Find your best look</div>
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
  );
}

export default App;
