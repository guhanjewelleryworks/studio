// src/app/admin/reports/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, ArrowLeft, Download, FileText } from 'lucide-react';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from '@/components/ui/label';

const reportTypes = [
    { value: "user_activity", label: "User Activity Report" },
    { value: "sales_summary", label: "Sales Summary Report" },
    { value: "goldsmith_performance", label: "Goldsmith Performance Report" },
    { value: "platform_traffic", label: "Platform Traffic Analysis" },
];

export default function AdminReportsPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-secondary/5 to-background py-6 px-4 md:px-6">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-heading text-accent">Generate Reports</h1>
        </div>
        <Button asChild variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground">
          <Link href="/admin/dashboard">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </header>

      <Card className="shadow-lg bg-card border-primary/10 rounded-xl">
        <CardHeader>
          <CardTitle className="text-xl text-accent font-heading">Reporting Tools</CardTitle>
          <CardDescription className="text-muted-foreground">
            This is a placeholder page for generating various platform reports.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="report-type" className="text-foreground">Select Report Type</Label>
            <Select>
                <SelectTrigger id="report-type" className="w-full md:w-[300px] text-foreground">
                    <SelectValue placeholder="Choose a report..." />
                </SelectTrigger>
                <SelectContent>
                    {reportTypes.map(report => (
                        <SelectItem key={report.value} value={report.value}>{report.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>

          {/* Placeholder for date range pickers or other filters */}
          <div className="space-y-2">
            <Label className="text-foreground">Date Range (Placeholder)</Label>
            <div className="flex gap-2">
                <Input type="date" className="text-foreground" />
                <Input type="date" className="text-foreground" />
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <FileText className="mr-2 h-4 w-4" /> Generate Report
            </Button>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground">
                <Download className="mr-2 h-4 w-4" /> Download as CSV (Simulated)
            </Button>
          </div>

           <div className="mt-6 pt-4 border-t border-border/30">
                <h3 className="text-lg font-semibold text-foreground mb-2">Simulated Report Output:</h3>
                <Card className="bg-muted/30 p-4">
                    <p className="text-sm text-muted-foreground">
                        Report data would be displayed here. For example, a table or chart summarizing the selected report criteria.
                    </p>
                </Card>
           </div>

        </CardContent>
      </Card>
    </div>
  );
}
