
// src/app/privacy/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-4xl py-10 px-4 md:px-6">
       <Card className="shadow-lg border-primary/20 bg-card">
         <CardHeader className="pb-3 pt-5">
           <CardTitle className="text-3xl text-accent mb-3">Privacy Policy</CardTitle>
            <p className="text-sm text-muted-foreground">Last Updated: July 26, 2024</p>
         </CardHeader>
        <CardContent className="prose prose-stone dark:prose-invert max-w-none text-foreground/85 space-y-3 px-6 pb-6 pt-0">

            <p>Welcome to Goldsmiths Connect. Your privacy is one of our top priorities. This Privacy Policy explains what information we collect, how we use it, and the choices you have.</p>
            <p>By using our platform, you consent to the practices described in this Privacy Policy.</p>

            <h2 className="font-heading text-xl text-accent mt-4 mb-1.5">1. Information We Collect</h2>
            
            <h3 className="font-heading text-lg text-accent/90 mt-3 mb-1">a. Information You Provide</h3>
            <p><strong>For Customers</strong></p>
            <p>When you create an account, we collect your name and email address. When you request a custom order, we collect your phone number and any design details, descriptions, and images you submit.</p>
            
            <p><strong>For Goldsmiths</strong></p>
            <p>Goldsmith registration requires workshop name, contact person, email, phone number, location (state & district), specialties, years of experience, and a password. You may optionally provide a bio and upload portfolio images.</p>
            
            <p><strong>For All Users</strong></p>
            <p>When you contact us through our site, we collect your name, email, phone number, and message.</p>

            <h3 className="font-heading text-lg text-accent/90 mt-3 mb-1">b. Information Collected Automatically</h3>
            <p><strong>Usage Data</strong></p>
            <p>We collect information such as login timestamps and, for goldsmiths, profile view counts to provide performance insights.</p>
            <p><strong>Cookies</strong></p>
            <p>We use essential cookies to maintain authentication and session stability. If you choose Google login, Google may also place cookies according to their privacy policy.</p>
            <p>We do not use advertising or tracking cookies.</p>


            <h2 className="font-heading text-xl text-accent mt-4 mb-1.5">2. How We Use Your Information</h2>
            <p>We use your data to:</p>
            <ul className="space-y-1.5 list-disc pl-5">
                <li>Provide and maintain your account</li>
                <li>Facilitate customer–goldsmith order interactions</li>
                <li>Send essential communications (verification, password reset, updates)</li>
                <li>Verify goldsmith profiles and maintain marketplace integrity</li>
                <li>Improve platform performance and features</li>
                <li>Protect against fraud, abuse, and unauthorized access</li>
            </ul>
            <p>We do not sell your personal information.</p>

            <h2 className="font-heading text-xl text-accent mt-4 mb-1.5">3. How We Share Your Information</h2>
            <p><strong>Customer ↔ Goldsmith (Mediated Sharing)</strong></p>
            <p>Customer order details are shared with administrators and, upon approval, with the selected goldsmith. Goldsmith profiles (name, general location, specialties) are publicly visible. Direct contact information is shared only through our mediated workflow to protect privacy.</p>
            <p><strong>Service Providers</strong></p>
            <p>We work with reputable third-party providers including:</p>
            <ul className="space-y-1.5 list-disc pl-5">
                <li>MongoDB (database hosting)</li>
                <li>Resend (email service)</li>
                <li>Google (authentication, if chosen)</li>
            </ul>
            <p>These providers access data only to perform their services.</p>
            <p><strong>Legal Requirements</strong></p>
            <p>We may disclose information to comply with legal obligations or valid government requests.</p>

            <h2 className="font-heading text-xl text-accent mt-4 mb-1.5">4. Data Transfers</h2>
            <p>Your information may be stored or processed outside India, depending on the server region used by our hosting providers. We ensure such transfers comply with applicable data protection laws.</p>
            
            <h2 className="font-heading text-xl text-accent mt-4 mb-1.5">5. Data Retention</h2>
            <p>We retain personal information only as long as necessary to:</p>
            <ul className="space-y-1.5 list-disc pl-5">
                <li>Provide our services</li>
                <li>Comply with legal requirements</li>
                <li>Resolve disputes</li>
                <li>Enforce agreements</li>
            </ul>
            <p>Upon account deletion, we may retain anonymized order records without personal identifiers.</p>

            <h2 className="font-heading text-xl text-accent mt-4 mb-1.5">6. Data Security</h2>
            <p>We use industry-standard security measures including:</p>
            <ul className="space-y-1.5 list-disc pl-5">
                <li>Password hashing</li>
                <li>Encrypted connections (HTTPS)</li>
                <li>Role-based access controls</li>
            </ul>
            <p>While no system is 100% secure, we work continuously to protect your data.</p>

            <h2 className="font-heading text-xl text-accent mt-4 mb-1.5">7. Your Rights & Choices</h2>
            <p>You may:</p>
             <ul className="space-y-1.5 list-disc pl-5">
                <li>Access and update your profile anytime</li>
                <li>Request deletion of your account</li>
                <li>Adjust non-essential communication preferences</li>
            </ul>
            <p>Transactional communications (e.g., password reset) cannot be opted out of.</p>

            <h2 className="font-heading text-xl text-accent mt-4 mb-1.5">8. Children’s Privacy</h2>
            <p>Our platform is not intended for anyone under 18. If we learn that a minor has provided personal information, we will remove it promptly.</p>

            <h2 className="font-heading text-xl text-accent mt-4 mb-1.5">9. Grievance Officer (As per IT Rules, India)</h2>
            <p>For concerns or complaints, contact:</p>
            <p>
                Grievance Officer<br />
                Email: support@goldsmithsconnect.com
            </p>
            <p>We aim to respond within 15 business days.</p>
            
            <h2 className="font-heading text-xl text-accent mt-4 mb-1.5">10. Updates to This Policy</h2>
            <p>We may update this Privacy Policy occasionally. Your continued use of the platform after changes indicates your acceptance of the updated policy.</p>

            <h2 className="font-heading text-xl text-accent mt-4 mb-1.5">Contact Us</h2>
            <p>If you have any questions or concerns, please reach out through our <Link href="/contact" className="text-primary hover:underline">Contact Page</Link>.</p>
            
        </CardContent>
      </Card>
    </div>
  );
}
