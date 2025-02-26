import sgMail from "@/utils/sendGrid";
import { ApiResponse } from "@/types/ApiResponse";
import { render } from "@react-email/components"; 
import ForgotPassword from "@/emails/ForgotPassword";

export async function sendForgotPasswordEmail(
    email: string,
    fullName: string,
    username: string,
    resetCode: string
): Promise<ApiResponse> {
    try {
        const htmlContent = await render(ForgotPassword({ fullName, username, otp: resetCode }));

        const msg = {
            to: email,
            from: process.env.SENDGRID_SENDER_EMAIL!,
            subject: "Twitter: Reset Your Password",
            html: htmlContent,
        };

        await sgMail.send(msg);
        return { success: true, message: "ForgotPassword email sent successfully" };
    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, message: "Failed to send ForgotPassword email" };
    }
}
