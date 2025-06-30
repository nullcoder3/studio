"use client";

import { useState, useEffect, useCallback } from 'react';
import { isSameDay, parseISO } from 'date-fns';

const HOLIDAYS_STORAGE_KEY = 'coachTrackHolidays';

export function useHolidays() {
  const [holidays, setHolidays] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    try {
      const item = window.localStorage.getItem(HOLIDAYS_STORAGE_KEY);
      if (item) {
        const parsedHolidays = JSON.parse(item).map((dateStr: string) => parseISO(dateStr));
        setHolidays(parsedHolidays);
      }
    } catch (error) {
      console.error("Failed to parse holidays from localStorage", error);
      setHolidays([]);
    } finally {
      setIsLoading(false);
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

  const addHoliday = useCallback((date: Date) => {
    setHolidays(prevHolidays => {
      if (!prevHolidays.some(h => isSameDay(h, date))) {
        const newHolidays = [...prevHolidays, date].sort((a,b) => a.getTime() - b.getTime());
        updateLocalStorage(newHolidays);
        return newHolidays;
      }
      return prevHolidays;
    });
  }, []);

  const removeHoliday = useCallback((date: Date) => {
    setHolidays(prevHolidays => {
        const newHolidays = prevHolidays.filter(h => !isSameDay(h, date));
        updateLocalStorage(newHolidays);
        return newHolidays;
    });
  }, []);

  return { holidays, addHoliday, removeHoliday, isLoading };
}
