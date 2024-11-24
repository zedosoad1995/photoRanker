import { Footer } from "@/Components/Footer";

export const Terms = () => {
  return (
    <>
      <div className="p-4 md:p-12 h-auto text-[#374048]">
        <h1 className="text-3xl md:text-4xl font-semibold text-center mb-10">
          Terms of Service
        </h1>
        <p className="mb-1 italic">
          <strong className="font-semibold">Effective Date:</strong> 24-08-2024
        </p>
        <p className="mb-6 italic">
          By using Photo Scorer, you agree to the following terms and
          conditions. If you do not agree, please refrain from using our
          services.
        </p>

        <h2 className="text-lg font-semibold mb-1">1. Eligibility</h2>
        <p className="mb-6">
          You must be at least 18 years old to use Photo Scorer.
        </p>

        <h2 className="text-lg font-semibold mb-1">2. Acceptable Use</h2>
        <p className="mb-2">
          You agree to follow these guidelines when uploading photos:
        </p>
        <ul className="list-disc list-inside pl-6 mb-5">
          <li className="mb-1">
            <strong className="font-semibold">
              No Nudity or Explicit Content:
            </strong>{" "}
            Photos containing nudity, genitals, or explicit sexual content are
            prohibited. Photos should not be overly sexual or inappropriate.
          </li>
          <li className="mb-1">
            <strong className="font-semibold">Face Visibility:</strong> Photos
            must clearly show your face, or at least enough of your face for
            identification. The photo should be of high enough quality to
            clearly recognize the person.
          </li>
          <li className="mb-1">
            <strong className="font-semibold">No Group Photos:</strong> Photos
            featuring multiple people where the uploader cannot be easily
            identified will not be allowed.
          </li>
          <li className="mb-1">
            <strong className="font-semibold">Authenticity Required:</strong>{" "}
            Only photos of real people are allowed. AI-generated images,
            excessively filtered photos, or heavily edited images that distort
            natural appearance are strictly prohibited.
          </li>
          <li className="mb-1">
            <strong className="font-semibold">Dishonest Information:</strong>{" "}
            You will not provide false personal information, including but not
            limited to your gender, or age. Tampering with the system by
            catfishing or cosplaying as someone else will result in account
            termination.
          </li>
        </ul>

        <h2 className="text-lg font-semibold mb-1">
          3. Moderation and Enforcement
        </h2>
        <p className="mb-1">
          Photos that violate the above rules may be deleted without warning.
        </p>
        <p className="mb-6">
          In extreme cases, users may be banned without warning for violating
          the terms of service.
        </p>

        <h2 className="text-lg font-semibold mb-1">
          4. Account Deletion and Bans
        </h2>
        <p className="mb-1">
          If a user violates the Terms of Service, their account may be deleted
          or banned.
        </p>
        <p className="mb-6">
          In cases of banning, user data, including photos, may still be
          retained to prevent re-registration.
        </p>

        <h2 className="text-lg font-semibold mb-1">5. Termination of Use</h2>
        <p className="mb-1">
          We reserve the right, without liability or prior notice, to suspend or
          revoke your registration, your right to access and/or use Photo
          Scorer, or to submit any content to Photo Scorer. We may make use of
          any operational, technological, legal, or other means available to
          enforce the terms.
        </p>
        <p className="mb-6">
          We are not obliged to notify you if your access to Photo Scorer or
          your account is suspended or terminated.
        </p>

        <h2 className="text-lg font-semibold mb-1">6. Changes to Terms</h2>
        <p className="pb-8">
          We may update these Terms of Service periodically. Continued use of
          Photo Scorer implies acceptance of the updated terms.
        </p>
      </div>
      <Footer />
    </>
  );
};
