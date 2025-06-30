"use client";

import { useState, useEffect } from 'react';
import { isSameDay, parseISO } from 'date-fns';

const HOLIDAYS_STORAGE_KEY = 'coachTrackHolidays';

export function useHolidays() {
  const [holidays, setHolidays] = useState<Date[] | null>(null);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(HOLIDAYS_STORAGE_KEY);
      if (item) {
        const parsedHolidays = JSON.parse(item).map((dateStr: string) => parseISO(dateStr));
        setHolidays(parsedHolidays);
      } else {
        setHolidays([]);
      }
    } catch (error) {
      console.error("Failed to parse holidays from localStorage", error);
      setHolidays([]);
    }
  }, []);

  const updateLocalStorage = (newHolidays: Date[]) => {
     try {
       const holidaysToStore = newHolidays.map(date => date.toISOString());
       window.localStorage.setItem(HOLIDAYS_STORAGE_KEY, JSON.stringify(holidaysToStore));
     } catch (error) {
       console.error("Failed to save holidays to localStorage", error);
     }
  }

  const addHoliday = (date: Date) => {
    setHolidays(prevHolidays => {
      const currentHolidays = prevHolidays ?? [];
      if (!currentHolidays.some(h => isSameDay(h, date))) {
        const newHolidays = [...currentHolidays, date].sort((a,b) => a.getTime() - b.getTime());
        updateLocalStorage(newHolidays);
        return newHolidays;
      }
      return currentHolidays;
    });
  };

  const removeHoliday = (date: Date) => {
    setHolidays(prevHolidays => {
        const currentHolidays = prevHolidays ?? [];
        const newHolidays = currentHolidays.filter(h => !isSameDay(h, date));
        updateLocalStorage(newHolidays);
        return newHolidays;
    });
  };

  const isLoading = holidays === null;

  return { holidays: holidays ?? [], addHoliday, removeHoliday, isLoading };
}
