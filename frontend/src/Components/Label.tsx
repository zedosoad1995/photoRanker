interface ILabel {
  name: string;
}

export default function Label({ name }: ILabel) {
  return (
    <label className="block text-label font-medium leading-6">{name}</label>
  );
}
