
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
  // TODO: Implement actual form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    alert("Login functionality (simulated). Actual implementation needed.");
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] py-12 bg-gradient-to-br from-secondary/30 to-background">
      <Card className="w-full max-w-md shadow-xl border-primary/10 rounded-xl bg-card">
        <CardHeader className="text-center pt-8 pb-4">
           <LogIn className="h-12 w-12 mx-auto text-primary mb-3" />
          <CardTitle className="text-3xl font-bold text-foreground">Welcome Back!</CardTitle>
          <CardDescription className="text-muted-foreground">Log in to continue your Goldsmith Connect journey.</CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8 pt-4">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email Address</Label>
              <Input id="email" type="email" placeholder="you@example.com" required className="text-base text-foreground" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <Input id="password" type="password" required className="text-base text-foreground" />
            </div>

             <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
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
                  className="text-sm text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

            <Button type="submit" size="lg" className="w-full shadow-md hover:shadow-lg transition-shadow rounded-full text-base py-3 bg-primary hover:bg-primary/90 text-primary-foreground">
              Login
            </Button>

            <Separator className="my-6" />
            <SocialAuthButtons mode="login" />


             <p className="text-center text-sm text-muted-foreground pt-4">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="font-semibold text-primary hover:text-primary/80 underline underline-offset-2 transition-colors">
                  Sign up here
                </Link>
              </p>
              <p className="text-center text-sm text-muted-foreground">
                Are you a Goldsmith?{' '}
                <Link href="/goldsmith-portal/login" className="font-semibold text-accent hover:text-accent/80 underline underline-offset-2 transition-colors">
                  Login to Goldsmith Portal
                </Link>
              </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
