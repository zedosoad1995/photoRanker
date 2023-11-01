import { Spinner } from "@/Components/Loading/Spinner";

interface IPhotosLoader {
  isLoading: boolean;
}

export const PhotosLoaderCover = ({ isLoading }: IPhotosLoader) => {
  return (
    <>
      <div
        className={`bg-white absolute w-full h-full z-10 transition-opacity delay-200 ${
          isLoading ? "block opacity-70" : "hidden opacity-0"
        }`}
      />
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 transition-opacity duration-0 delay-200 ${
          isLoading ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <Spinner />
      </div>
    </>
  );
};
