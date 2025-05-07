
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
        <CardHeader className="text-center pt-6 pb-4"> {/* Reduced pt/pb */}
           <ShieldAlert className="h-14 w-14 mx-auto text-destructive mb-3" /> {/* Reduced mb */}
          <CardTitle className="text-3xl text-foreground">Admin Login</CardTitle>
          <CardDescription className="text-muted-foreground mt-1 text-sm">Restricted Access. Authorized Personnel Only.</CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-6 pt-4"> {/* Reduced pb/pt */}
          <form className="space-y-4"> {/* Reduced space-y */}
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-foreground">Username or Email</Label>
              <Input id="username" type="text" placeholder="admin_user" required className="text-base py-2 text-foreground" /> {/* Reduced py */}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <Input id="password" type="password" required className="text-base py-2 text-foreground" /> {/* Reduced py */}
            </div>

            <Button type="submit" variant="destructive" size="lg" className="w-full shadow-md hover:shadow-lg transition-shadow rounded-full text-base py-3 mt-2"> {/* Reduced py and mt */}
              Secure Login
            </Button>

              <p className="text-center text-sm text-muted-foreground pt-4"> {/* Reduced pt */}
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
