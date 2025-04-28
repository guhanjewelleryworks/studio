import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ShieldAlert } from 'lucide-react'
import Link from 'next/link'

export default function AdminLoginPage() {
  // TODO: Implement form handling with react-hook-form and server action
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] py-12 bg-gradient-to-b from-background to-muted">
      <Card className="w-full max-w-md shadow-xl border-destructive/50">
        <CardHeader className="text-center">
           <ShieldAlert className="h-12 w-12 mx-auto text-destructive mb-2" />
          <CardTitle className="text-2xl font-bold text-destructive">Admin Login</CardTitle>
          <CardDescription>Restricted Access. Authorized Personnel Only.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username or Email</Label>
              <Input id="username" type="text" placeholder="admin_user" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>

            {/* Add form submission status/errors here (consider more robust auth indicators) */}
            {/* e.g., <p className="text-destructive text-sm">Invalid credentials.</p> */}

            <Button type="submit" variant="destructive" className="w-full shadow-md hover:shadow-lg transition-shadow">
              Secure Login
            </Button>

            {/* Optional: Add MFA input or other security measures here */}

              <p className="text-center text-xs text-muted-foreground pt-4">
                 For security reasons, password recovery options are limited. Contact system administrator if you have issues logging in.
                 <br />
                 <Link href="/" className="underline hover:text-primary">Return to Homepage</Link>
              </p>

          </form>
        </CardContent>
      </Card>
    </div>
  )
}
