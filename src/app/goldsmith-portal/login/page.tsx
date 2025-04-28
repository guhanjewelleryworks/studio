import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LogIn } from 'lucide-react'
import Link from 'next/link'

export default function GoldsmithLoginPage() {
  // TODO: Implement form handling with react-hook-form and server action
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] py-12 bg-gradient-to-b from-background to-secondary">
      <Card className="w-full max-w-md shadow-xl border-primary/30">
        <CardHeader className="text-center">
           <LogIn className="h-12 w-12 mx-auto text-primary mb-2" />
          <CardTitle className="text-2xl font-bold text-primary-foreground">Goldsmith Portal Login</CardTitle>
          <CardDescription>Access your dashboard to manage orders and your profile.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="you@example.com" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>

             <div className="flex items-center justify-between">
                {/* <div className="flex items-center space-x-2">
                  <Checkbox id="remember-me" />
                  <label
                    htmlFor="remember-me"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </label>
                </div> */}
                <Link
                  href="/goldsmith-portal/forgot-password" // Placeholder link
                  className="text-sm text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  Forgot password?
                </Link>
              </div>


            {/* Add form submission status/errors here */}

            <Button type="submit" className="w-full shadow-md hover:shadow-lg transition-shadow">
              Login
            </Button>

             <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link href="/goldsmith-portal/register" className="underline text-primary hover:text-primary/80">
                  Register here
                </Link>
              </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
