interface IBanned {
  email: string;
}

export default function Banned({ email }: IBanned) {
  return (
    <div>
      <h1 className="text-xl font-bold">Account Banned</h1>
      <div className="mt-2 mb-4">
        <p className="mb-2">
          Your account under the email <b>{email}</b> has been permanently banned.
        </p>
      </div>
    </div>
  );
}
