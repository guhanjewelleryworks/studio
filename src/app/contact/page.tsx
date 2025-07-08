// src/app/contact/page.tsx
'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { saveContactSubmission } from '@/actions/contact-actions';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string()
    .length(10, { message: "Phone number must be exactly 10 digits." })
    .regex(/^[0-9]+$/, { message: "Phone number must contain only digits." }),
  subject: z.string().min(3, { message: "Subject must be at least 3 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit: SubmitHandler<ContactFormValues> = async (data) => {
    const result = await saveContactSubmission(data);
    if (result.success) {
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We will get back to you shortly.",
      });
      reset();
    } else {
      toast({
        title: "Error Sending Message",
        description: result.error || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] py-10 bg-gradient-to-br from-background via-secondary/10 to-background">
      <Card className="w-full max-w-lg shadow-xl border-primary/20 rounded-xl bg-card">
        <CardHeader className="text-center pt-6 pb-3">
          <Mail className="h-10 w-10 mx-auto text-primary mb-2.5" />
          <CardTitle className="text-3xl text-accent">Get in Touch</CardTitle>
          <CardDescription className="text-muted-foreground mt-1 text-sm">Have questions, feedback, or inquiries? We'd love to hear from you!</CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-3">
          <form className="space-y-3.5" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-1">
              <Label htmlFor="name" className="text-xs font-medium text-foreground">Your Name</Label>
              <Input id="name" placeholder="e.g., Jane Doe" {...register('name')} className="text-sm py-2 text-foreground" />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="email" className="text-xs font-medium text-foreground">Your Email Address</Label>
              <Input id="email" type="email" placeholder="jane.doe@example.com" {...register('email')} className="text-sm py-2 text-foreground" />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="phone" className="text-xs font-medium text-foreground">Your Phone Number</Label>
              <Input id="phone" type="tel" placeholder="10-digit mobile number" {...register('phone')} className="text-sm py-2 text-foreground" maxLength={10} />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="subject" className="text-xs font-medium text-foreground">Subject</Label>
              <Input id="subject" placeholder="e.g., Inquiry about a custom design" {...register('subject')} className="text-sm py-2 text-foreground" />
              {errors.subject && <p className="text-xs text-destructive">{errors.subject.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="message" className="text-xs font-medium text-foreground">Message</Label>
              <Textarea id="message" placeholder="Please type your message here..." {...register('message')} rows={3} className="text-sm py-2 text-foreground" />
              {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
            </div>

            <Button type="submit" size="lg" className="w-full shadow-md hover:shadow-lg transition-shadow rounded-full text-base py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground mt-2.5" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
