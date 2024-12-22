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
    style={{
      fontFamily: "Arial, sans-serif",
      margin: "0",
      padding: "0",
      backgroundColor: "#f4f4f4",
      color: "#333",
    }}
  >
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2
        style={{
          color: "#2c3e50",
          textAlign: "center",
          fontSize: "24px",
          marginBottom: "20px",
        }}
      >
        OTP Verification
      </h2>
      <p
        style={{
          fontSize: "16px",
          color: "#555",
          lineHeight: "1.6",
          textAlign: "center",
        }}
      >
        Hello, <strong>{firstName}</strong>,
      </p>
      <p
        style={{
          fontSize: "16px",
          color: "#555",
          lineHeight: "1.6",
          textAlign: "center",
        }}
      >
        Your One-Time Password (OTP) for verifying your account is:
      </p>
      <div
        style={{
          textAlign: "center",
          margin: "20px 0",
        }}
      >
        <h3
          style={{
            fontSize: "30px",
            fontWeight: "bold",
            color: "#e74c3c",
            letterSpacing: "2px",
            margin: "0",
          }}
        >
          {otp}
        </h3>
      </div>
      <p
        style={{
          fontSize: "14px",
          color: "#555",
          lineHeight: "1.6",
          textAlign: "center",
        }}
      >
        Please enter this OTP to complete your verification. This OTP will expire in 10 minutes.
      </p>
      <hr
        style={{
          borderTop: "1px solid #e0e0e0",
          margin: "20px 0",
        }}
      />
      <p
        style={{
          fontSize: "14px",
          color: "#888",
          textAlign: "center",
        }}
      >
        If you did not request this, please ignore this email.
      </p>
    </div>
  </div>
);

export default EmailTemplate;
