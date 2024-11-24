import { Footer } from "@/Components/Footer";

export default function Privacy() {
  return (
    <>
      <div className="p-4 md:p-12 h-auto text-[#374048]">
        <h1 className="text-3xl md:text-4xl font-semibold text-center mb-10">
          Privacy Policy
        </h1>
        <p className="mb-1 italic">
          <strong className="font-semibold">Effective Date:</strong> 24-08-2024
        </p>
        <p className="mb-6 italic">
          At PhotoScorer (“we,” “our,” or “us”), we take your privacy seriously.
          This Privacy Policy explains how we collect, use, and protect your
          personal data when you use our app.
        </p>

        <h2 className="text-lg font-semibold mb-1">1. Data We Collect</h2>
        <p className="mb-2">
          We collect the following personal data to provide and improve our
          services:
        </p>
        <ul className="list-disc list-inside pl-6 mb-5">
          <li className="mb-1">
            <strong className="font-semibold">Email Address:</strong> For
            registration, login, and account-related communication.
          </li>
          <li className="mb-1">
            <strong className="font-semibold">Name:</strong> Photos To address
            you in emails.
          </li>
          <li className="mb-1">
            <strong className="font-semibold">
              Country, Ethnicity, Gender, and Date of Birth:
            </strong>{" "}
            Used for in-app features such as comparing photo scores within peer
            groups and providing demographic insights to users who upload
            photos.
          </li>
          <li className="mb-1">
            <strong className="font-semibold">Photos:</strong> Uploaded photos
            are used solely within the app for voting and comparison features.
          </li>
        </ul>

        <h2 className="text-lg font-semibold mb-1">2. How We Use Your Data</h2>
        <p className="mb-2">
          Your data is used exclusively for providing app functionality:
        </p>
        <ul className="list-disc list-inside pl-6 mb-5">
          <li className="mb-1">
            Allowing users to view their photo scores compared to their peers.
          </li>
          <li className="mb-1">
            Enabling demographic-based insights for photo votes.
          </li>
          <li className="mb-1">Displaying photos for side-by-side voting.</li>
          <li className="mb-1">
            Improving app performance through Google Analytics (via anonymized
            data).
          </li>
        </ul>

        <h2 className="text-lg font-semibold mb-1">3. Data Sharing</h2>
        <p className="mb-2">
          We do not share your personal data with third parties, except for the
          following:
        </p>
        <ul className="list-disc list-inside pl-6 mb-5">
          <li className="mb-1">
            <strong className="font-semibold">Google Analytics:</strong> We use
            Google Analytics to analyze app performance. No personally
            identifiable information is shared with Google.
          </li>
        </ul>

        <h2 className="text-lg font-semibold mb-1">4. Data Retention</h2>
        <ul className="list-disc list-inside pl-6 mb-5">
          <li className="mb-1">
            <strong className="font-semibold">Photos: </strong> Deleted photos
            are permanently removed from our database.
          </li>
          <li className="mb-1">
            <strong className="font-semibold">Account Information: </strong>{" "}
            When you delete your account, all your data, including photos, is
            permanently removed.
          </li>
          <li className="mb-1">
            <strong className="font-semibold">Banned Users: </strong> If your
            account is banned for violating our terms, we retain your email and
            photos to prevent re-registration.
          </li>
        </ul>

        <h2 className="text-lg font-semibold mb-1">5. User Rights</h2>
        <p className="mb-2">Under GDPR, you have the right to:</p>
        <ul className="list-disc list-inside pl-6 mb-5">
          <li className="mb-1">
            <strong className="font-semibold">Access:</strong> Request a copy of
            your personal data.
          </li>
          <li className="mb-1">
            <strong className="font-semibold">Correction:</strong> Update
            incorrect or incomplete data.
          </li>
          <li className="mb-1">
            <strong className="font-semibold">Deletion:</strong> Delete your
            account and data at any time.
          </li>
          <li className="mb-1">
            <strong className="font-semibold">Objection:</strong> Opt-out of
            specific data uses.
          </li>
        </ul>

        <h2 className="text-lg font-semibold mb-1">6. Cookies</h2>
        <p className="mb-1">
          We use strictly necessary cookies to store authentication tokens (JWT)
          for user login. These cookies are not used for tracking or advertising
          purposes. By using our app, you consent to the use of these cookies.
        </p>
        <p className="mb-6">
          If we introduce other cookies, such as for analytics or advertising,
          we will ask for your consent before using them.
        </p>

        <h2 className="text-lg font-semibold mb-1">7. Data Security</h2>
        <p className="mb-6">
          We use industry-standard measures to protect your data. However, no
          system is entirely secure, and we cannot guarantee absolute security.
        </p>

        <h2 className="text-lg font-semibold mb-1">
          8. Changes to This Policy
        </h2>
        <p className="mb-6">
          We may update this Privacy Policy to reflect changes in our practices
          or for legal reasons. Updates will be posted on this page with a
          revised effective date.
        </p>

        <h2 className="text-lg font-semibold mb-1">9. Contact Us</h2>
        <p className="pb-8">
          For privacy-related questions, contact us at{" "}
          <a className="text-[#0084ff]">help@photoscorer.com</a>.
        </p>
      </div>
      <Footer />
    </>
  );
}
