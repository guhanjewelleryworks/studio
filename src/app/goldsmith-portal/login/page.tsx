
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LogIn } from 'lucide-react'
import Link from 'next/link'

export default function GoldsmithLoginPage() {
  // TODO: Implement form handling with react-hook-form and server action
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] py-10 bg-gradient-to-br from-secondary/20 to-background">
      <Card className="w-full max-w-lg shadow-xl border-primary/15 rounded-xl bg-card">
        <CardHeader className="text-center pt-8 pb-5">
           <LogIn className="h-14 w-14 mx-auto text-primary mb-3.5" />
          <CardTitle className="text-3xl text-foreground">Goldsmith Portal Login</CardTitle> {/* CardTitle uses font-heading */}
          <CardDescription className="text-muted-foreground mt-1 text-sm">Access your dashboard to manage your profile and orders.</CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8 pt-5">
          <form className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-foreground">Email Address</Label>
              <Input id="email" type="email" placeholder="your.workshop@example.com" required className="text-base py-2.5 text-foreground"/>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <Input id="password" type="password" required className="text-base py-2.5 text-foreground"/>
            </div>

             <div className="flex items-center justify-end pt-1">
                <Link
                  href="/goldsmith-portal/forgot-password" 
                  className="text-sm text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

            <Button type="submit" size="lg" className="w-full shadow-md hover:shadow-lg transition-shadow rounded-full text-base py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground mt-1">
              Login to Portal
            </Button>

             <p className="text-center text-sm text-muted-foreground pt-5">
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
