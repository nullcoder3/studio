"use client";

import { useState } from 'react';
import type { Coach } from '@/lib/types';
import { useCoaches } from '@/hooks/use-coaches';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { CoachDetails } from '@/components/coach-details';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Home() {
  const { coaches, isLoading } = useCoaches();
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);

  return (
    <>
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 animate-fade-in-down gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-primary font-headline">Active Coaches</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              A list of all coaches currently in service or under maintenance.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {isLoading ? (
            Array.from({ length: 10 }).map((_, index) => (
              <div key={index}>
                <Card className="h-40 flex items-center justify-center">
                   <Skeleton className="h-10 w-24" />
                </Card>
              </div>
            ))
          ) : coaches.map((coach, index) => (
            <button
              onClick={() => setSelectedCoach(coach)}
              key={coach.id}
              className="group block animate-fade-in-up text-left"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Card className="h-40 flex items-center justify-center transition-all duration-300 ease-in-out hover:shadow-lg hover:border-primary/50 hover:-translate-y-1">
                <CardContent className="p-0">
                  <span className="text-4xl font-extrabold tracking-wider text-foreground group-hover:text-primary transition-colors">
                    {coach.coachNumber}
                  </span>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      </div>
      
      <Sheet open={!!selectedCoach} onOpenChange={(isOpen) => { if (!isOpen) setSelectedCoach(null); }}>
        <SheetContent className="w-full sm:max-w-xl md:max-w-2xl p-0">
          <ScrollArea className="h-full">
            <div className="p-6">
              {selectedCoach ? (
                <CoachDetails coach={selectedCoach} />
              ) : (
                 <p className="text-center text-muted-foreground">No coach selected.</p>
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
}
