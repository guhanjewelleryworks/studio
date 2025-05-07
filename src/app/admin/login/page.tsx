import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ShieldAlert } from 'lucide-react'
import Link from 'next/link'

export default function AdminLoginPage() {
  // TODO: Implement form handling with react-hook-form and server action
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] py-10 bg-gradient-to-br from-secondary/20 to-background"> {/* Adjusted py and gradient */}
      <Card className="w-full max-w-lg shadow-xl border-destructive/30 rounded-xl"> {/* Adjusted max-w */}
        <CardHeader className="text-center pt-8 pb-5"> {/* Adjusted padding */}
           <ShieldAlert className="h-16 w-16 mx-auto text-destructive mb-4" /> {/* Increased size and margin */}
          <CardTitle className="text-3xl font-bold text-foreground">Admin Login</CardTitle> {/* Changed to text-foreground */}
          <CardDescription className="text-foreground/75 mt-1 text-sm">Restricted Access. Authorized Personnel Only.</CardDescription> {/* Adjusted opacity and margin */}
        </CardHeader>
        <CardContent className="px-8 pb-8 pt-5"> {/* Adjusted padding */}
          <form className="space-y-5">
            <div className="space-y-1.5"> {/* Adjusted spacing */}
              <Label htmlFor="username">Username or Email</Label>
              <Input id="username" type="text" placeholder="admin_user" required className="text-base py-2.5" /> {/* Adjusted padding */}
            </div>

            <div className="space-y-1.5"> {/* Adjusted spacing */}
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required className="text-base py-2.5" /> {/* Adjusted padding */}
            </div>

            <Button type="submit" variant="destructive" size="lg" className="w-full shadow-md hover:shadow-lg transition-shadow rounded-full text-base py-3.5 mt-1"> {/* Adjusted padding and margin */}
              Secure Login
            </Button>

              <p className="text-center text-sm text-muted-foreground pt-5"> {/* Adjusted padding and font size */}
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
