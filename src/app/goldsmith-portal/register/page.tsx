
// src/app/goldsmith-portal/register/page.tsx
'use client';

import type { NewGoldsmithInput } from '@/types/goldsmith';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, Briefcase, Loader2, ShieldCheck, MailCheck, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent, type ChangeEvent } from 'react';
import { saveGoldsmith } from '@/actions/goldsmith-actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const indianStates: { [key: string]: string[] } = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur"],
  "Karnataka": ["Bengaluru", "Mysuru", "Hubballi-Dharwad"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad"],
};
const stateNames = Object.keys(indianStates).sort();

export default function GoldsmithRegisterPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState(false);

  // Form state
  const [workshopName, setWorkshopName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [specialties, setSpecialties] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [yearsExperience, setYearsExperience] = useState<number | undefined>(undefined);
  const [responseTime, setResponseTime] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const handlePhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue.length <= 10) {
      setPhone(numericValue);
    }
  };
  
  const handleStateChange = (value: string) => {
    setSelectedState(value);
    setSelectedDistrict(''); // Reset district when state changes
  };


  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    const trimmedWorkshopName = workshopName.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();
    const trimmedContactPerson = contactPerson.trim();
    const trimmedPhone = phone.trim();
    const trimmedSpecialtiesArray = specialties.split(',').map(s => s.trim()).filter(s => s);
    const trimmedPortfolioLink = portfolioLink.trim();
    const trimmedResponseTime = responseTime.trim();

    // Client-side validation
    if (!trimmedWorkshopName || !trimmedEmail || !trimmedPassword || !selectedState || !selectedDistrict || !trimmedContactPerson || !trimmedPhone || trimmedSpecialtiesArray.length === 0) {
      toast({
        title: 'Registration Error',
        description: 'Please fill out all required fields: Workshop Name, Contact Person, Email, Phone, Location, and Specialties.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }
    
    if (trimmedPhone.length !== 10) {
      toast({
        title: 'Registration Error',
        description: 'Phone number must be exactly 10 digits.',
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

     if (trimmedPassword.length < 8) {
      toast({
        title: 'Registration Error',
        description: 'Password must be at least 8 characters long.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const newGoldsmithData: NewGoldsmithInput = {
        name: trimmedWorkshopName,
        contactPerson: trimmedContactPerson,
        email: trimmedEmail,
        phone: trimmedPhone,
        state: selectedState,
        district: selectedDistrict,
        specialty: trimmedSpecialtiesArray,
        portfolioLink: trimmedPortfolioLink,
        password: trimmedPassword,
        yearsExperience: yearsExperience || 0,
        responseTime: trimmedResponseTime || "Varies",
      };

      const result = await saveGoldsmith(newGoldsmithData);

      if (result.success && result.data) {
        toast({
          title: 'Registration Submitted!',
          description: "Please check your email to verify your account.",
          duration: 7000, 
        });
        
        setIsSubmittedSuccessfully(true);
      } else {
        console.error("Failed to save goldsmith profile to MongoDB:", result.error);
        toast({
          title: 'Registration Failed',
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

  if (isSubmittedSuccessfully) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] py-10 bg-gradient-to-br from-secondary/20 to-background">
        <Card className="w-full max-w-lg text-center shadow-xl border-green-500/20 rounded-xl bg-card">
          <CardHeader className="pt-8 pb-4">
            <MailCheck className="h-16 w-16 mx-auto text-green-500 mb-4" />
            <CardTitle className="text-3xl text-accent">Registration Submitted!</CardTitle>
            <CardDescription className="text-muted-foreground mt-2 text-base">
              Please check your email to verify your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-8">
            <p className="text-foreground/80 mb-6">
              A verification link has been sent to your email address. Please click it to confirm your account. After verification, your profile will be reviewed by our administrators.
            </p>
            <Button asChild size="lg" className="w-full shadow-md rounded-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/">
                Return to Homepage
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] py-10 bg-gradient-to-br from-secondary/20 to-background">
      <Card className="w-full max-w-2xl shadow-xl border-primary/15 rounded-xl bg-card">
        <CardHeader className="text-center pt-6 pb-4">
          <Briefcase className="h-12 w-12 mx-auto text-primary mb-3" />
          <CardTitle className="text-3xl font-heading text-accent">Register Your Goldsmith Workshop</CardTitle>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3">
              <div className="space-y-1">
                  <Label htmlFor="email" className="text-foreground">Business Email Address</Label>
                  <Input id="email" type="email" placeholder="contact@auragold.com" required className="text-foreground" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isFormDisabled}/>
              </div>
              <div className="space-y-1">
                  <Label htmlFor="phone" className="text-foreground">Business Phone Number (10 digits)</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="e.g., 9876543210"
                    required 
                    className="text-foreground" 
                    value={phone} 
                    onChange={handlePhoneChange} 
                    maxLength={10} 
                    pattern="[0-9]{10}" 
                    title="Please enter a 10-digit phone number"
                    disabled={isFormDisabled}
                  />
              </div>
            </div>
            
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3">
                <div className="space-y-1">
                  <Label htmlFor="state" className="text-foreground">State</Label>
                  <Select onValueChange={handleStateChange} value={selectedState} required disabled={isFormDisabled}>
                    <SelectTrigger id="state" className="text-foreground">
                      <SelectValue placeholder="Select your state" />
                    </SelectTrigger>
                    <SelectContent>
                      {stateNames.map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="district" className="text-foreground">District / City</Label>
                  <Select onValueChange={setSelectedDistrict} value={selectedDistrict} required disabled={isFormDisabled || !selectedState}>
                    <SelectTrigger id="district" className="text-foreground">
                      <SelectValue placeholder="Select your district/city" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedState && indianStates[selectedState].map(district => (
                        <SelectItem key={district} value={district}>{district}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>


             <div className="space-y-1">
              <Label htmlFor="specialties" className="text-foreground">Specialties & Techniques</Label>
              <Input id="specialties" placeholder="e.g., Custom Engagement Rings, Hand Engraving" required className="text-foreground" value={specialties} onChange={(e) => setSpecialties(e.target.value)} disabled={isFormDisabled}/>
               <p className="text-xs text-muted-foreground pt-0.5">Separate multiple specialties with commas.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3">
              <div className="space-y-1">
                <Label htmlFor="yearsExperience" className="text-foreground">Years of Experience</Label>
                <Input id="yearsExperience" type="number" placeholder="e.g., 10" className="text-foreground" value={yearsExperience === undefined ? '' : yearsExperience} onChange={(e) => setYearsExperience(e.target.value === '' ? undefined : parseInt(e.target.value, 10))} disabled={isFormDisabled}/>
              </div>
              <div className="space-y-1">
                <Label htmlFor="responseTime" className="text-foreground">Typical Response Time</Label>
                <Input id="responseTime" placeholder="e.g., Within 24 hours" className="text-foreground" value={responseTime} onChange={(e) => setResponseTime(e.target.value)} disabled={isFormDisabled}/>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="portfolioLink" className="text-foreground">Portfolio Link (Optional)</Label>
              <Input id="portfolioLink" type="url" placeholder="https://yourportfolio.com" className="text-foreground" value={portfolioLink} onChange={(e) => setPortfolioLink(e.target.value)} disabled={isFormDisabled}/>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3">
              <div className="space-y-1 relative">
                <Label htmlFor="password" className="text-foreground">Create Password (min. 8 characters)</Label>
                <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Min. 8 characters" required className="text-foreground pr-10" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isFormDisabled}/>
                <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-6 h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
               <div className="space-y-1 relative">
                <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
                <Input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="Re-enter your password" required className="text-foreground pr-10" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isFormDisabled}/>
                <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-6 h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => setShowConfirmPassword(!showConfirmPassword)} tabIndex={-1}>
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Alert variant="default" className="mt-4 bg-primary/5 border-primary/20 text-xs">
                <ShieldCheck className="h-4 w-4 text-primary/70" />
                <AlertTitle className="text-primary/90 font-medium">Email &amp; Admin Verification Required</AlertTitle>
                <AlertDescription className="text-muted-foreground">
                    You will receive an email to verify your address. Once verified, your registration will be submitted for admin review.
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
