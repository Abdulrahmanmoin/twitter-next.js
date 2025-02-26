import sgMail from "@/utils/sendGrid";
import { ApiResponse } from "@/types/ApiResponse";
import { render } from "@react-email/components"; 
import VerificationEmail from "@/emails/VerificationEmail";

export async function sendVerificationEmail(
    email: string,
    fullName: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        const htmlContent = await render(VerificationEmail({ fullName, username, otp: verifyCode }));

        const msg = {
            to: email,
            from: process.env.SENDGRID_SENDER_EMAIL!,
            subject: "Twitter: Verification Code",
            html: htmlContent,
        };

        await sgMail.send(msg);
        return { success: true, message: "Verification email sent successfully" };
    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, message: "Failed to send verification email" };
    }
}
