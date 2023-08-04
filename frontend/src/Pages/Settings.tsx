import Button from "@/Components/Button";

export default function Settings() {
  return (
    <>
      <div className="text-3xl font-semibold text-center mb-10">Settings</div>
      <div className="max-w-sm mx-auto mt-5">
        <Button style="danger">Delete Account</Button>
      </div>
    </>
  );
}
