// src/app/goldsmith-portal/register/page.tsx
'use client';

import type { NewGoldsmithInput } from '@/types/goldsmith';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Briefcase, Loader2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { saveGoldsmith } from '@/actions/goldsmith-actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function GoldsmithRegisterPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [workshopName, setWorkshopName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [specialties, setSpecialties] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    const trimmedWorkshopName = workshopName.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim(); // Password state is already trimmed via onChange typically, but explicit trim is safer
    const trimmedConfirmPassword = confirmPassword.trim();
    const trimmedContactPerson = contactPerson.trim();
    const trimmedPhone = phone.trim();
    const trimmedAddress = address.trim();
    const trimmedSpecialtiesArray = specialties.split(',').map(s => s.trim()).filter(s => s);
    const trimmedPortfolioLink = portfolioLink.trim();

    if (!trimmedWorkshopName || !trimmedEmail || !trimmedPassword) {
      toast({
        title: 'Registration Error',
        description: 'Workshop name, email, and password are required. Please fill all fields.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      toast({ title: 'Registration Error', description: 'Passwords do not match.', variant: 'destructive' });
      setIsSubmitting(false);
      return;
    }

    try {
      const newGoldsmithData: NewGoldsmithInput = {
        name: trimmedWorkshopName,
        contactPerson: trimmedContactPerson,
        email: trimmedEmail,
        phone: trimmedPhone,
        address: trimmedAddress,
        specialty: trimmedSpecialtiesArray,
        portfolioLink: trimmedPortfolioLink,
        password: trimmedPassword,
      };

      const result = await saveGoldsmith(newGoldsmithData);

      if (result.success && result.data) {
        toast({
          title: 'Registration Submitted',
          description: 'Your workshop details have been submitted for review. Redirecting to login...',
        });
        setTimeout(() => {
          router.push('/goldsmith-portal/login');
        }, 2000);
      } else {
        console.error("Failed to save goldsmith profile to MongoDB:", result.error);
        toast({
          title: 'Profile Save Failed',
          description: result.error || 'Could not save your profile. Please contact support.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error("Registration submission failed:", error);
      let description = 'An unexpected error occurred during registration submission.';
      if (error instanceof Error) {
        description = error.message;
      }
      toast({
        title: 'Registration Failed',
        description: description,
        variant: 'destructive',
      });
    } finally {
        setIsSubmitting(false);
    }
  };

  const isFormDisabled = isSubmitting;

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] py-10 bg-gradient-to-br from-secondary/20 to-background">
      <Card className="w-full max-w-2xl shadow-xl border-primary/15 rounded-xl bg-card">
        <CardHeader className="text-center pt-6 pb-4">
          <Briefcase className="h-12 w-12 mx-auto text-primary mb-3" />
          <CardTitle className="text-3xl text-accent font-heading">Register Your Goldsmith Workshop</CardTitle>
          <CardDescription className="text-muted-foreground mt-1 text-sm font-poppins">Join our curated network of skilled artisans. Please fill in your details below.</CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-4">
          <form className="space-y-3.5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3">
               <div className="space-y-1">
                <Label htmlFor="workshopName" className="text-foreground">Workshop Name</Label>
                <Input id="workshopName" placeholder="e.g., Aura & Gold Creations" required className="text-foreground" value={workshopName} onChange={(e) => setWorkshopName(e.target.value)} disabled={isFormDisabled}/>
              </div>
               <div className="space-y-1">
                <Label htmlFor="contactPerson" className="text-foreground">Contact Person</Label>
                <Input id="contactPerson" placeholder="Your Full Name" required className="text-foreground" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} disabled={isFormDisabled}/>
              </div>
            </div>

            <div className="space-y-1">
                <Label htmlFor="email" className="text-foreground">Business Email Address</Label>
                <Input id="email" type="email" placeholder="contact@auragold.com" required className="text-foreground flex-grow" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isFormDisabled}/>
            </div>

             <div className="space-y-1">
                <Label htmlFor="phone" className="text-foreground">Business Phone Number</Label>
                <Input id="phone" type="tel" placeholder="e.g., 9876543210" required className="text-foreground flex-grow" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={isFormDisabled}/>
            </div>

            <div className="space-y-1">
              <Label htmlFor="address" className="text-foreground">Workshop Address</Label>
              <Textarea id="address" placeholder="Full address of your workshop or studio" required rows={2} className="text-foreground" value={address} onChange={(e) => setAddress(e.target.value)} disabled={isFormDisabled}/>
            </div>

             <div className="space-y-1">
              <Label htmlFor="specialties" className="text-foreground">Specialties & Techniques</Label>
              <Input id="specialties" placeholder="e.g., Custom Engagement Rings, Hand Engraving, Gemstone Setting" required className="text-foreground" value={specialties} onChange={(e) => setSpecialties(e.target.value)} disabled={isFormDisabled}/>
               <p className="text-xs text-muted-foreground pt-0.5">Separate multiple specialties with commas.</p>
            </div>

            <div className="space-y-1">
              <Label htmlFor="portfolioLink" className="text-foreground">Portfolio Link (Website, Instagram, etc.)</Label>
              <Input id="portfolioLink" type="url" placeholder="https://yourportfolio.com" className="text-foreground" value={portfolioLink} onChange={(e) => setPortfolioLink(e.target.value)} disabled={isFormDisabled}/>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3">
              <div className="space-y-1">
                <Label htmlFor="password" className="text-foreground">Create Password</Label>
                <Input id="password" type="password" placeholder="Create a secure password" required className="text-foreground" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isFormDisabled}/>
              </div>
               <div className="space-y-1">
                <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
                <Input id="confirmPassword" type="password" placeholder="Re-enter your password" required className="text-foreground" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isFormDisabled}/>
              </div>
            </div>

            <Alert variant="default" className="mt-4 bg-primary/5 border-primary/20 text-xs">
                <ShieldCheck className="h-4 w-4 text-primary/70" />
                <AlertTitle className="text-primary/90 font-medium">Admin Verification Required</AlertTitle>
                <AlertDescription className="text-muted-foreground">
                    Your registration will be submitted for admin review. You will be notified upon approval.
                </AlertDescription>
            </Alert>

            <Button
                type="submit"
                size="lg"
                className="w-full shadow-md hover:shadow-lg transition-shadow rounded-full text-base py-3 mt-2.5 bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isFormDisabled}
            >
              {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin"/> : <CheckCircle className="mr-2 h-5 w-5"/>}
              {isSubmitting ? 'Submitting...' : 'Submit Registration'}
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
