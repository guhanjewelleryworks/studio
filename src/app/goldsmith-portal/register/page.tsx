
// src/app/goldsmith-portal/register/page.tsx
'use client';

import type { Goldsmith } from '@/types/goldsmith';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle, Briefcase, Loader2, ShieldCheck, MailCheck, PhoneCall } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent, useEffect } from 'react';
import { saveGoldsmith } from '@/actions/goldsmith-actions'; // Server Action
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Simulated OTP actions (in a real app, these would be server actions calling external services)
async function sendOtp(type: 'email' | 'phone', value: string): Promise<{ success: boolean, message: string }> {
  console.log(`Simulating OTP sent to ${type}: ${value}`);
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  // In a real app, you would generate an OTP, store it with an expiry, and send it.
  return { success: true, message: `OTP sent to ${value}. (Simulated)` };
}

async function verifyOtp(type: 'email' | 'phone', value: string, otp: string): Promise<{ success: boolean, message: string }> {
  console.log(`Simulating OTP verification for ${type}: ${value} with OTP: ${otp}`);
  await new Promise(resolve => setTimeout(resolve, 1000));
  // In a real app, you would compare the user's OTP with the stored one.
  // For simulation, let's assume any 6-digit OTP is valid.
  if (otp && otp.length === 6 && /^\d+$/.test(otp)) {
    return { success: true, message: `${type === 'email' ? 'Email' : 'Phone'} verified successfully. (Simulated)` };
  }
  return { success: false, message: `Invalid OTP for ${type}. Please try again. (Simulated)` };
}


