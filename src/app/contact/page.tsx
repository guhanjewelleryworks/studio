import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Mail } from 'lucide-react'

export default function ContactPage() {
  // TODO: Implement form handling with react-hook-form and server action
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] py-12 bg-gradient-to-b from-background to-secondary">
      <Card className="w-full max-w-lg shadow-xl border-primary/30">
        <CardHeader className="text-center">
           <Mail className="h-12 w-12 mx-auto text-primary mb-2" />
          <CardTitle className="text-2xl font-bold text-primary-foreground">Contact Us</CardTitle>
          <CardDescription>Have questions or feedback? Reach out to us!</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input id="name" placeholder="John Doe" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Your Email Address</Label>
              <Input id="email" type="email" placeholder="you@example.com" required />
            </div>

             <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="e.g., Question about an order" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Your message here..." required rows={6} />
            </div>

            {/* Add form submission status/errors here */}
            {/* e.g., <p className="text-green-600 text-sm">Message sent successfully!</p> */}

            <Button type="submit" className="w-full shadow-md hover:shadow-lg transition-shadow">
              Send Message
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
