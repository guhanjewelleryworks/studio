
// src/components/email/VerificationEmail.tsx
import * as React from 'react';

interface VerificationEmailProps {
  verificationLink: string;
}

export const VerificationEmail: React.FC<Readonly<VerificationEmailProps>> = ({
  verificationLink,
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6', color: '#333' }}>
    <h1 style={{ color: '#8B4513' }}>Welcome to Goldsmiths Connect!</h1>
    <p>We're excited to have you on board. Please verify your email address to complete your registration and start exploring.</p>
    <a 
      href={verificationLink} 
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
      Verify Email Address
    </a>
    <p>If you did not create an account, no further action is required.</p>
    <hr style={{ border: 'none', borderTop: '1px solid #eee' }} />
    <p style={{ fontSize: '12px', color: '#777' }}>
      If you're having trouble clicking the button, copy and paste the URL below into your web browser:
      <br />
      <a href={verificationLink} style={{ color: '#8B4513' }}>{verificationLink}</a>
    </p>
  </div>
);
