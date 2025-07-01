
"use client";

import { useState } from 'react';
import type { Coach } from '@/lib/types';
import { useCoaches } from '@/hooks/use-coaches';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { CoachDetails } from '@/components/coach-details';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus, ListChecks, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const { coaches, isLoading, updateCoach, removeCoach, markCoachAsCompleted } = useCoaches();
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [isCompletedSheetOpen, setIsCompletedSheetOpen] = useState(false);

  const activeCoaches = coaches.filter(c => c.status === 'active');
  const completedCoaches = coaches.filter(c => c.status === 'completed').sort((a, b) => (b.completionDate?.getTime() ?? 0) - (a.completionDate?.getTime() ?? 0));

  const handleUpdateCoach = (updatedCoach: Coach) => {
    updateCoach(updatedCoach);
    setSelectedCoach(updatedCoach);
  };
  
  const handleRemoveCoach = (coachId: string) => {
    removeCoach(coachId);
    setSelectedCoach(null);
  };

  const handleMarkCompleted = (coachId: string) => {
    markCoachAsCompleted(coachId);
    setSelectedCoach(null);
  };

  return (
    <>
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 animate-fade-in-down gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl lg:text-6xl text-foreground">Active Coaches</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              A list of all coaches currently in service or under maintenance. Click a coach to view details and manage materials.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {isLoading ? (
            Array.from({ length: 10 }).map((_, index) => (
              <Card key={index} className="h-40 animate-pulse">
                <CardContent className="flex items-center justify-center h-full">
                   <Skeleton className="h-10 w-24" />
                </CardContent>
              </Card>
            ))
          ) : activeCoaches.map((coach, index) => (
            <button
              onClick={() => setSelectedCoach(coach)}
              key={coach.id}
              className="group block animate-fade-in-up text-left"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Card className="h-40 transition-all duration-300 ease-in-out group-hover:shadow-soft-lg group-hover:border-primary group-hover:-translate-y-1">
                <CardContent className="p-0 h-full flex items-center justify-center">
                  <span className="text-4xl font-extrabold tracking-wider text-foreground group-hover:text-primary transition-colors">
                    {coach.coachNumber}
                  </span>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      </div>
      
      {/* Coach Details Sheet */}
      <Sheet open={!!selectedCoach} onOpenChange={(isOpen) => { if (!isOpen) setSelectedCoach(null); }}>
        <SheetContent className="w-full sm:max-w-xl md:max-w-2xl p-0 flex flex-col">
          {selectedCoach && (
            <SheetHeader className="p-6 pb-2 border-b">
              <SheetTitle className="text-3xl font-extrabold tracking-tight text-primary">
                Coach {selectedCoach.coachNumber}
              </SheetTitle>
              <SheetDescription className="text-lg text-muted-foreground pt-1 flex items-center gap-2">
                 {selectedCoach.status === 'completed' ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Completed on {format(selectedCoach.completionDate!, 'PPP')}
                  </>
                ) : (
                  'Detailed information and material usage for the coach.'
                )}
              </SheetDescription>
            </SheetHeader>
          )}
          <ScrollArea className="flex-1">
            <div className="p-6 pt-4">
              {selectedCoach ? (
                <CoachDetails 
                  coach={selectedCoach} 
                  onUpdate={handleUpdateCoach} 
                  onRemove={handleRemoveCoach}
                  onMarkCompleted={handleMarkCompleted}
                />
              ) : (
                 <p className="text-center text-muted-foreground py-10">No coach selected.</p>
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Completed Coaches Sheet */}
      <Sheet open={isCompletedSheetOpen} onOpenChange={setIsCompletedSheetOpen}>
        <SheetContent className="w-full sm:max-w-2xl md:max-w-3xl p-0 flex flex-col">
          <SheetHeader className="p-6 border-b">
            <SheetTitle className="text-3xl font-extrabold tracking-tight text-primary">
              Completed Coaches
            </SheetTitle>
            <SheetDescription className="text-lg text-muted-foreground pt-1">
              A list of all coaches that have completed their service.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="flex-1">
            <div className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Coach Number</TableHead>
                    <TableHead className="font-semibold">Date Offered</TableHead>
                    <TableHead className="font-semibold">Date Completed</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedCoaches.length > 0 ? (
                    completedCoaches.map((coach) => (
                      <TableRow key={coach.id} className="cursor-pointer hover:bg-muted/50" onClick={() => { setIsCompletedSheetOpen(false); setTimeout(() => setSelectedCoach(coach), 150) }}>
                        <TableCell className="font-medium">{coach.coachNumber}</TableCell>
                        <TableCell>{format(coach.offeredDate, 'PPP')}</TableCell>
                        <TableCell>{coach.completionDate ? format(coach.completionDate, 'PPP') : 'N/A'}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-green-400 border-green-400/40">
                             <CheckCircle className="mr-1.5 h-3.5 w-3.5" /> Completed
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-10">
                        No completed coaches yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* FABs */}
      <Button
        className="fixed bottom-8 left-8 h-16 w-16 rounded-full shadow-soft-lg z-50 animate-fade-in-up transition-transform hover:scale-105"
        aria-label="View Completed Coaches"
        onClick={() => setIsCompletedSheetOpen(true)}
      >
        <ListChecks className="h-8 w-8" />
      </Button>
      <Button
        asChild
        className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-soft-lg z-50 animate-fade-in-up transition-transform hover:scale-105"
        aria-label="Add Coach"
      >
        <Link href="/add-coach">
          <Plus className="h-8 w-8" />
        </Link>
      </Button>
    </>
  );
}
