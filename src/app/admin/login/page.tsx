import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ShieldAlert } from 'lucide-react'
import Link from 'next/link'

export default function AdminLoginPage() {
  // TODO: Implement form handling with react-hook-form and server action
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-8rem)] py-8 bg-gradient-to-b from-background to-muted"> {/* Reduced py and min-h calculation */}
      <Card className="w-full max-w-md shadow-xl border-destructive/50">
        <CardHeader className="text-center">
           <ShieldAlert className="h-12 w-12 mx-auto text-destructive mb-2" />
          <CardTitle className="text-2xl font-bold text-destructive">Admin Login</CardTitle>
          <CardDescription>Restricted Access. Authorized Personnel Only.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4"> {/* Reduced space-y */}
            <div className="space-y-1.5"> {/* Reduced space-y */}
              <Label htmlFor="username">Username or Email</Label>
              <Input id="username" type="text" placeholder="admin_user" required />
            </div>

            <div className="space-y-1.5"> {/* Reduced space-y */}
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>

            <Button type="submit" variant="destructive" className="w-full shadow-md hover:shadow-lg transition-shadow">
              Secure Login
            </Button>

              <p className="text-center text-xs text-muted-foreground pt-3"> {/* Reduced pt */}
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
