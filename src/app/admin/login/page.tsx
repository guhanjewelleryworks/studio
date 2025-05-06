import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ShieldAlert } from 'lucide-react'
import Link from 'next/link'

export default function AdminLoginPage() {
  // TODO: Implement form handling with react-hook-form and server action
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] py-12 bg-gradient-to-br from-secondary/30 to-background">
      <Card className="w-full max-w-md shadow-xl border-destructive/30 rounded-xl">
        <CardHeader className="text-center pt-8 pb-4">
           <ShieldAlert className="h-14 w-14 mx-auto text-destructive mb-3" />
          <CardTitle className="text-3xl font-bold text-destructive">Admin Login</CardTitle>
          <CardDescription className="text-foreground/70">Restricted Access. Authorized Personnel Only.</CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8 pt-4">
          <form className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username">Username or Email</Label>
              <Input id="username" type="text" placeholder="admin_user" required className="text-base" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required className="text-base" />
            </div>

            <Button type="submit" variant="destructive" size="lg" className="w-full shadow-md hover:shadow-lg transition-shadow rounded-full text-base py-3">
              Secure Login
            </Button>

              <p className="text-center text-xs text-muted-foreground pt-4">
                 For security reasons, password recovery options are limited.
                 <br /> Contact system administrator if you have issues logging in.
                 <br />
                 <Link href="/" className="underline hover:text-primary transition-colors">Return to Homepage</Link>
              </p>

          </form>
        </CardContent>
      </Card>
    </div>
  )
}
