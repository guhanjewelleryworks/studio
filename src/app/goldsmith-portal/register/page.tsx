import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function GoldsmithRegisterPage() {
  // TODO: Implement form handling with react-hook-form and server action
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] py-12 bg-gradient-to-b from-background to-secondary">
      <Card className="w-full max-w-2xl shadow-xl border-primary/30">
        <CardHeader className="text-center">
          <CheckCircle className="h-12 w-12 mx-auto text-primary mb-2" />
          <CardTitle className="text-2xl font-bold text-primary-foreground">Register Your Goldsmith Workshop</CardTitle>
          <CardDescription>Join our network of skilled artisans. Fill in the details below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                <Label htmlFor="workshopName">Workshop Name</Label>
                <Input id="workshopName" placeholder="e.g., Golden Touch Crafters" required />
              </div>
               <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input id="contactPerson" placeholder="Your Name" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="you@example.com" required />
            </div>

             <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="Your Contact Number" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Workshop Address</Label>
              <Textarea id="address" placeholder="Full address of your workshop" required />
            </div>

             <div className="space-y-2">
              <Label htmlFor="specialties">Specialties</Label>
              <Input id="specialties" placeholder="e.g., Custom Rings, Engraving, Restoration" required />
               <p className="text-xs text-muted-foreground">Separate specialties with commas.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="portfolio">Portfolio Link (Optional)</Label>
              <Input id="portfolio" type="url" placeholder="Link to your website or online portfolio" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Create Password</Label>
              <Input id="password" type="password" required />
            </div>

             <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" type="password" required />
            </div>


            {/* Add form submission status/errors here */}

            <Button type="submit" className="w-full shadow-md hover:shadow-lg transition-shadow">
              Submit Registration
            </Button>
             <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/goldsmith-portal/login" className="underline text-primary hover:text-primary/80">
                  Login here
                </Link>
              </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
