export default function ExpiredValidation() {
  return (
    <div className="p-4 md:p-12 max-w-5xl mx-auto">
      <h3 className="text-xl font-semibold mb-4">
        Verification Link Invalid or Expired
      </h3>
      <div>
        We're sorry, but the verification link you've clicked is invalid or has
        expired. This can happen if you've already verified your account, the
        link was only meant for a single-use, or it has expired after a certain
        period.
      </div>
    </div>
  );
}
