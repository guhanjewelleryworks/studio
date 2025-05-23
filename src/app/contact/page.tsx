
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Mail, Send } from 'lucide-react'

export default function ContactPage() {
  // TODO: Implement form handling with react-hook-form and server action
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] py-10 bg-gradient-to-br from-background via-secondary/10 to-background">
      <Card className="w-full max-w-lg shadow-xl border-primary/20 rounded-xl bg-card">
        <CardHeader className="text-center pt-6 pb-3">
           <Mail className="h-10 w-10 mx-auto text-primary mb-2.5" />
          <CardTitle className="text-3xl text-accent">Get in Touch</CardTitle> {/* Updated to text-accent */}
          <CardDescription className="text-muted-foreground mt-1 text-sm">Have questions, feedback, or inquiries? We'd love to hear from you!</CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-3">
          <form className="space-y-3.5">
            <div className="space-y-1">
              <Label htmlFor="name" className="text-xs font-medium text-foreground">Your Name</Label>
              <Input id="name" placeholder="e.g., Jane Doe" required className="text-sm py-2 text-foreground" />
            </div>

            <div className="space-y-1">
              <Label htmlFor="email" className="text-xs font-medium text-foreground">Your Email Address</Label>
              <Input id="email" type="email" placeholder="jane.doe@example.com" required className="text-sm py-2 text-foreground" />
            </div>

             <div className="space-y-1">
              <Label htmlFor="subject" className="text-xs font-medium text-foreground">Subject</Label>
              <Input id="subject" placeholder="e.g., Inquiry about a custom design" required className="text-sm py-2 text-foreground" />
            </div>

            <div className="space-y-1">
              <Label htmlFor="message" className="text-xs font-medium text-foreground">Message</Label>
              <Textarea id="message" placeholder="Please type your message here..." required rows={3} className="text-sm py-2 text-foreground" />
            </div>

            <Button type="submit" size="lg" className="w-full shadow-md hover:shadow-lg transition-shadow rounded-full text-base py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground mt-2.5">
              <Send className="mr-2 h-4 w-4" /> Send Message
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
