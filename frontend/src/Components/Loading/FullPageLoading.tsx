import { Spinner } from "./Spinner";

export default function FullPageLoading() {
  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Spinner />
    </div>
  );
}
