import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Mail, Send } from 'lucide-react'

export default function ContactPage() {
  // TODO: Implement form handling with react-hook-form and server action
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-8rem)] py-10 bg-gradient-to-br from-secondary/30 to-background"> {/* Reduced padding and min-height */}
      <Card className="w-full max-w-lg shadow-xl border-primary/20 rounded-xl">
        <CardHeader className="text-center pt-6 pb-3"> {/* Adjusted padding */}
           <Mail className="h-10 w-10 mx-auto text-primary mb-2.5" /> {/* Adjusted size and margin */}
          <CardTitle className="text-3xl font-bold text-primary-foreground">Get in Touch</CardTitle>
          <CardDescription className="text-foreground/70">Have questions, feedback, or inquiries? We'd love to hear from you!</CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-3"> {/* Adjusted padding */}
          <form className="space-y-4"> {/* Reduced space */}
            <div className="space-y-1.5"> {/* Reduced space */}
              <Label htmlFor="name">Your Name</Label>
              <Input id="name" placeholder="e.g., Jane Doe" required className="text-base" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Your Email Address</Label>
              <Input id="email" type="email" placeholder="jane.doe@example.com" required className="text-base" />
            </div>

             <div className="space-y-1.5">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="e.g., Inquiry about a custom design" required className="text-base" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Please type your message here..." required rows={4} className="text-base" /> {/* Reduced rows */}
            </div>

            <Button type="submit" size="lg" className="w-full shadow-md hover:shadow-lg transition-shadow rounded-full text-base py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground"> {/* Adjusted padding */}
              <Send className="mr-2 h-4 w-4" /> Send Message
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
