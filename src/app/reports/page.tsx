"use client";

import * as React from "react";
import { useCoaches } from "@/hooks/use-coaches";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart2, Calendar, FileText } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, getYear } from 'date-fns';

const months = Array.from({ length: 12 }, (_, i) => ({
  value: i,
  label: format(new Date(0, i), 'MMMM'),
}));

const generateYearOptions = (coaches: any[]) => {
  if (!coaches || coaches.length === 0) {
    return [getYear(new Date())];
  }
  const years = new Set(coaches.map(c => getYear(c.offeredDate)));
  const currentYear = getYear(new Date());
  if (!years.has(currentYear)) {
    years.add(currentYear);
  }
  return Array.from(years).sort((a, b) => b - a);
};


export default function ReportsPage() {
  const { coaches, isLoading } = useCoaches();
  const [selectedMonth, setSelectedMonth] = React.useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = React.useState<number>(new Date().getFullYear());
  
  const yearOptions = React.useMemo(() => generateYearOptions(coaches), [coaches]);

  React.useEffect(() => {
    if (yearOptions.length > 0 && !yearOptions.includes(selectedYear)) {
        setSelectedYear(yearOptions[0]);
    }
  }, [yearOptions, selectedYear]);

  const monthlyReport = React.useMemo(() => {
    if (isLoading) return [];
    
    const workTypeCounts = new Map<string, number>();

    coaches
      .filter(coach => 
        getYear(coach.offeredDate) === selectedYear &&
        coach.offeredDate.getMonth() === selectedMonth
      )
      .forEach(coach => {
        coach.workTypes.forEach(workType => {
          workTypeCounts.set(workType, (workTypeCounts.get(workType) || 0) + 1);
        });
      });

    return Array.from(workTypeCounts.entries())
      .map(([workType, count]) => ({ workType, count }))
      .sort((a, b) => b.count - a.count);

  }, [coaches, selectedMonth, selectedYear, isLoading]);

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 animate-fade-in-down gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-primary font-headline flex items-center gap-3">
            <BarChart2 className="h-10 w-10" />
            Monthly Work Report
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            A summary of work types performed each month.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select
            value={String(selectedMonth)}
            onValueChange={(value) => setSelectedMonth(Number(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {months.map(month => (
                <SelectItem key={month.value} value={String(month.value)}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={String(selectedYear)}
            onValueChange={(value) => setSelectedYear(Number(value))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
               {yearOptions.map(year => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Report for {format(new Date(selectedYear, selectedMonth), 'MMMM yyyy')}
          </CardTitle>
          <CardDescription>
            Total counts for each work type initiated in the selected month.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : monthlyReport.length > 0 ? (
            <ul className="space-y-3">
              {monthlyReport.map((item, index) => (
                <li
                  key={item.workType}
                  className="flex justify-between items-center p-4 rounded-lg bg-muted/50 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="font-medium text-lg">{item.workType}</span>
                  <div className="flex items-center gap-2 text-primary font-bold text-2xl">
                    <span>{item.count}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-16">
              <FileText className="h-16 w-16 mb-4" />
              <h3 className="text-xl font-semibold">No Data Available</h3>
              <p>No work was recorded for the selected period.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
