interface ILabel {
  name: string;
}

export default function Label({ name }: ILabel) {
  return (
    <label
      htmlFor="floating_outlined"
      className="absolute duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 text-label font-medium leading-6"
    >
      {name}
    </label>
  );
}
