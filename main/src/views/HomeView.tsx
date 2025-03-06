import { useNavigate } from "react-router";
import { strings } from "../constants/strings";

const HomeView = () => {
  const navigate = useNavigate();

  const goToSearch = () => {
    navigate("/search");
  };

  return (
    <main className="flex  flex-col">
      <div className="flex flex-col md:flex-row justify-between items-center">
        {" "}
        <div className="w-full md:w-2/6 p-4 md:p-0">
          <h1 className="text-4xl text-black text-center tracking-wide md:text-left md:text-6xl font-extrabold">
            {strings.home.heading}
          </h1>
          <p className="mt-5 text-center md:text-left">
            {strings.home.paragraph}
          </p>
        </div>
        {/* Main image*/}
        <img
          src="/hero.png"
          alt="hero-image"
          className="size-[70%] md:size-[35%]"
        />
      </div>

      <button
        className="flex items-center gap-2 px-3 py-2 text-white mx-auto md:mx-0 justify-between mt-16 md:mt-0 bg-primary max-w-28 hover:cursor-pointer hover:bg-primaryHover rounded-md transition-all hover:scale-105"
        type="button"
        onClick={goToSearch}
      >
        {strings.home.searchBtn}
        <i className="bx bx-search"></i>
      </button>
    </main>
  );
};
export default HomeView;
