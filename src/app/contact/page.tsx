
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Mail, Send } from 'lucide-react'

export default function ContactPage() {
  // TODO: Implement form handling with react-hook-form and server action
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] py-12 bg-gradient-to-br from-background via-secondary/10 to-background">
      <Card className="w-full max-w-lg shadow-xl border-primary/20 rounded-xl bg-card">
        <CardHeader className="text-center pt-8 pb-4">
           <Mail className="h-12 w-12 mx-auto text-primary mb-3" />
          <CardTitle className="text-3xl font-bold text-primary">Get in Touch</CardTitle>
          <CardDescription className="text-foreground/75 mt-1.5 text-sm">Have questions, feedback, or inquiries? We'd love to hear from you!</CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8 pt-4">
          <form className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-medium text-foreground">Your Name</Label>
              <Input id="name" placeholder="e.g., Jane Doe" required className="text-sm py-2.5 text-foreground" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium text-foreground">Your Email Address</Label>
              <Input id="email" type="email" placeholder="jane.doe@example.com" required className="text-sm py-2.5 text-foreground" />
            </div>

             <div className="space-y-1.5">
              <Label htmlFor="subject" className="text-xs font-medium text-foreground">Subject</Label>
              <Input id="subject" placeholder="e.g., Inquiry about a custom design" required className="text-sm py-2.5 text-foreground" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="message" className="text-xs font-medium text-foreground">Message</Label>
              <Textarea id="message" placeholder="Please type your message here..." required rows={4} className="text-sm py-2.5 text-foreground" />
            </div>

            <Button type="submit" size="lg" className="w-full shadow-md hover:shadow-lg transition-shadow rounded-full text-base py-3 bg-primary hover:bg-primary/90 text-primary-foreground mt-2">
              <Send className="mr-2 h-4 w-4" /> Send Message
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
