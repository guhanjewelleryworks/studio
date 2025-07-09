// src/lib/email.ts
import { Resend } from 'resend';
import { VerificationEmail } from '@/components/email/VerificationEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function sendVerificationEmail(email: string, token: string) {
  const verificationLink = `${baseUrl}/verify-email?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: 'Goldsmith Connect <onboarding@resend.dev>', // Must be a verified domain on Resend
      to: [email],
      subject: 'Verify Your Email Address for Goldsmith Connect',
      react: VerificationEmail({ verificationLink }),
    });

    if (error) {
      console.error("Resend API error:", error);
      throw new Error(`Failed to send verification email: ${error.message}`);
    }

    console.log("Verification email sent successfully:", data);
    return data;
    
  } catch (error) {
    console.error("Error in sendVerificationEmail:", error);
    // Rethrow or handle as needed, so the calling action knows it failed
    throw error;
  }
}
