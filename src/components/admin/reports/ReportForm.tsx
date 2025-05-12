'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

const reportTypes = [
    { value: "user_activity", label: "User Activity Report" },
    { value: "sales_summary", label: "Sales Summary Report" },
    { value: "goldsmith_performance", label: "Goldsmith Performance Report" },
    { value: "platform_traffic", label: "Platform Traffic Analysis" },
];

// Dynamically import components that might cause issues with static export
const DynamicSelect = dynamic(() => import('@/components/ui/select').then(mod => mod.Select), { 
    ssr: false,
    loading: () => <Skeleton className="h-10 w-full md:w-[300px]" />
});
const DynamicSelectTrigger = dynamic(() => import('@/components/ui/select').then(mod => mod.SelectTrigger), { ssr: false });
const DynamicSelectValue = dynamic(() => import('@/components/ui/select').then(mod => mod.SelectValue), { ssr: false });
const DynamicSelectContent = dynamic(() => import('@/components/ui/select').then(mod => mod.SelectContent), { ssr: false });
const DynamicSelectItem = dynamic(() => import('@/components/ui/select').then(mod => mod.SelectItem), { ssr: false });

const DynamicInput = dynamic(() => import('@/components/ui/input').then(mod => mod.Input), { 
    ssr: false,
    loading: () => <Skeleton className="h-10 w-full" />
});


export function ReportForm() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="report-type" className="text-foreground">Select Report Type</Label>
        <DynamicSelect>
            <DynamicSelectTrigger id="report-type" className="w-full md:w-[300px] text-foreground">
                <DynamicSelectValue placeholder="Choose a report..." />
            </DynamicSelectTrigger>
            <DynamicSelectContent>
                {reportTypes.map(report => (
                    <DynamicSelectItem key={report.value} value={report.value}>{report.label}</DynamicSelectItem>
                ))}
            </DynamicSelectContent>
        </DynamicSelect>
      </div>

      <div className="space-y-2">
        <Label className="text-foreground">Date Range (Placeholder)</Label>
        <div className="flex gap-2">
            <DynamicInput type="date" className="text-foreground" />
            <DynamicInput type="date" className="text-foreground" />
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
    </div>
  );
}
