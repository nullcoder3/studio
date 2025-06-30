"use client";

import type { Coach } from '@/lib/types';
import { useHolidays } from '@/hooks/use-holidays';
import { calculateWorkingDays } from '@/lib/date-utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Wrench } from 'lucide-react';
import { format } from 'date-fns';

interface CoachDetailsProps {
  coach: Coach;
}

export function CoachDetails({ coach }: CoachDetailsProps) {
  const { holidays, isLoading: isLoadingHolidays } = useHolidays();

  const workingDays = isLoadingHolidays ? -1 : calculateWorkingDays(coach.offeredDate, holidays);

  return (
    <div className="space-y-6 p-1">
        <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-primary font-headline">
              Coach {coach.coachNumber}
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Detailed information and material usage for the coach.
            </p>
        </div>
        <Card>
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

        <Card>
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
                    <TableCell colSpan={2} className="text-center text-muted-foreground py-6">
                      No materials listed for this coach.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
    </div>
  );
}
