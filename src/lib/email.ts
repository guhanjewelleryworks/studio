// src/lib/email.ts
import { Resend } from 'resend';
import { VerificationEmail } from '@/components/email/VerificationEmail';
import { PasswordResetEmail } from '@/components/email/PasswordResetEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

// Use the public URL from env vars, falling back to the standard dev port 9002
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';

export async function sendVerificationEmail(email: string, linkOrToken: string) {
  // This function is now flexible. If it receives a full URL, it uses it.
  // If it receives just a token, it constructs the default customer verification link.
  const verificationLink = linkOrToken.startsWith('http')
    ? linkOrToken
    : `${baseUrl}/verify-email?token=${linkOrToken}`;

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

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${baseUrl}/customer/reset-password?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: 'Goldsmith Connect <onboarding@resend.dev>',
      to: [email],
      subject: 'Reset Your Goldsmith Connect Password',
      react: PasswordResetEmail({ resetLink }),
    });

    if (error) {
      console.error("Resend API error for password reset:", error);
      throw new Error(`Failed to send password reset email: ${error.message}`);
    }

    console.log("Password reset email sent successfully:", data);
    return data;
    
  } catch (error) {
    console.error("Error in sendPasswordResetEmail:", error);
    throw error;
  }
}
