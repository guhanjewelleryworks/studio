// src/app/goldsmith-portal/register/page.tsx
'use client'; // This is important for event handlers

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle, Briefcase } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

export default function GoldsmithRegisterPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [workshopName, setWorkshopName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [specialties, setSpecialties] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      toast({
        title: 'Registration Error',
        description: 'Passwords do not match.',
        variant: 'destructive',
      });
      setIsLoading(false); // Reset loading state on error
      return;
    }

    // In a real app, you would make an API call here to your backend
    // to register the goldsmith and store their details.
    try {
      // Simulate API call for registration
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('Simulated registration submitted:', { workshopName, contactPerson, email, phone, address, specialties, portfolio });

      toast({
        title: 'Registration Submitted (Simulated)',
        description: 'Your workshop details have been submitted for review. You will be redirected shortly.',
      });

      // Redirect after a short delay
      setTimeout(() => {
        router.push('/goldsmith-portal/login'); // Redirect to login or a confirmation page
      }, 2000);

      // Optionally reset form fields here if not redirecting immediately
      // setWorkshopName(''); setContactPerson(''); setEmail(''); // etc.

    } catch (error) {
      // This catch block is for potential errors during the (real or simulated) API call
      toast({
        title: 'Registration Failed',
        description: (error as Error).message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      // Ensure isLoading is set to false regardless of success or failure,
      // to re-enable form elements if redirection is delayed or doesn't occur.
      setIsLoading(false);
    }
  };


  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] py-10 bg-gradient-to-br from-secondary/20 to-background">
      <Card className="w-full max-w-2xl shadow-xl border-primary/15 rounded-xl bg-card">
        <CardHeader className="text-center pt-6 pb-4">
          <Briefcase className="h-12 w-12 mx-auto text-primary mb-3" />
          <CardTitle className="text-3xl text-accent font-heading">Register Your Goldsmith Workshop</CardTitle>
          <CardDescription className="text-muted-foreground mt-1 text-sm font-poppins">Join our curated network of skilled artisans. Please fill in your details below.</CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-4">
          <form className="space-y-3.5" onSubmit={handleSubmit}> {/* Reduced space-y */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3">
               <div className="space-y-1">
                <Label htmlFor="workshopName" className="text-foreground">Workshop Name</Label>
                <Input id="workshopName" placeholder="e.g., Aura & Gold Creations" required className="text-foreground" value={workshopName} onChange={(e) => setWorkshopName(e.target.value)} disabled={isLoading}/>
              </div>
               <div className="space-y-1">
                <Label htmlFor="contactPerson" className="text-foreground">Contact Person</Label>
                <Input id="contactPerson" placeholder="Your Full Name" required className="text-foreground" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} disabled={isLoading}/>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3">
              <div className="space-y-1">
                <Label htmlFor="email" className="text-foreground">Business Email Address</Label>
                <Input id="email" type="email" placeholder="contact@auragold.com" required className="text-foreground" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading}/>
              </div>
               <div className="space-y-1">
                <Label htmlFor="phone" className="text-foreground">Business Phone Number</Label>
                <Input id="phone" type="tel" placeholder="(+1) 555-123-4567" required className="text-foreground" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={isLoading}/>
              </div>
            </div>


            <div className="space-y-1">
              <Label htmlFor="address" className="text-foreground">Workshop Address</Label>
              <Textarea id="address" placeholder="Full address of your workshop or studio" required rows={2} className="text-foreground" value={address} onChange={(e) => setAddress(e.target.value)} disabled={isLoading}/>
            </div>

             <div className="space-y-1">
              <Label htmlFor="specialties" className="text-foreground">Specialties & Techniques</Label>
              <Input id="specialties" placeholder="e.g., Custom Engagement Rings, Hand Engraving, Gemstone Setting" required className="text-foreground" value={specialties} onChange={(e) => setSpecialties(e.target.value)} disabled={isLoading}/>
               <p className="text-xs text-muted-foreground pt-0.5">Separate multiple specialties with commas.</p>
            </div>

            <div className="space-y-1">
              <Label htmlFor="portfolio" className="text-foreground">Portfolio Link (Website, Instagram, etc.)</Label>
              <Input id="portfolio" type="url" placeholder="https://yourportfolio.com" className="text-foreground" value={portfolio} onChange={(e) => setPortfolio(e.target.value)} disabled={isLoading}/>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3">
              <div className="space-y-1">
                <Label htmlFor="password" className="text-foreground">Create Password</Label>
                <Input id="password" type="password" required className="text-foreground" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading}/>
              </div>
               <div className="space-y-1">
                <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
                <Input id="confirmPassword" type="password" required className="text-foreground" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isLoading}/>
              </div>
            </div>


            <Button type="submit" size="lg" className="w-full shadow-md hover:shadow-lg transition-shadow rounded-full text-base py-3 mt-2.5 bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
              <CheckCircle className="mr-2 h-5 w-5"/> {isLoading ? 'Submitting...' : 'Submit Registration'}
            </Button>
             <p className="text-center text-sm text-muted-foreground pt-3">
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
