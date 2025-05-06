import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UserPlus } from 'lucide-react'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { SocialAuthButtons } from '@/components/auth/social-auth-buttons'

export default function SignUpPage() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-8rem)] py-8 bg-gradient-to-b from-background to-secondary"> {/* Reduced py and min-h calc */}
      <Card className="w-full max-w-md shadow-xl border-primary/30">
        <CardHeader className="text-center">
           <UserPlus className="h-10 w-10 mx-auto text-primary mb-2" /> {/* Slightly smaller icon */}
          <CardTitle className="text-2xl font-bold text-primary-foreground">Create Your Account</CardTitle>
          <CardDescription>Join Goldsmith Connect to discover artisans and order custom jewelry.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4"> {/* Reduced space-y */}
            <div className="space-y-1.5"> {/* Reduced space-y */}
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Your Name" required />
            </div>

            <div className="space-y-1.5"> {/* Reduced space-y */}
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="you@example.com" required />
            </div>

            <div className="space-y-1.5"> {/* Reduced space-y */}
              <Label htmlFor="password">Create Password</Label>
              <Input id="password" type="password" required />
            </div>

             <div className="space-y-1.5"> {/* Reduced space-y */}
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" type="password" required />
            </div>
            
            <Button type="submit" className="w-full shadow-md hover:shadow-lg transition-shadow">
              Sign Up
            </Button>
            
            <Separator className="my-3" /> {/* Reduced my */}
            <SocialAuthButtons mode="signup" />


             <p className="text-center text-sm text-muted-foreground pt-3"> {/* Reduced pt */}
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
