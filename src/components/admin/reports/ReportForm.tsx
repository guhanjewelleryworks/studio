'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Download, FileText, Loader2, AlertTriangle, ShieldAlert, CalendarIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import type { ReportData, ReportDateRange } from '@/actions/report-actions';
import { generateReport } from '@/actions/report-actions';
import { useToast } from '@/hooks/use-toast';
import { useAdminAccess } from '@/hooks/useAdminAccess';
import Link from 'next/link';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { addDays, format } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';


const reportTypes = [
    { value: "user_activity", label: "User Activity Report", dateSensitive: true },
    { value: "goldsmith_performance", label: "Goldsmith Performance Report", dateSensitive: true },
    { value: "sales_summary", label: "Sales Summary Report", dateSensitive: true },
    { value: "goldsmith_payout", label: "Goldsmith Payout Report", dateSensitive: true },
    { value: "platform_traffic", label: "Platform Traffic Analysis (Coming Soon)", dateSensitive: false },
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
  const { hasPermission, isAccessLoading } = useAdminAccess('canGenerateReports');
  const { toast } = useToast();
  const [selectedReport, setSelectedReport] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  const isReportDateSensitive = reportTypes.find(r => r.value === selectedReport)?.dateSensitive ?? false;

  const handleGenerateReport = async () => {
    if (!selectedReport) {
        toast({ title: 'No Report Selected', description: 'Please choose a report type to generate.', variant: 'destructive' });
        return;
    }
    setIsLoading(true);
    setError(null);
    setReportData(null);
    
    const dateRange: ReportDateRange | undefined = isReportDateSensitive && date?.from && date?.to
      ? { from: date.from, to: date.to }
      : undefined;

    const result = await generateReport(selectedReport, dateRange);

    if (result.success && result.data) {
        setReportData(result.data);
    } else {
        setError(result.error || 'An unknown error occurred.');
    }
    setIsLoading(false);
  };
  
  const handleDownloadCsv = () => {
    if (!reportData) {
      toast({
        title: "No Data Available",
        description: "Please generate a report before attempting to download.",
        variant: "destructive",
      });
      return;
    }

    const { headers, rows, title } = reportData;

    // Create CSV content
    const csvHeader = headers.map(h => `"${h}"`).join(',');
    const csvRows = rows.map(row => 
        row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    const csvContent = `${csvHeader}\n${csvRows}`;

    // Create a Blob and trigger the download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);

    // Create a dynamic, safe filename
    const safeTitle = title.toLowerCase().replace(/[^a-z0-9_]+/g, '_');
    const fileName = `${safeTitle}_${new Date().toISOString().split('T')[0]}.csv`;
    link.setAttribute("download", fileName);
    
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
        title: "Download Started",
        description: `${fileName} is being downloaded.`
    })
  };

  if (isAccessLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Verifying access...</p>
      </div>
    );
  }

  if (!hasPermission) {
    return (
      <div className="text-center py-8">
        <Card className="max-w-md mx-auto shadow-lg bg-card border-destructive/20">
          <CardHeader>
            <ShieldAlert className="h-12 w-12 mx-auto text-destructive" />
            <CardTitle className="text-xl text-destructive">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">You do not have the required permissions to generate reports.</p>
            <Button asChild className="mt-4">
              <Link href="/admin/dashboard">Return to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                      <DynamicSelectItem key={report.value} value={report.value} disabled={report.label.includes('(Coming Soon)')}>{report.label}</DynamicSelectItem>
                  ))}
              </DynamicSelectContent>
          </DynamicSelect>
        </div>

        <div className="space-y-2">
            <Label htmlFor="date-range" className="text-foreground">Date Range</Label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-full md:w-[300px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                        disabled={!isReportDateSensitive}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <Button onClick={handleGenerateReport} disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
              {isLoading ? 'Generating...' : 'Generate Report'}
          </Button>
          <Button 
            variant="outline" 
            className="w-full border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground"
            onClick={handleDownloadCsv}
            disabled={!reportData || isLoading}
          >
              <Download className="mr-2 h-4 w-4" /> Download CSV
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
                    {dateRange && isReportDateSensitive && (
                        <CardDescription>
                            For period: {format(dateRange.from, "PPP")} to {format(dateRange.to, "PPP")}
                        </CardDescription>
                    )}
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
                     {reportData.summary && reportData.summary.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-border">
                            <h4 className="font-semibold text-foreground mb-2">Report Summary</h4>
                            <div className="space-y-1 text-sm">
                                {reportData.summary.map(item => (
                                    <div key={item.label} className="flex justify-between">
                                        <span className="text-muted-foreground">{item.label}:</span>
                                        <span className="font-medium text-foreground">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
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
