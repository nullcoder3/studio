
"use client";

import { useState, useEffect, useCallback } from 'react';
import { initialCoaches } from '@/lib/data';
import type { Coach } from '@/lib/types';
import { parseISO } from 'date-fns';

const COACHES_STORAGE_KEY = 'coachTrackCoaches';

// Helper to parse dates from stringified JSON
const coachReviver = (key: string, value: any) => {
  if ((key === 'offeredDate' || key === 'date' || key === 'completionDate') && typeof value === 'string') {
    return parseISO(value);
  }
  return value;
};

export function useCoaches() {
  const [coaches, setCoaches] = useState<Coach[] | null>(null);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(COACHES_STORAGE_KEY);
      if (item) {
        setCoaches(JSON.parse(item, coachReviver));
      } else {
        // Initialize with default data if nothing in localStorage
        setCoaches(initialCoaches);
        window.localStorage.setItem(COACHES_STORAGE_KEY, JSON.stringify(initialCoaches));
      }
    } catch (error) {
      console.error("Failed to parse coaches from localStorage", error);
      setCoaches(initialCoaches);
    }
  }, []);

  const updateLocalStorage = (newCoaches: Coach[]) => {
     try {
       window.localStorage.setItem(COACHES_STORAGE_KEY, JSON.stringify(newCoaches));
     } catch (error) {
       console.error("Failed to save coaches to localStorage", error);
     }
  }

  const addCoach = (newCoachData: Omit<Coach, 'id' | 'materials' | 'status' | 'completionDate'>) => {
    setCoaches(prevCoaches => {
        const currentCoaches = prevCoaches ?? [];
        const newCoach: Coach = {
            id: `coach-${crypto.randomUUID()}`,
            coachNumber: newCoachData.coachNumber,
            offeredDate: newCoachData.offeredDate,
            workTypes: newCoachData.workTypes,
            notes: newCoachData.notes,
            materials: [],
            status: 'active',
        };
        const newCoaches = [newCoach, ...currentCoaches];
        updateLocalStorage(newCoaches);
        return newCoaches;
    });
  };

  const updateCoach = (updatedCoach: Coach) => {
    setCoaches(prevCoaches => {
        const currentCoaches = prevCoaches ?? [];
        const coachIndex = currentCoaches.findIndex(c => c.id === updatedCoach.id);
        if (coachIndex === -1) {
            console.error("Coach not found for update");
            return currentCoaches;
        }
        const newCoaches = [...currentCoaches];
        newCoaches[coachIndex] = updatedCoach;
        updateLocalStorage(newCoaches);
        return newCoaches;
    });
  };

  const removeCoach = (coachId: string) => {
    setCoaches(prevCoaches => {
      const currentCoaches = prevCoaches ?? [];
      const newCoaches = currentCoaches.filter(c => c.id !== coachId);
      updateLocalStorage(newCoaches);
      return newCoaches;
    });
  };

  const markCoachAsCompleted = (coachId: string) => {
    setCoaches(prevCoaches => {
      const currentCoaches = prevCoaches ?? [];
      const newCoaches = currentCoaches.map(coach =>
        coach.id === coachId
          ? { ...coach, status: 'completed' as const, completionDate: new Date() }
          : coach
      );
      updateLocalStorage(newCoaches);
      return newCoaches;
    });
  };


  const isLoading = coaches === null;

  return { coaches: coaches ?? [], addCoach, updateCoach, removeCoach, markCoachAsCompleted, isLoading };
}
