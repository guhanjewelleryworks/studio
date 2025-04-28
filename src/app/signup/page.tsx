import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UserPlus } from 'lucide-react'
import Link from 'next/link'

export default function SignUpPage() {
  // TODO: Implement form handling with react-hook-form and server action
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] py-12 bg-gradient-to-b from-background to-secondary">
      <Card className="w-full max-w-md shadow-xl border-primary/30">
        <CardHeader className="text-center">
           <UserPlus className="h-12 w-12 mx-auto text-primary mb-2" />
          <CardTitle className="text-2xl font-bold text-primary-foreground">Create Your Account</CardTitle>
          <CardDescription>Join Goldsmith Connect to discover artisans and order custom jewelry.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Your Name" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="you@example.com" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Create Password</Label>
              <Input id="password" type="password" required />
            </div>

             <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" type="password" required />
            </div>

            {/* Add terms acceptance checkbox here if needed */}
             {/* <div className="flex items-center space-x-2">
                <Checkbox id="terms" required />
                <label htmlFor="terms" className="text-sm text-muted-foreground">
                  I agree to the <Link href="/terms" className="underline text-primary hover:text-primary/80">Terms</Link> and <Link href="/privacy" className="underline text-primary hover:text-primary/80">Privacy Policy</Link>.
                </label>
             </div> */}


            {/* Add form submission status/errors here */}
            {/* e.g., <p className="text-destructive text-sm">Passwords do not match.</p> */}

            <Button type="submit" className="w-full shadow-md hover:shadow-lg transition-shadow">
              Sign Up
            </Button>

            {/* Optional: Add social signup buttons here */}

             <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="underline text-primary hover:text-primary/80">
                  Login here
                </Link>
              </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
