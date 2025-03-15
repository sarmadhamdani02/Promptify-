import nodemailer from "nodemailer";

export async function sendVerificationEmail(email: string, firstName: string, otp: string) {
    console.log("📤 Sending email via Nodemailer...");

    const transporter = nodemailer.createTransport({
        service: "gmail", // Use "outlook", "yahoo", etc., if needed
        auth: {
            user: process.env.EMAIL_USER, // Your email
            pass: process.env.EMAIL_PASS, // Your app password
        },
    });

    const mailOptions = {
        from: `"Promptify" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verify Your Promptify Account 🚀",
        html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Promptify Account</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }

            .container {
              max-width: 500px;
              margin: 30px auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
              text-align: center;
            }

            /* Promptify Logo Styling */
            .logo {
              font-size: 32px;
              font-weight: bold;
              color: #3b82f6;
              display: flex;
              justify-content: center;
              align-items: center;
              gap: 4px;
              margin-bottom: 20px;
            }

            .logo-text {
              color: #1f2937;
            }

            .zap-icon {
              color: #3b82f6;
              font-size: 24px;
            }

            /* Header */
            .header {
              background-color: #3b82f6;
              color: #ffffff;
              font-size: 24px;
              font-weight: bold;
              padding: 15px;
              border-radius: 10px 10px 0 0;
            }

            .content {
              padding: 20px;
            }

            /* OTP Styling */
            .otp {
              font-size: 28px;
              font-weight: bold;
              color: #3b82f6;
              padding: 10px 20px;
              background-color: #e0f2fe;
              display: inline-block;
              border-radius: 8px;
              margin: 15px 0;
            }

            /* CTA Button */
            .button {
              display: inline-block;
              padding: 12px 20px;
              font-size: 16px;
              color: #ffffff;
              background-color: #3b82f6;
              text-decoration: none;
              border-radius: 6px;
              margin-top: 15px;
              font-weight: bold;
            }

            .button:hover {
              background-color: #2563eb;
            }

            /* Footer */
            .footer {
              font-size: 14px;
              color: #555;
              padding: 15px;
              border-top: 1px solid #ddd;
              margin-top: 20px;
            }

            .footer a {
              color: #3b82f6;
              text-decoration: none;
            }
          </style>
        </head>
        <body>

          <div class="container">
            <!-- Promptify Logo -->
            <div class="logo">
              <span class="logo-text">Promptify</span>
              <span class="zap-icon">⚡</span>
            </div>

            <!-- Email Header -->
            <div class="header">
              Verify Your Promptify Account 🚀
            </div>

            <!-- Email Content -->
            <div class="content">
              <p>Hey <strong>${firstName}</strong>,</p>
              <p>Thanks for joining <strong>Promptify</strong>! Use the OTP below to verify your account:</p>

              <div class="otp">${otp}</div>

              <p>This OTP is valid for <strong>10 minutes</strong>.</p>

            </div>

            <!-- Footer -->
            <div class="footer">
              If you didn't request this, please ignore this email.  
              <br> Need help? Contact us at <a href="mailto:sarmadfarooqhamdani@gmail.com">sarmadfarooqhamdani@gmail.com</a>
            </div>
          </div>

        </body>
        </html>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully!");
        return { success: true };
    } catch (error) {
        console.error("❌ Email sending failed:", error);
        return { success: false, message: "Failed to send verification Email." };
    }
}