export default function GoldsmithRegisterPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [workshopName, setWorkshopName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [specialties, setSpecialties] = useState(''); // Single string for input
  const [portfolioLink, setPortfolioLink] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // OTP State
  const [emailOtp, setEmailOtp] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [isEmailOtpSending, setIsEmailOtpSending] = useState(false);
  const [isPhoneOtpSending, setIsPhoneOtpSending] = useState(false);
  const [isEmailVerifying, setIsEmailVerifying] = useState(false);
  const [isPhoneVerifying, setIsPhoneVerifying] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [canSendEmailOtp, setCanSendEmailOtp] = useState(false);
  const [canSendPhoneOtp, setCanSendPhoneOtp] = useState(false);

  useEffect(() => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setCanSendEmailOtp(emailRegex.test(email));
  }, [email]);

  useEffect(() => {
    // Basic phone validation (e.g., 10 digits)
    const phoneRegex = /^\d{10}$/;
    setCanSendPhoneOtp(phoneRegex.test(phone.replace(/\D/g, '')));
  }, [phone]);


  const handleSendEmailOtp = async () => {
    if (!canSendEmailOtp) {
        toast({ title: "Invalid Email", description: "Please enter a valid email address.", variant: "destructive" });
        return;
    }
    setIsEmailOtpSending(true);
    const result = await sendOtp('email', email);
    toast({ title: result.success ? "Email OTP Sent" : "Error", description: result.message, variant: result.success ? "default" : "destructive" });
    setIsEmailOtpSending(false);
  };

  const handleVerifyEmailOtp = async () => {
    if (!emailOtp) {
        toast({ title: "Missing OTP", description: "Please enter the OTP sent to your email.", variant: "destructive" });
        return;
    }
    setIsEmailVerifying(true);
    const result = await verifyOtp('email', email, emailOtp);
    if (result.success) {
      setIsEmailVerified(true);
      toast({ title: "Email Verified", description: result.message });
    } else {
      toast({ title: "Email Verification Failed", description: result.message, variant: "destructive" });
    }
    setIsEmailVerifying(false);
  };

  const handleSendPhoneOtp = async () => {
    if (!canSendPhoneOtp) {
        toast({ title: "Invalid Phone Number", description: "Please enter a valid 10-digit phone number.", variant: "destructive" });
        return;
    }
    setIsPhoneOtpSending(true);
    const result = await sendOtp('phone', phone);
    toast({ title: result.success ? "Phone OTP Sent" : "Error", description: result.message, variant: result.success ? "default" : "destructive" });
    setIsPhoneOtpSending(false);
  };

  const handleVerifyPhoneOtp = async () => {
     if (!phoneOtp) {
        toast({ title: "Missing OTP", description: "Please enter the OTP sent to your phone.", variant: "destructive" });
        return;
    }
    setIsPhoneVerifying(true);
    const result = await verifyOtp('phone', phone, phoneOtp);
    if (result.success) {
      setIsPhoneVerified(true);
      toast({ title: "Phone Verified", description: result.message });
    } else {
      toast({ title: "Phone Verification Failed", description: result.message, variant: "destructive" });
    }
    setIsPhoneVerifying(false);
  };


  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    if (!isEmailVerified) {
      toast({ title: 'Email Not Verified', description: 'Please verify your email address using OTP.', variant: 'destructive' });
      setIsSubmitting(false);
      return;
    }
    if (!isPhoneVerified) {
      toast({ title: 'Phone Not Verified', description: 'Please verify your phone number using OTP.', variant: 'destructive' });
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({ title: 'Registration Error', description: 'Passwords do not match.', variant: 'destructive' });
      setIsSubmitting(false);
      return;
    }

    const newGoldsmithData: Omit<Goldsmith, '_id' | 'id' | 'rating' | 'imageUrl' | 'profileImageUrl' | 'location' | 'shortBio' | 'tagline' | 'bio' | 'yearsExperience' | 'responseTime' | 'ordersCompleted'> & {password: string} = {
      name: workshopName,
      contactPerson,
      email,
      phone,
      address,
      specialty: specialties.split(',').map(s => s.trim()).filter(s => s),
      portfolioLink,
      password,
    };

    try {
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
        throw new Error(result.error || 'Failed to save goldsmith data.');
      }
    } catch (error) {
      console.error("Registration failed:", error);
      toast({
        title: 'Registration Failed',
        description: (error instanceof Error ? error.message : 'An unexpected error occurred.'),
        variant: 'destructive',
      });
    } finally {
        setIsSubmitting(false);
    }
  };

  const isFormDisabled = isLoading || isSubmitting || isEmailOtpSending || isPhoneOtpSending || isEmailVerifying || isPhoneVerifying;

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

            {/* Email with OTP */}
            <div className="space-y-1">
                <Label htmlFor="email" className="text-foreground">Business Email Address</Label>
                <div className="flex gap-2 items-start">
                    <Input id="email" type="email" placeholder="contact@auragold.com" required className="text-foreground flex-grow" value={email} onChange={(e) => {setEmail(e.target.value); setIsEmailVerified(false); setEmailOtp('');}} disabled={isFormDisabled || isEmailVerified}/>
                    <Button type="button" variant="outline" size="sm" onClick={handleSendEmailOtp} disabled={isFormDisabled || !canSendEmailOtp || isEmailVerified || isEmailOtpSending} className="h-10 border-primary text-primary hover:bg-primary/10">
                        {isEmailOtpSending ? <Loader2 className="h-4 w-4 animate-spin"/> : isEmailVerified ? <MailCheck className="h-4 w-4"/> : "Send OTP"}
                    </Button>
                </div>
                { !isEmailVerified && (
                    <div className="flex gap-2 items-start mt-1.5">
                        <Input id="emailOtp" type="text" placeholder="Enter Email OTP" className="text-foreground flex-grow" value={emailOtp} onChange={(e) => setEmailOtp(e.target.value)} disabled={isFormDisabled || isEmailVerified} maxLength={6}/>
                        <Button type="button" variant="default" size="sm" onClick={handleVerifyEmailOtp} disabled={isFormDisabled || isEmailVerified || !emailOtp || isEmailVerifying} className="h-10 bg-primary text-primary-foreground hover:bg-primary/90">
                             {isEmailVerifying ? <Loader2 className="h-4 w-4 animate-spin"/> : "Verify Email"}
                        </Button>
                    </div>
                )}
                {isEmailVerified && <p className="text-xs text-green-600 dark:text-green-400 mt-1">Email successfully verified!</p>}
            </div>

            {/* Phone with OTP */}
             <div className="space-y-1">
                <Label htmlFor="phone" className="text-foreground">Business Phone Number</Label>
                <div className="flex gap-2 items-start">
                    <Input id="phone" type="tel" placeholder="e.g., 9876543210" required className="text-foreground flex-grow" value={phone} onChange={(e) => {setPhone(e.target.value); setIsPhoneVerified(false); setPhoneOtp('');}} disabled={isFormDisabled || isPhoneVerified}/>
                    <Button type="button" variant="outline" size="sm" onClick={handleSendPhoneOtp} disabled={isFormDisabled || !canSendPhoneOtp || isPhoneVerified || isPhoneOtpSending} className="h-10 border-primary text-primary hover:bg-primary/10">
                         {isPhoneOtpSending ? <Loader2 className="h-4 w-4 animate-spin"/> : isPhoneVerified ? <PhoneCall className="h-4 w-4"/> : "Send OTP"}
                    </Button>
                </div>
                 { !isPhoneVerified && (
                    <div className="flex gap-2 items-start mt-1.5">
                        <Input id="phoneOtp" type="text" placeholder="Enter Phone OTP" className="text-foreground flex-grow" value={phoneOtp} onChange={(e) => setPhoneOtp(e.target.value)} disabled={isFormDisabled || isPhoneVerified} maxLength={6}/>
                        <Button type="button" variant="default" size="sm" onClick={handleVerifyPhoneOtp} disabled={isFormDisabled || isPhoneVerified || !phoneOtp || isPhoneVerifying} className="h-10 bg-primary text-primary-foreground hover:bg-primary/90">
                            {isPhoneVerifying ? <Loader2 className="h-4 w-4 animate-spin"/> : "Verify Phone"}
                        </Button>
                    </div>
                )}
                {isPhoneVerified && <p className="text-xs text-green-600 dark:text-green-400 mt-1">Phone successfully verified!</p>}
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
                <Input id="password" type="password" required className="text-foreground" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isFormDisabled}/>
              </div>
               <div className="space-y-1">
                <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
                <Input id="confirmPassword" type="password" required className="text-foreground" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isFormDisabled}/>
              </div>
            </div>

            <Alert variant="default" className="mt-4 bg-primary/5 border-primary/20 text-xs">
                <ShieldCheck className="h-4 w-4 text-primary/70" />
                <AlertTitle className="text-primary/90 font-medium">Verification Required</AlertTitle>
                <AlertDescription className="text-muted-foreground">
                    Please verify both your email and phone number using OTPs before submitting your registration.
                </AlertDescription>
            </Alert>

            <Button 
                type="submit" 
                size="lg" 
                className="w-full shadow-md hover:shadow-lg transition-shadow rounded-full text-base py-3 mt-2.5 bg-primary hover:bg-primary/90 text-primary-foreground" 
                disabled={isFormDisabled || !isEmailVerified || !isPhoneVerified || isSubmitting}
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


    