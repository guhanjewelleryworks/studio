import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { LogIn } from 'lucide-react'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { SocialAuthButtons } from '@/components/auth/social-auth-buttons'

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-8rem)] py-8 bg-gradient-to-b from-background to-secondary"> {/* Reduced py and min-h calc */}
      <Card className="w-full max-w-md shadow-xl border-primary/30">
        <CardHeader className="text-center">
           <LogIn className="h-10 w-10 mx-auto text-primary mb-2" /> {/* Slightly smaller icon */}
          <CardTitle className="text-2xl font-bold text-primary-foreground">Welcome Back!</CardTitle>
          <CardDescription>Log in to your Goldsmith Connect account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4"> {/* Reduced space-y */}
            <div className="space-y-1.5"> {/* Reduced space-y */}
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="you@example.com" required />
            </div>

            <div className="space-y-1.5"> {/* Reduced space-y */}
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>

             <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5"> {/* Reduced space-x */}
                  <Checkbox id="remember-me" />
                  <label
                    htmlFor="remember-me"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground"
                  >
                    Remember me
                  </label>
                </div>
                <Link
                  href="/forgot-password" 
                  className="text-sm text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  Forgot password?
                </Link>
              </div>

            <Button type="submit" className="w-full shadow-md hover:shadow-lg transition-shadow">
              Login
            </Button>

            <Separator className="my-3" /> {/* Reduced my */}
            <SocialAuthButtons mode="login" />


             <p className="text-center text-sm text-muted-foreground pt-3"> {/* Reduced pt */}
                Don't have an account?{' '}
                <Link href="/signup" className="underline text-primary hover:text-primary/80">
                  Sign up here
                </Link>
              </p>
                <p className="text-center text-sm text-muted-foreground">
                Are you a Goldsmith?{' '}
                <Link href="/goldsmith-portal/login" className="underline text-accent hover:text-accent/80">
                  Login to Goldsmith Portal
                </Link>
              </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
