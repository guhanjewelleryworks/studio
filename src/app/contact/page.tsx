import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Mail } from 'lucide-react'

export default function ContactPage() {
  // TODO: Implement form handling with react-hook-form and server action
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-8rem)] py-8 bg-gradient-to-b from-background to-secondary"> {/* Reduced py and min-h calc */}
      <Card className="w-full max-w-lg shadow-xl border-primary/30">
        <CardHeader className="text-center">
           <Mail className="h-10 w-10 mx-auto text-primary mb-2" /> {/* Slightly smaller icon */}
          <CardTitle className="text-2xl font-bold text-primary-foreground">Contact Us</CardTitle>
          <CardDescription>Have questions or feedback? Reach out to us!</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4"> {/* Reduced space-y */}
            <div className="space-y-1.5"> {/* Reduced space-y */}
              <Label htmlFor="name">Your Name</Label>
              <Input id="name" placeholder="John Doe" required />
            </div>

            <div className="space-y-1.5"> {/* Reduced space-y */}
              <Label htmlFor="email">Your Email Address</Label>
              <Input id="email" type="email" placeholder="you@example.com" required />
            </div>

             <div className="space-y-1.5"> {/* Reduced space-y */}
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="e.g., Question about an order" required />
            </div>

            <div className="space-y-1.5"> {/* Reduced space-y */}
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Your message here..." required rows={5} /> {/* Reduced rows */}
            </div>

            <Button type="submit" className="w-full shadow-md hover:shadow-lg transition-shadow">
              Send Message
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
