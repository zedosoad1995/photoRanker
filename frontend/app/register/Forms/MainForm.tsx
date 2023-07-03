import Textfield from "@/components/TextField";

export default function MainForm() {
  return (
    <>
      <Textfield label="Name" type="text" autocomplete="name" required />
      <Textfield
        label="Email address"
        type="email"
        autocomplete="email"
        required
      />
      <Textfield
        label="Password"
        type="password"
        autocomplete="new-password"
        required
      />
    </>
  );
}
