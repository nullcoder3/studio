"use client";

import Link from 'next/link';
import { useCoaches } from '@/hooks/use-coaches';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { PackagePlus } from 'lucide-react';

export default function Home() {
  const { coaches, isLoading } = useCoaches();

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 animate-fade-in-down gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-primary font-headline">Active Coaches</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            A list of all coaches currently in service or under maintenance.
          </p>
        </div>
        <div>
          <Button asChild className="w-full md:w-auto">
            <Link href="/add-material">
              <PackagePlus />
              Add Material
            </Link>
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index}>
              <Card className="h-40 flex items-center justify-center">
                 <Skeleton className="h-10 w-24" />
              </Card>
            </div>
          ))
        ) : coaches.map((coach, index) => (
          <Link href={`/coach/${coach.id}`} key={coach.id} className="group">
            <div
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Card className="h-40 flex items-center justify-center transition-all duration-300 ease-in-out hover:shadow-lg hover:border-primary/50 hover:-translate-y-1">
                <CardContent className="p-0">
                  <span className="text-4xl font-extrabold tracking-wider text-foreground group-hover:text-primary transition-colors">
                    {coach.coachNumber}
                  </span>
                </CardContent>
              </Card>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
