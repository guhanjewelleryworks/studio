// src/app/goldsmith-portal/messages/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

// Mock data for messages
const mockMessages = [
  { id: 1, sender: 'Customer A', subject: 'Inquiry about custom ring', date: '2024-07-29', unread: true, snippet: 'Hello, I was wondering if you could create a custom engagement ring with a sapphire...' },
  { id: 2, sender: 'Goldsmith Connect Admin', subject: 'New Order Lead #LEAD5678', date: '2024-07-28', unread: false, snippet: 'A new customer is interested in a custom pendant. Please review the details...' },
  { id: 3, sender: 'Customer B', subject: 'Question about repair', date: '2024-07-27', unread: true, snippet: 'I have an antique brooch that needs repair. Can you help?' },
];


export default function GoldsmithMessagesPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-br from-background via-secondary/10 to-background py-8 px-4 md:px-6">
      <Card className="max-w-3xl mx-auto shadow-xl bg-card border-primary/10">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl text-accent">Communication Hub</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Respond to customer inquiries and manage conversations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mockMessages.length > 0 ? (
            <ul className="space-y-3">
              {mockMessages.map(message => (
                <li key={message.id} className={`p-3 rounded-md border ${message.unread ? 'bg-primary/5 border-primary/30' : 'bg-card/60 border-border/40'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className={`font-semibold ${message.unread ? 'text-primary' : 'text-foreground'}`}>{message.sender}</p>
                      <p className={`text-sm ${message.unread ? 'text-foreground' : 'text-muted-foreground'}`}>{message.subject}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{message.date}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 truncate">{message.snippet}</p>
                </li>
              ))}
            </ul>
          ) : (
             <p className="text-foreground text-center py-4">No messages to display.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
