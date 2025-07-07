'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Download, FileText, Loader2, AlertTriangle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import type { ReportData } from '@/actions/report-actions';
import { generateReport } from '@/actions/report-actions';
import { useToast } from '@/hooks/use-toast';

const reportTypes = [
    { value: "user_activity", label: "User Activity Report" },
    { value: "goldsmith_performance", label: "Goldsmith Performance Report" },
    { value: "sales_summary", label: "Sales Summary Report (Coming Soon)" },
    { value: "platform_traffic", label: "Platform Traffic Analysis (Coming Soon)" },
];

const DynamicSelect = dynamic(() => import('@/components/ui/select').then(mod => mod.Select), {
    ssr: false,
    loading: () => <Skeleton className="h-10 w-full md:w-[300px]" />
});
const DynamicSelectTrigger = dynamic(() => import('@/components/ui/select').then(mod => mod.SelectTrigger), { ssr: false });
const DynamicSelectValue = dynamic(() => import('@/components/ui/select').then(mod => mod.SelectValue), { ssr: false });
const DynamicSelectContent = dynamic(() => import('@/components/ui/select').then(mod => mod.SelectContent), { ssr: false });
const DynamicSelectItem = dynamic(() => import('@/components/ui/select').then(mod => mod.SelectItem), { ssr: false });

export function ReportForm() {
  const { toast } = useToast();
  const [selectedReport, setSelectedReport] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateReport = async () => {
    if (!selectedReport) {
        toast({ title: 'No Report Selected', description: 'Please choose a report type to generate.', variant: 'destructive' });
        return;
    }
    setIsLoading(true);
    setError(null);
    setReportData(null);
    
    const result = await generateReport(selectedReport);

    if (result.success && result.data) {
        setReportData(result.data);
    } else {
        setError(result.error || 'An unknown error occurred.');
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="space-y-2 flex-grow">
          <Label htmlFor="report-type" className="text-foreground">Select Report Type</Label>
          <DynamicSelect onValueChange={setSelectedReport} value={selectedReport}>
              <DynamicSelectTrigger id="report-type" className="w-full text-foreground">
                  <DynamicSelectValue placeholder="Choose a report..." />
              </DynamicSelectTrigger>
              <DynamicSelectContent>
                  {reportTypes.map(report => (
                      <DynamicSelectItem key={report.value} value={report.value}>{report.label}</DynamicSelectItem>
                  ))}
              </DynamicSelectContent>
          </DynamicSelect>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button onClick={handleGenerateReport} disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
              {isLoading ? 'Generating...' : 'Generate Report'}
          </Button>
          <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground">
              <Download className="mr-2 h-4 w-4" /> CSV (Simulated)
          </Button>
        </div>
      </div>

       <div className="mt-6 pt-4 border-t border-border/30">
            <h3 className="text-lg font-semibold text-foreground mb-2">Report Output:</h3>
            {isLoading && (
              <div className="space-y-2">
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-32 w-full" />
              </div>
            )}
            {error && (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error Generating Report</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            {reportData && (
                <Card className="bg-muted/30">
                  <CardHeader>
                    <CardTitle className="text-accent">{reportData.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {reportData.headers.map(header => <TableHead key={header}>{header}</TableHead>)}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reportData.rows.map((row, rowIndex) => (
                           <TableRow key={rowIndex}>
                            {row.map((cell, cellIndex) => <TableCell key={cellIndex}>{cell}</TableCell>)}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
            )}
            {!isLoading && !reportData && !error && (
                 <Card className="bg-muted/30 p-4">
                    <p className="text-sm text-muted-foreground text-center py-8">
                        Select a report type and click &quot;Generate Report&quot; to see data here.
                    </p>
                </Card>
            )}
       </div>
    </div>
  );
}
