
// src/app/terms/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-4xl py-10 px-4 md:px-6">
       <Card className="shadow-lg border-primary/20 bg-card">
        <CardHeader className="pb-3 pt-5">
           <CardTitle className="text-3xl text-accent mb-3">Terms of Service</CardTitle>
           <p className="text-sm text-muted-foreground">Last Updated: July 26, 2024</p>
        </CardHeader>
        <CardContent className="prose prose-stone dark:prose-invert max-w-none text-foreground/85 space-y-3 px-6 pb-6 pt-0">
            <h3 className="font-heading text-xl text-accent mt-4 mb-1.5">1. Introduction</h3>
            <p>Welcome to Goldsmiths Connect. These Terms of Service (“Terms”) govern your access to and use of our website, platform, and services (“Platform”). By creating an account or using the Platform, you agree to these Terms and our Privacy Policy. If you do not agree, you may not use the Platform.</p>

            <h3 className="font-heading text-xl text-accent mt-4 mb-1.5">2. Our Service</h3>
            <p>Goldsmiths Connect is a neutral marketplace that facilitates connections between Customers seeking custom jewellery and independent, third-party Goldsmiths. We are not:</p>
            <ul className="list-disc pl-5 space-y-1">
                <li>a jeweller,</li>
                <li>a manufacturer,</li>
                <li>an employer of Goldsmiths,</li>
                <li>or a party to any agreement between Customers and Goldsmiths.</li>
            </ul>
            <p>All crafting work is performed solely by Goldsmiths. The Platform provides the tools to connect users and manage communication through our administrative review process.</p>

            <h3 className="font-heading text-xl text-accent mt-4 mb-1.5">3. User Accounts</h3>
            <p><strong>Eligibility</strong></p>
            <p>You must be at least 18 years old to use the Platform.</p>
            <p><strong>Account Security</strong></p>
            <p>You are responsible for safeguarding your password and account. Notify us immediately of unauthorized access.</p>
            <p><strong>Accurate Information</strong></p>
            <p>You agree to provide true and complete information. Misrepresentation or falsification of identity or qualifications is prohibited.</p>
            <p><strong>Goldsmith Verification</strong></p>
            <p>Goldsmiths undergo a verification process based on information they provide. While we aim to maintain quality, Goldsmiths Connect does not guarantee the skill, reliability, or performance of any Goldsmith.</p>
            
            <h3 className="font-heading text-xl text-accent mt-4 mb-1.5">4. Code of Conduct</h3>
            <p>Users agree not to:</p>
            <ul className="list-disc pl-5 space-y-1">
                <li>Post false or misleading information</li>
                <li>Infringe intellectual property rights</li>
                <li>Harass or threaten others</li>
                <li>Upload malware or harmful content</li>
                <li>Circumvent the Platform’s mediated communication</li>
                <li>Conduct off-platform transactions originating from Platform connections</li>
                <li>Use the Platform for unlawful purposes</li>
            </ul>
            <p>Violation may result in suspension or termination.</p>

            <h3 className="font-heading text-xl text-accent mt-4 mb-1.5">5. Orders and Transactions</h3>
            <p><strong>Facilitation Only</strong></p>
            <p>We facilitate order requests but do not participate in negotiation, pricing, quality assurance, or delivery. Goldsmiths Connect does not guarantee any outcome.</p>
            <p><strong>Responsibility of Goldsmiths</strong></p>
            <p>Goldsmiths are fully responsible for: craftsmanship, quality, timelines, communication, and delivery of finished work.</p>
            <p><strong>Off-Platform Transactions</strong></p>
            <p>Users must not engage in direct communication or payment outside the Platform for orders initiated here. Goldsmiths Connect is not liable for losses due to off-platform transactions.</p>
            <p><strong>Disputes</strong></p>
            <p>Disputes between users (Customer vs Goldsmith) are not mediated by Goldsmiths Connect. Users must resolve issues independently.</p>
            <p><strong>Administrative Review</strong></p>
            <p>Order requests are reviewed only for clarity and legitimacy. This is not a guarantee of feasibility or quality.</p>
            
            <h3 className="font-heading text-xl text-accent mt-4 mb-1.5">6. Content Ownership and License</h3>
            <p><strong>User Content</strong></p>
            <p>You retain ownership of content you upload.</p>
            <p><strong>License to Platform</strong></p>
            <p>You grant Goldsmiths Connect a worldwide, royalty-free license to display and use your content for operating and promoting the Platform. This license ends when you delete your content or account.</p>
            <p><strong>User Responsibility for IP Rights</strong></p>
            <p>By uploading content, you confirm you own it or have rights to use it. You must not upload copyrighted designs without authorization.</p>

            <h3 className="font-heading text-xl text-accent mt-4 mb-1.5">7. Termination</h3>
            <p>We may suspend or terminate accounts involved in: fraud, abuse, violation of Terms, or behavior harmful to users or the Platform. Termination may occur without prior notice.</p>

            <h3 className="font-heading text-xl text-accent mt-4 mb-1.5">8. Disclaimer of Warranties & Limitation of Liability</h3>
            <p>The Platform is provided “as is” without warranties. We do not guarantee uninterrupted, error-free, or secure service. Goldsmiths Connect is not responsible for any damages resulting from user interactions or transactions.</p>
            <p><strong>Liability Cap</strong></p>
            <p>Our total liability shall not exceed ₹1,000 or the amount paid to the Platform (if any), whichever is lower.</p>

            <h3 className="font-heading text-xl text-accent mt-4 mb-1.5">9. Indemnification</h3>
            <p>You agree to indemnify Goldsmiths Connect from any claims, losses, or damages arising from: your use of the Platform, your content, or your violation of these Terms.</p>

            <h3 className="font-heading text-xl text-accent mt-4 mb-1.5">10. Governing Law</h3>
            <p>These Terms are governed by the laws of India. Legal disputes will fall under the jurisdiction of courts in Bangalore.</p>

            <h3 className="font-heading text-xl text-accent mt-4 mb-1.5">11. Changes to Terms</h3>
            <p>We may update these Terms periodically. Continued use of the Platform indicates acceptance of updated Terms.</p>

            <h3 className="font-heading text-xl text-accent mt-4 mb-1.5">12. Contact Us</h3>
            <p>For questions, contact us through our <Link href="/contact" className="text-primary hover:underline">Contact Page</Link>.</p>
            
        </CardContent>
      </Card>
    </div>
  );
}
