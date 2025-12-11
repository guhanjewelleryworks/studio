
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-4xl py-10 px-4 md:px-6">
       <Card className="shadow-lg border-primary/20 bg-card">
         <CardHeader className="pb-3 pt-5">
           <CardTitle className="text-3xl text-accent mb-3">Privacy Policy</CardTitle>
            <p className="text-sm text-muted-foreground">Last Updated: July 26, 2024</p>
         </CardHeader>
        <CardContent className="prose prose-stone dark:prose-invert max-w-none text-foreground/85 space-y-3 px-6 pb-6 pt-0">

            <p>Welcome to Goldsmith Connect. Your privacy is one of our top priorities. This Privacy Policy outlines the types of information we collect and record and how we use it to provide our services.</p>

            <h2 className="font-heading text-xl text-accent mt-4 mb-1.5">1. Information We Collect</h2>
            <p>We collect information necessary to operate our platform and facilitate connections between customers and goldsmiths. The type of information we collect depends on how you interact with our service.</p>
            
            <h3 className="font-heading text-lg text-accent/90 mt-3 mb-1">a. Information You Provide to Us</h3>
            <ul className="space-y-1.5">
                <li><strong>For Customers:</strong> When you create an account, we collect your name, email address, and an encrypted password. When you request a custom order, we also collect your phone number and the details and images related to your request.</li>
                <li><strong>For Goldsmiths:</strong> When you register as a partner, we collect your workshop name, contact person, email address, phone number, location (state and district), specialties, years of experience, and a password. You may also provide a detailed bio and upload images to your portfolio.</li>
                <li><strong>For All Users:</strong> When you use our contact form, we collect your name, email, phone number, and the message you send.</li>
            </ul>

            <h3 className="font-heading text-lg text-accent/90 mt-3 mb-1">b. Information We Collect Automatically</h3>
            <ul className="space-y-1.5">
                <li><strong>Usage Data:</strong> We automatically collect information about your interactions with our service, such as login dates and, for goldsmiths, profile view counts to provide you with performance analytics.</li>
                <li><strong>Cookies:</strong> We use cookies to manage your login sessions and maintain your authentication status. Our authentication provider (Google) may also use cookies if you choose to sign in with their service.</li>
            </ul>

            <h2 className="font-heading text-xl text-accent mt-4 mb-1.5">2. How We Use Your Information</h2>
            <p>We use your information for the following purposes:</p>
            <ul className="space-y-1.5">
                <li><strong>To Provide Our Service:</strong> To create and maintain your account, and to facilitate the core function of connecting customers with goldsmiths for custom jewelry orders.</li>
                <li><strong>To Communicate With You:</strong> To send essential transactional emails, such as account verification links and password reset instructions.</li>
                <li><strong>To Ensure Platform Integrity:</strong> Our administrators use the information to verify goldsmith profiles and to review and mediate order requests, ensuring a secure and trusted marketplace.</li>
                <li><strong>To Improve Our Services:</strong> We analyze usage data to understand how our platform is used, fix issues, and develop new features.</li>
                <li><strong>For Security:</strong> To protect against fraud, abuse, and unauthorized access to accounts.</li>
            </ul>

            <h2 className="font-heading text-xl text-accent mt-4 mb-1.5">3. How We Share Your Information</h2>
            <p>Your information is shared only when necessary to provide our services. We do not sell your personal data.</p>
             <ul className="space-y-1.5">
                <li><strong>Between Customers and Goldsmiths:</strong> A customer's order request details are shared with our administrators and, upon approval, with the intended goldsmith. A goldsmith's profile information (name, general location, specialties) is publicly visible. Direct contact information is only shared through our mediated process to protect all parties.</li>
                <li><strong>With Service Providers:</strong> We rely on trusted third-party services to operate our platform, including database hosting (MongoDB), email delivery (Resend), and authentication (Google, if you opt-in). These providers are only authorized to use your information to perform services for us.</li>
                <li><strong>For Legal Reasons:</strong> We may share information if required to do so by law or in response to valid requests by public authorities.</li>
            </ul>


            <h2 className="font-heading text-xl text-accent mt-4 mb-1.5">4. Data Security</h2>
            <p>We are committed to protecting your data. We use industry-standard measures, including password encryption (hashing) and secure HTTPS connections, to safeguard your information from unauthorized access.</p>


            <h2 className="font-heading text-xl text-accent mt-4 mb-1.5">5. Your Data Rights & Choices</h2>
            <p>You have control over your personal information.</p>
             <ul className="space-y-1.5">
                <li><strong>Access and Update:</strong> You can access and update your profile information at any time through your Customer or Goldsmith dashboard.</li>
                <li><strong>Account Deletion:</strong> You can request the deletion of your account. Please note that for reporting and integrity purposes, we may retain anonymized data (e.g., order records without personal identifiers).</li>
                <li><strong>Communications:</strong> You can manage your communication preferences for non-essential emails. Transactional emails (like password resets) are required for account maintenance.</li>
            </ul>

            <h2 className="font-heading text-xl text-accent mt-4 mb-1.5">6. Children's Privacy</h2>
            <p>Our service is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected data from a child without parental consent, we will take steps to remove that information.</p>

            <h2 className="font-heading text-xl text-accent mt-4 mb-1.5">Contact Us</h2>
            <p>If you have any questions or concerns about this Privacy Policy, please contact us through our <Link href="/contact" className="text-primary hover:underline">contact page</Link>.</p>
        </CardContent>
      </Card>
    </div>
  );
}
