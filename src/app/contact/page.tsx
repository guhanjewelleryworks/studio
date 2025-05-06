import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Mail, Send } from 'lucide-react'

export default function ContactPage() {
  // TODO: Implement form handling with react-hook-form and server action
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-7rem)] py-8 bg-gradient-to-br from-secondary/30 to-background">
      <Card className="w-full max-w-md shadow-xl border-primary/20 rounded-xl">
        <CardHeader className="text-center pt-5 pb-2.5">
           <Mail className="h-9 w-9 mx-auto text-primary mb-2" />
          <CardTitle className="text-2xl font-bold text-primary-foreground">Get in Touch</CardTitle>
          <CardDescription className="text-foreground/70 text-sm">Have questions, feedback, or inquiries? We'd love to hear from you!</CardDescription>
        </CardHeader>
        <CardContent className="px-5 pb-5 pt-2.5">
          <form className="space-y-3.5">
            <div className="space-y-1">
              <Label htmlFor="name" className="text-xs">Your Name</Label>
              <Input id="name" placeholder="e.g., Jane Doe" required className="text-sm" />
            </div>

            <div className="space-y-1">
              <Label htmlFor="email" className="text-xs">Your Email Address</Label>
              <Input id="email" type="email" placeholder="jane.doe@example.com" required className="text-sm" />
            </div>

             <div className="space-y-1">
              <Label htmlFor="subject" className="text-xs">Subject</Label>
              <Input id="subject" placeholder="e.g., Inquiry about a custom design" required className="text-sm" />
            </div>

            <div className="space-y-1">
              <Label htmlFor="message" className="text-xs">Message</Label>
              <Textarea id="message" placeholder="Please type your message here..." required rows={3} className="text-sm" />
            </div>

            <Button type="submit" size="default" className="w-full shadow-md hover:shadow-lg transition-shadow rounded-full text-sm py-2 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Send className="mr-2 h-3.5 w-3.5" /> Send Message
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
