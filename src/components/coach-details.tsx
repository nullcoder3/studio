
"use client";

import * as React from 'react';
import type { Coach } from '@/lib/types';
import { useHolidays } from '@/hooks/use-holidays';
import { useMaterials } from '@/hooks/use-materials';
import { calculateWorkingDays } from '@/lib/date-utils';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Clock, Wrench, Plus, Trash2, Box, CheckCircle } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from './ui/input';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


interface CoachDetailsProps {
  coach: Coach;
  onUpdate: (updatedCoach: Coach) => void;
  onRemove: (coachId: string) => void;
  onMarkCompleted: (coachId: string) => void;
}

export function CoachDetails({ coach, onUpdate, onRemove, onMarkCompleted }: CoachDetailsProps) {
  const { holidays, isLoading: isLoadingHolidays } = useHolidays();
  const { materials: allMaterials, isLoading: isLoadingMaterials } = useMaterials();
  
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [newEntries, setNewEntries] = React.useState([{ key: crypto.randomUUID(), materialId: '', quantity: 1, date: new Date() }]);

  const workingDays = isLoadingHolidays ? -1 : calculateWorkingDays(coach.offeredDate, holidays.map(h => h.date));

  const getMaterialDetails = (materialId: string) => {
    return allMaterials.find(m => m.id === materialId);
  }

  const handleRemoveEntry = (key: string) => {
    setNewEntries(newEntries.filter(entry => entry.key !== key));
  }

  const handleEntryChange = <K extends keyof (typeof newEntries)[0]>(key: string, field: K, value: (typeof newEntries)[0][K]) => {
    setNewEntries(newEntries.map(entry => entry.key === key ? { ...entry, [field]: value } : entry));
  }

  const handleSave = () => {
    const validEntries = newEntries.filter(e => e.materialId && e.quantity > 0);
    if (validEntries.length === 0) {
      setShowAddForm(false);
      setNewEntries([{ key: crypto.randomUUID(), materialId: '', quantity: 1, date: new Date() }]);
      return;
    }

    const updatedMaterials = [...coach.materials];

    validEntries.forEach(entry => {
      const existingEntryIndex = updatedMaterials.findIndex(
        m => m.materialId === entry.materialId && isSameDay(m.date, entry.date)
      );

      if (existingEntryIndex > -1) {
        updatedMaterials[existingEntryIndex].quantity += entry.quantity;
      } else {
        updatedMaterials.push({
          materialId: entry.materialId,
          quantity: entry.quantity,
          date: entry.date,
        });
      }
    });

    const updatedCoach = { ...coach, materials: updatedMaterials.sort((a,b) => b.date.getTime() - a.date.getTime()) };
    onUpdate(updatedCoach);

    setShowAddForm(false);
    setNewEntries([{ key: crypto.randomUUID(), materialId: '', quantity: 1, date: new Date() }]);
  };


  return (
    <div className="space-y-6">
        <Card className="shadow-none border-0">
          <CardHeader className="p-0">
            <div className="flex justify-between items-start">
              <CardTitle className="font-bold text-lg">Details</CardTitle>
              {coach.status === 'active' && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive -mt-2">
                      <Trash2 className="h-5 w-5" />
                      <span className="sr-only">Delete Coach</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete coach{' '}
                        <span className="font-semibold">{coach.coachNumber}</span> and all of its associated data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onRemove(coach.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0 mt-4 space-y-5">
            <div className="flex items-start">
              <CalendarIcon className="h-5 w-5 mr-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Date Offered</p>
                <p className="text-sm text-muted-foreground">{format(coach.offeredDate, 'PPP')}</p>
              </div>
            </div>
             <div className="flex items-start">
              <Clock className="h-5 w-5 mr-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Working Days</p>
                {isLoadingHolidays ? (
                  <Skeleton className="h-5 w-12 mt-1" />
                ) : (
                  <p className="text-sm text-muted-foreground">{workingDays} days</p>
                )}
              </div>
            </div>
            <div className="flex items-start">
              <Wrench className="h-5 w-5 mr-4 text-muted-foreground flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-foreground">Work Types</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {coach.workTypes.map((workType) => (
                    <Badge key={workType} variant="secondary">
                      {workType}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          {coach.status === 'active' && (
            <CardFooter className="p-0 mt-6">
              <Button className="w-full" size="lg" onClick={() => onMarkCompleted(coach.id)}>
                <CheckCircle className="mr-2 h-5 w-5" />
                Mark as Completed
              </Button>
            </CardFooter>
          )}
        </Card>

        <Card className="shadow-none border-0">
          <CardHeader className="p-0">
             <div className="flex justify-between items-center">
                <CardTitle className="font-bold text-lg flex items-center gap-2.5"><Box className="h-5 w-5" /> Materials ({coach.materials.length})</CardTitle>
                {coach.status === 'active' && !showAddForm && (
                    <Button variant="outline" onClick={() => setShowAddForm(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Add Material
                    </Button>
                )}
            </div>
          </CardHeader>
          <CardContent className="p-0 mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Material</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coach.materials.length > 0 ? coach.materials.map((usedMaterial, index) => {
                  const details = getMaterialDetails(usedMaterial.materialId);
                  return (
                    <TableRow key={`${usedMaterial.materialId}-${usedMaterial.date.toISOString()}-${index}`}>
                      <TableCell className="font-medium">{details?.name ?? 'Unknown'}</TableCell>
                      <TableCell>{usedMaterial.quantity} {details?.unit ?? ''}</TableCell>
                      <TableCell>{format(usedMaterial.date, 'PPP')}</TableCell>
                    </TableRow>
                  )
                }) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground h-24">
                      No materials have been added yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            
            {showAddForm && (
              <div className="mt-6 p-4 border rounded-lg bg-background">
                <h4 className="font-semibold mb-4">Add Materials</h4>
                <div className="space-y-3">
                  {newEntries.map((entry) => (
                    <div key={entry.key} className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto] gap-2 items-center">
                       <div className="w-full">
                          <Select
                            value={entry.materialId}
                            onValueChange={(value) => handleEntryChange(entry.key, 'materialId', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a material" />
                            </SelectTrigger>
                            <SelectContent>
                              {isLoadingMaterials ? <SelectItem value="loading" disabled>Loading...</SelectItem> :
                                allMaterials.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)
                              }
                            </SelectContent>
                          </Select>
                       </div>
                       <div className="w-full sm:w-24">
                          <Input
                            type="number"
                            placeholder="Qty"
                            min={1}
                            value={entry.quantity}
                            onChange={(e) => handleEntryChange(entry.key, 'quantity', parseInt(e.target.value) || 1)}
                          />
                       </div>
                       <div className="w-full sm:w-auto">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !entry.date && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {entry.date ? format(entry.date, "MMM dd") : <span>Pick date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={entry.date}
                              onSelect={(date) => date && handleEntryChange(entry.key, 'date', date)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                       </div>
                       <Button variant="ghost" size="icon" onClick={() => handleRemoveEntry(entry.key)} disabled={newEntries.length <= 1}>
                         <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                       </Button>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-4 space-x-2">
                    <Button variant="ghost" onClick={() => { setShowAddForm(false); setNewEntries([{ key: crypto.randomUUID(), materialId: '', quantity: 1, date: new Date() }])}}>Cancel</Button>
                    <Button onClick={handleSave}>Save Materials</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
    </div>
  );
}
