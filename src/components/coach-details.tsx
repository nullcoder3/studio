
"use client";

import * as React from 'react';
import type { Coach } from '@/lib/types';
import { useHolidays } from '@/hooks/use-holidays';
import { useMaterials } from '@/hooks/use-materials';
import { calculateWorkingDays } from '@/lib/date-utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Clock, Wrench, Plus, Trash2, Box } from 'lucide-react';
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


interface CoachDetailsProps {
  coach: Coach;
  onUpdate: (updatedCoach: Coach) => void;
}

export function CoachDetails({ coach, onUpdate }: CoachDetailsProps) {
  const { holidays, isLoading: isLoadingHolidays } = useHolidays();
  const { materials: allMaterials, isLoading: isLoadingMaterials } = useMaterials();
  
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [newEntries, setNewEntries] = React.useState([{ key: crypto.randomUUID(), materialId: '', quantity: 1, date: new Date() }]);

  const workingDays = isLoadingHolidays ? -1 : calculateWorkingDays(coach.offeredDate, holidays);

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

    const updatedCoach = { ...coach, materials: updatedMaterials };
    onUpdate(updatedCoach);

    setShowAddForm(false);
    setNewEntries([{ key: crypto.randomUUID(), materialId: '', quantity: 1, date: new Date() }]);
  };


  return (
    <div className="space-y-6 pt-4">
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center">
              <CalendarIcon className="h-5 w-5 mr-3 text-muted-foreground" />
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
             <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2"><Box /> Materials ({coach.materials.length})</CardTitle>
                {!showAddForm && (
                    <Button variant="outline" size="sm" onClick={() => setShowAddForm(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Add Material
                    </Button>
                )}
            </div>
            <CardDescription>List of materials consumed by this coach.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Material</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coach.materials.length > 0 ? coach.materials.map((usedMaterial) => {
                  const details = getMaterialDetails(usedMaterial.materialId);
                  return (
                    <TableRow key={`${usedMaterial.materialId}-${usedMaterial.date.toISOString()}`}>
                      <TableCell className="font-medium">{details?.name ?? 'Unknown'}</TableCell>
                      <TableCell>{usedMaterial.quantity} {details?.unit ?? ''}</TableCell>
                      <TableCell>{format(usedMaterial.date, 'PPP')}</TableCell>
                    </TableRow>
                  )
                }) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-6">
                      No materials have been added yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            
            {showAddForm && (
              <div className="mt-6 p-4 border rounded-lg bg-muted/30">
                <h4 className="font-semibold mb-4 text-lg">Add Materials</h4>
                <div className="space-y-4">
                  {newEntries.map((entry) => (
                    <div key={entry.key} className="flex flex-col sm:flex-row gap-2 items-center">
                       <div className="w-full sm:w-1/2">
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
                       <div className="w-full sm:w-1/4">
                          <Input
                            type="number"
                            placeholder="Qty"
                            min={1}
                            value={entry.quantity}
                            onChange={(e) => handleEntryChange(entry.key, 'quantity', parseInt(e.target.value) || 1)}
                          />
                       </div>
                       <div className="w-full sm:w-1/4">
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
                              {entry.date ? format(entry.date, "PPP") : <span>Pick a date</span>}
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
                         <Trash2 className="h-4 w-4 text-destructive" />
                       </Button>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-6">
                  <div className="space-x-2">
                    <Button variant="ghost" onClick={() => { setShowAddForm(false); setNewEntries([{ key: crypto.randomUUID(), materialId: '', quantity: 1, date: new Date() }])}}>Cancel</Button>
                    <Button onClick={handleSave}>Save Materials</Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
    </div>
  );
}
