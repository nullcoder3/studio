
"use client";

import { useState } from 'react';
import { useHolidays } from '@/hooks/use-holidays';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Trash2, CalendarPlus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';

const Calendar = dynamic(() => import('@/components/ui/calendar').then(mod => mod.Calendar), {
  ssr: false,
  loading: () => <Skeleton className="h-[298px] w-full max-w-[350px] rounded-md border" />
});

export default function SettingsPage() {
  const { holidays, addHoliday, removeHoliday, isLoading } = useHolidays();
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleAddHoliday = () => {
    if (date) {
      addHoliday(date);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tighter text-foreground sm:text-5xl">Settings</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Configure working day rules and manage holidays.
        </p>
      </div>

      <Card className="shadow-soft-lg">
        <CardHeader>
          <CardTitle>Manage Holidays</CardTitle>
          <CardDescription>
            Add or remove holidays to be excluded from working day calculations. Sundays are excluded by default.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
          <div className="flex flex-col items-center">
            <h3 className="font-semibold mb-4 text-lg text-center self-start">Add New Holiday</h3>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-lg border shadow-sm"
            />
            <Button onClick={handleAddHoliday} className="mt-4 w-full max-w-[350px]" size="lg" disabled={!date}>
              <CalendarPlus className="mr-2 h-4 w-4" />
              Add Holiday
            </Button>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-lg">Current Holiday List</h3>
            <ScrollArea className="h-80 w-full rounded-lg border bg-background/50">
              <div className="p-2 sm:p-4">
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : holidays.length > 0 ? (
                  <ul className="space-y-2">
                    {holidays.map((holiday) => (
                      <li key={holiday.toISOString()} className="flex justify-between items-center p-2.5 rounded-md bg-muted/50 transition-colors hover:bg-muted">
                        <span className="font-medium">{format(holiday, 'PPP')}</span>
                        <Button variant="ghost" size="icon" onClick={() => removeHoliday(holiday)} className="text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove holiday</span>
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground text-center pt-10">No holidays added yet.</p>
                )}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
