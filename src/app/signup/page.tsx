
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UserPlus } from 'lucide-react'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { SocialAuthButtons } from '@/components/auth/social-auth-buttons'

export default function SignUpPage() {
  // TODO: Implement actual form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate signup
    alert("Signup functionality (simulated). Actual implementation needed.");
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] py-12 bg-gradient-to-br from-secondary/30 to-background">
      <Card className="w-full max-w-md shadow-xl border-primary/10 rounded-xl bg-card">
        <CardHeader className="text-center pt-8 pb-4">
           <UserPlus className="h-12 w-12 mx-auto text-primary mb-3" />
          <CardTitle className="text-3xl font-bold text-foreground">Create Your Account</CardTitle>
          <CardDescription className="text-muted-foreground">Join Goldsmith Connect to discover artisans and craft your story.</CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8 pt-4">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">Full Name</Label>
              <Input id="name" placeholder="e.g., Alex Smith" required className="text-base text-foreground" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email Address</Label>
              <Input id="email" type="email" placeholder="alex.smith@example.com" required className="text-base text-foreground" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Create Password</Label>
              <Input id="password" type="password" required className="text-base text-foreground" />
            </div>

             <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
              <Input id="confirmPassword" type="password" required className="text-base text-foreground" />
            </div>
            
            <Button type="submit" size="lg" className="w-full shadow-md hover:shadow-lg transition-shadow rounded-full text-base py-3 bg-primary hover:bg-primary/90 text-primary-foreground">
              Sign Up
            </Button>
            
            <Separator className="my-6" />
            <SocialAuthButtons mode="signup" />


             <p className="text-center text-sm text-muted-foreground pt-4">
                Already have an account?{' '}
                <Link href="/login" className="font-semibold text-primary hover:text-primary/80 underline underline-offset-2 transition-colors">
                  Login here
                </Link>
              </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
