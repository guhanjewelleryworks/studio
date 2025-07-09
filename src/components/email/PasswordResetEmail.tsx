// src/components/email/PasswordResetEmail.tsx
import * as React from 'react';

interface PasswordResetEmailProps {
  resetLink: string;
}

export const PasswordResetEmail: React.FC<Readonly<PasswordResetEmailProps>> = ({
  resetLink,
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6', color: '#333' }}>
    <h1 style={{ color: '#8B4513' }}>Goldsmith Connect Password Reset</h1>
    <p>We received a request to reset the password for your account. You can reset your password by clicking the link below:</p>
    <a 
      href={resetLink} 
      target="_blank" 
      rel="noopener noreferrer"
      style={{
        display: 'inline-block',
        padding: '12px 24px',
        margin: '20px 0',
        backgroundColor: '#FFD700',
        color: '#8B4513',
        textDecoration: 'none',
        borderRadius: '5px',
        fontWeight: 'bold'
      }}
    >
      Reset Your Password
    </a>
    <p>This link will expire in 1 hour. If you did not request a password reset, please ignore this email.</p>
    <hr style={{ border: 'none', borderTop: '1px solid #eee' }} />
    <p style={{ fontSize: '12px', color: '#777' }}>
      If you're having trouble clicking the button, copy and paste the URL below into your web browser:
      <br />
      <a href={resetLink} style={{ color: '#8B4513' }}>{resetLink}</a>
    </p>
  </div>
);
