import * as React from "react";

interface EmailTemplateProps {
  firstName: string;
  otp: string;
}

const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  otp,
}) => (
  <div
    className="bg-blue-500 font-sans text-gray-800"
    style={{
      margin: "0",
      padding: "0",
    }}
  >
    <div
      className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg"
      style={{
        margin: "0 auto",
      }}
    >
      <h2 className="text-center text-2xl text-blue-800 mb-6">
        OTP Verification
      </h2>
      <p className="text-center text-lg text-gray-700 mb-4">
        Hello, <strong>{firstName}</strong>,
      </p>
      <p className="text-center text-lg text-gray-700 mb-4">
        Your One-Time Password (OTP) for verifying your account is:
      </p>
      <div className="text-center my-6">
        <h3 className="text-4xl font-bold text-red-500 tracking-wide">
          {otp}
        </h3>
      </div>
      <p className="text-center text-sm text-gray-600 mb-6">
        Please enter this OTP to complete your verification. This OTP will expire in 10 minutes.
      </p>
      <hr className="border-t border-gray-200 my-6" />
      <p className="text-center text-sm text-gray-500">
        If you did not request this, please ignore this email.
      </p>
    </div>
  </div>
);

export default EmailTemplate;
