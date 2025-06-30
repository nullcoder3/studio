"use client";

import { notFound, useParams } from 'next/navigation';
import { useCoaches } from '@/hooks/use-coaches';
import { useHolidays } from '@/hooks/use-holidays';
import { calculateWorkingDays } from '@/lib/date-utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Wrench } from 'lucide-react';
import { format } from 'date-fns';

function CoachDetailsSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-pulse">
      <div className="mb-8">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-6 w-2/3 mt-4" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-3 text-muted-foreground" />
              <div className="w-full space-y-2">
                <p className="font-semibold">Date Offered</p>
                <Skeleton className="h-5 w-24" />
              </div>
            </div>
             <div className="flex items-center">
              <Clock className="h-5 w-5 mr-3 text-muted-foreground" />
              <div className="w-full space-y-2">
                <p className="font-semibold">Working Days</p>
                <Skeleton className="h-5 w-12" />
              </div>
            </div>
            <div className="flex items-start pt-2">
              <Wrench className="h-5 w-5 mr-3 text-muted-foreground flex-shrink-0 mt-1" />
              <div className="w-full space-y-2">
                <p className="font-semibold">Work Types</p>
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Materials Used</CardTitle>
            <CardDescription>List of materials with ownership details.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


export default function CoachDetailsPage() {
  const params = useParams();
  const { coaches, isLoading: isLoadingCoaches } = useCoaches();
  const { holidays, isLoading: isLoadingHolidays } = useHolidays();

  // Wait for both params and coaches to be loaded
  if (isLoadingCoaches || !params.id) {
    return <CoachDetailsSkeleton />;
  }

  const coachId = params.id as string;
  const coach = coaches.find((c) => c.id === coachId);

  if (!coach) {
    notFound();
  }

  const workingDays = isLoadingHolidays ? -1 : calculateWorkingDays(coach.offeredDate, holidays);

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-primary font-headline">
          Coach {coach.coachNumber}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Detailed information and material usage for the coach.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-3 text-muted-foreground" />
              <div>
                <p className="font-semibold">Date Offered</p>
                <p className="text-sm text-muted-foreground">{format(coach.offeredDate, 'PPP')}</p>
              </div>
            </div>
             <div className="flex items-center">
              <Clock className="h-5 w-5 mr-3 text-muted-foreground" />
              <div>
                <p className="font-semibold">Working Days</p>
                {isLoadingHolidays ? (
                  <Skeleton className="h-5 w-12" />
                ) : (
                  <p className="text-sm text-muted-foreground">{workingDays} days</p>
                )}
              </div>
            </div>
            <div className="flex items-start pt-2">
              <Wrench className="h-5 w-5 mr-3 text-muted-foreground flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold">Work Types</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {coach.workTypes.map((workType) => (
                    <Badge key={workType} variant="secondary" className="font-normal">
                      {workType}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Materials Used</CardTitle>
            <CardDescription>List of materials with ownership details.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Material</TableHead>
                  <TableHead>Ownership</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coach.materials.length > 0 ? coach.materials.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell className="font-medium">{material.name}</TableCell>
                    <TableCell>
                      {material.ownership === 'Railway' ? (
                         <Badge variant="secondary">Railway (R)</Badge>
                      ) : (
                        <Badge variant="outline">SSWPI (S)</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground">
                      No materials listed for this coach.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
