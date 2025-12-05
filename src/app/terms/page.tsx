
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-4xl py-10 px-4 md:px-6">
       <Card className="shadow-lg border-primary/20 bg-card">
        <CardHeader className="pb-3 pt-5">
           <CardTitle className="text-3xl text-accent mb-3">Terms of Service</CardTitle> {/* Updated to text-accent */}
           <p className="text-sm text-muted-foreground">Last Updated: July 26, 2024</p>
        </CardHeader>
        <CardContent className="prose prose-stone dark:prose-invert max-w-none text-foreground/85 space-y-3 px-6 pb-6 pt-0">
            <p>Welcome to Goldsmith Connect!</p>

            <p>These terms and conditions outline the rules and regulations for the use of Goldsmith Connect's Website, located at [Your Website URL].</p>

            <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use Goldsmith Connect if you do not agree to take all of the terms and conditions stated on this page.</p>

            <h2 className="font-heading text-xl text-accent mt-4 mb-1.5">Cookies</h2> {/* Updated to text-accent */}
            <p>We employ the use of cookies. By accessing Goldsmith Connect, you agreed to use cookies in agreement with the Goldsmith Connect's Privacy Policy.</p>

            <h2 className="font-heading text-xl text-accent mt-4 mb-1.5">License</h2> {/* Updated to text-accent */}
            <p>Unless otherwise stated, Goldsmith Connect and/or its licensors own the intellectual property rights for all material on Goldsmith Connect. All intellectual property rights are reserved. You may access this from Goldsmith Connect for your own personal use subjected to restrictions set in these terms and conditions.</p>

            <p>You must not:</p>
            <ul className="space-y-0.5">
                <li>Republish material from Goldsmith Connect</li>
                <li>Sell, rent or sub-license material from Goldsmith Connect</li>
                <li>Reproduce, duplicate or copy material from Goldsmith Connect</li>
                <li>Redistribute content from Goldsmith Connect</li>
            </ul>

             <h2 className="font-heading text-xl text-accent mt-4 mb-1.5">User Content</h2> {/* Updated to text-accent */}
            <p>Parts of this website offer an opportunity for users to post and exchange opinions and information. Goldsmith Connect does not filter, edit, publish or review Comments prior to their presence on the website. Comments do not reflect the views and opinions of Goldsmith Connect, its agents and/or affiliates. Comments reflect the views and opinions of the person who post their views and opinions.</p>
            {/* Add more sections as needed: Liability, Disclaimers, Termination, Governing Law etc. */}
            <p>[...]</p>

            <h2 className="font-heading text-xl text-accent mt-4 mb-1.5">Disclaimer</h2> {/* Updated to text-accent */}
            <p>To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. Nothing in this disclaimer will:</p>
             <ul className="space-y-0.5">
                <li>limit or exclude our or your liability for death or personal injury;</li>
                <li>limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>
                {/* More points */}
            </ul>
            <p>[...]</p>
             <p className="pt-2"><strong>Please read the full Terms of Service carefully.</strong></p>
        </CardContent>
      </Card>
    </div>
  );
}
