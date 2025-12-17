
// src/lib/email.ts
import { Resend } from 'resend';
import { VerificationEmail } from '@/components/email/VerificationEmail';
import { PasswordResetEmail } from '@/components/email/PasswordResetEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

// Use the public URL from env vars, falling back to the standard dev port 9002
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';

export async function sendVerificationEmail(email: string, token: string, userType: 'customer' | 'goldsmith') {
  // Construct the correct link based on user type
  const verificationLink = userType === 'goldsmith'
    ? `${baseUrl}/goldsmith-portal/verify-email?token=${token}`
    : `${baseUrl}/verify-email?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: 'Goldsmiths Connect <onboarding@resend.dev>', // Must be a verified domain on Resend
      to: [email],
      subject: 'Verify Your Email Address for Goldsmiths Connect',
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

export async function sendCustomerPasswordResetEmail(email: string, token: string) {
  const resetLink = `${baseUrl}/customer/reset-password?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: 'Goldsmiths Connect <onboarding@resend.dev>',
      to: [email],
      subject: 'Reset Your Goldsmiths Connect Password',
      react: PasswordResetEmail({ resetLink }),
    });

    if (error) {
      console.error("Resend API error for password reset:", error);
      throw new Error(`Failed to send password reset email: ${error.message}`);
    }

    console.log("Password reset email sent successfully:", data);
    return data;
    
  } catch (error) {
    console.error("Error in sendCustomerPasswordResetEmail:", error);
    throw error;
  }
}

export async function sendGoldsmithPasswordResetEmail(email: string, token: string) {
  const resetLink = `${baseUrl}/goldsmith-portal/reset-password?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: 'Goldsmiths Connect <onboarding@resend.dev>',
      to: [email],
      subject: 'Reset Your Goldsmith Portal Password',
      react: PasswordResetEmail({ resetLink }),
    });

    if (error) {
      console.error("Resend API error for goldsmith password reset:", error);
      throw new Error(`Failed to send password reset email: ${error.message}`);
    }

    console.log("Goldsmith password reset email sent successfully:", data);
    return data;
    
  } catch (error) {
    console.error("Error in sendGoldsmithPasswordResetEmail:", error);
    throw error;
  }
}
