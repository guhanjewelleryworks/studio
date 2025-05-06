
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle, Briefcase } from 'lucide-react' // Using Briefcase for workshop
import Link from 'next/link'

export default function GoldsmithRegisterPage() {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert('Registration submission (simulated). Actual database integration needed.');
  };


  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] py-12 bg-gradient-to-br from-secondary/30 to-background">
      <Card className="w-full max-w-2xl shadow-xl border-primary/10 rounded-xl">
        <CardHeader className="text-center pt-8 pb-4">
          <Briefcase className="h-12 w-12 mx-auto text-primary mb-3" />
          <CardTitle className="text-3xl font-bold text-primary-foreground">Register Your Goldsmith Workshop</CardTitle>
          <CardDescription className="text-foreground/70">Join our curated network of skilled artisans. Please fill in your details below.</CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8 pt-4">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
               <div className="space-y-2">
                <Label htmlFor="workshopName">Workshop Name</Label>
                <Input id="workshopName" placeholder="e.g., Aura & Gold Creations" required className="text-base"/>
              </div>
               <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input id="contactPerson" placeholder="Your Full Name" required className="text-base"/>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Business Email Address</Label>
                <Input id="email" type="email" placeholder="contact@auragold.com" required className="text-base"/>
              </div>
               <div className="space-y-2">
                <Label htmlFor="phone">Business Phone Number</Label>
                <Input id="phone" type="tel" placeholder="(+1) 555-123-4567" required className="text-base"/>
              </div>
            </div>
            

            <div className="space-y-2">
              <Label htmlFor="address">Workshop Address</Label>
              <Textarea id="address" placeholder="Full address of your workshop or studio" required rows={3} className="text-base"/>
            </div>

             <div className="space-y-2">
              <Label htmlFor="specialties">Specialties & Techniques</Label>
              <Input id="specialties" placeholder="e.g., Custom Engagement Rings, Hand Engraving, Gemstone Setting" required className="text-base"/>
               <p className="text-xs text-muted-foreground">Separate multiple specialties with commas.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="portfolio">Portfolio Link (Website, Instagram, etc.)</Label>
              <Input id="portfolio" type="url" placeholder="https://yourportfolio.com" className="text-base"/>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div className="space-y-2">
                <Label htmlFor="password">Create Password</Label>
                <Input id="password" type="password" required className="text-base"/>
              </div>
               <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" required className="text-base"/>
              </div>
            </div>
            

            <Button type="submit" size="lg" className="w-full shadow-md hover:shadow-lg transition-shadow rounded-full text-base py-3 bg-primary hover:bg-primary/90 text-primary-foreground mt-2">
              <CheckCircle className="mr-2 h-5 w-5"/> Submit Registration
            </Button>
             <p className="text-center text-sm text-muted-foreground pt-4">
                Already a partner?{' '}
                <Link href="/goldsmith-portal/login" className="font-semibold text-primary hover:text-primary/80 underline underline-offset-2 transition-colors">
                  Login to your portal
                </Link>
              </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
