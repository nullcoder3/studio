
"use client";

import { useState, useEffect } from 'react';
import type { Holiday } from '@/lib/types';
import { isSameDay } from 'date-fns';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';

export function useHolidays() {
  const [holidays, setHolidays] = useState<Holiday[] | null>(null);

  useEffect(() => {
    const holidaysCollection = collection(db, 'holidays');
    const unsubscribe = onSnapshot(holidaysCollection, (snapshot) => {
      const holidaysData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          date: (data.date as Timestamp).toDate(),
        };
      });
      setHolidays(holidaysData.sort((a, b) => a.date.getTime() - b.date.getTime()));
    });

    return () => unsubscribe();
  }, []);

  const addHoliday = async (date: Date) => {
    if (!holidays?.some(h => isSameDay(h.date, date))) {
        await addDoc(collection(db, 'holidays'), {
            date: Timestamp.fromDate(date),
        });
    }
  };

  const removeHoliday = async (holidayId: string) => {
    const holidayDocRef = doc(db, 'holidays', holidayId);
    await deleteDoc(holidayDocRef);
  };

  const isLoading = holidays === null;

  return { holidays: holidays ?? [], addHoliday, removeHoliday, isLoading };
}
