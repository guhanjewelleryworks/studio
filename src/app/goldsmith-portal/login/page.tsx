import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LogIn } from 'lucide-react'
import Link from 'next/link'

export default function GoldsmithLoginPage() {
  // TODO: Implement form handling with react-hook-form and server action
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] py-12 bg-gradient-to-br from-secondary/30 to-background">
      <Card className="w-full max-w-md shadow-xl border-primary/10 rounded-xl">
        <CardHeader className="text-center pt-8 pb-4">
           <LogIn className="h-12 w-12 mx-auto text-primary mb-3" />
          <CardTitle className="text-3xl font-bold text-primary-foreground">Goldsmith Portal Login</CardTitle>
          <CardDescription className="text-foreground/70">Access your dashboard to manage your profile and orders.</CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8 pt-4">
          <form className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="your.workshop@example.com" required className="text-base"/>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required className="text-base"/>
            </div>

             <div className="flex items-center justify-end"> {/* Moved forgot password to the right */}
                <Link
                  href="/goldsmith-portal/forgot-password" 
                  className="text-sm text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

            <Button type="submit" size="lg" className="w-full shadow-md hover:shadow-lg transition-shadow rounded-full text-base py-3 bg-primary hover:bg-primary/90 text-primary-foreground">
              Login to Portal
            </Button>

             <p className="text-center text-sm text-muted-foreground pt-4">
                Don&apos;t have a partner account?{' '}
                <Link href="/goldsmith-portal/register" className="font-semibold text-primary hover:text-primary/80 underline underline-offset-2 transition-colors">
                  Register here
                </Link>
              </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
