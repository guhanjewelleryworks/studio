
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ShieldAlert } from 'lucide-react'
import Link from 'next/link'

export default function AdminLoginPage() {
  // TODO: Implement form handling with react-hook-form and server action
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] py-10 bg-gradient-to-br from-secondary/20 to-background">
      <Card className="w-full max-w-lg shadow-xl border-destructive/30 rounded-xl bg-card">
        <CardHeader className="text-center pt-8 pb-5">
           <ShieldAlert className="h-16 w-16 mx-auto text-destructive mb-4" />
          <CardTitle className="text-3xl font-bold text-foreground">Admin Login</CardTitle>
          <CardDescription className="text-muted-foreground mt-1 text-sm">Restricted Access. Authorized Personnel Only.</CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8 pt-5">
          <form className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-foreground">Username or Email</Label>
              <Input id="username" type="text" placeholder="admin_user" required className="text-base py-2.5 text-foreground" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <Input id="password" type="password" required className="text-base py-2.5 text-foreground" />
            </div>

            <Button type="submit" variant="destructive" size="lg" className="w-full shadow-md hover:shadow-lg transition-shadow rounded-full text-base py-3.5 mt-1">
              Secure Login
            </Button>

              <p className="text-center text-sm text-muted-foreground pt-5">
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
