
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
    <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] py-10 bg-gradient-to-br from-secondary/30 to-background"> {/* Reduced py-12 */}
      <Card className="w-full max-w-md shadow-xl border-primary/10 rounded-xl bg-card">
        <CardHeader className="text-center pt-6 pb-3"> {/* Reduced pt/pb */}
           <UserPlus className="h-10 w-10 mx-auto text-primary mb-2.5" /> {/* Reduced icon size and mb */}
          <CardTitle className="text-3xl text-foreground">Create Your Account</CardTitle>
          <CardDescription className="text-muted-foreground mt-1">Join Goldsmith Connect to discover artisans and craft your story.</CardDescription> {/* Reduced mt */}
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-3"> {/* Reduced px/pb/pt */}
          <form className="space-y-4" onSubmit={handleSubmit}> {/* Reduced space-y */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-foreground">Full Name</Label>
              <Input id="name" placeholder="e.g., Alex Smith" required className="text-base text-foreground py-2" /> {/* Reduced py */}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-foreground">Email Address</Label>
              <Input id="email" type="email" placeholder="alex.smith@example.com" required className="text-base text-foreground py-2" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-foreground">Create Password</Label>
              <Input id="password" type="password" required className="text-base text-foreground py-2" />
            </div>

             <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
              <Input id="confirmPassword" type="password" required className="text-base text-foreground py-2" />
            </div>
            
            <Button type="submit" size="lg" className="w-full shadow-md hover:shadow-lg transition-shadow rounded-full text-base py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground"> {/* Reduced py */}
              Sign Up
            </Button>
            
            <Separator className="my-5" /> {/* Reduced my-6 */}
            <SocialAuthButtons mode="signup" />


             <p className="text-center text-sm text-muted-foreground pt-3.5"> {/* Reduced pt */}
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
