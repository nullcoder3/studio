
"use client";

import { useState, useEffect } from 'react';
import type { Coach } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, addDoc, updateDoc, deleteDoc, Timestamp, orderBy, query } from 'firebase/firestore';

export function useCoaches() {
  const [coaches, setCoaches] = useState<Coach[] | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'coaches'), orderBy('offeredDate', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const coachesData: Coach[] = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                coachNumber: data.coachNumber,
                offeredDate: (data.offeredDate as Timestamp).toDate(),
                workTypes: data.workTypes,
                notes: data.notes,
                materials: data.materials.map((m: any) => ({
                    ...m,
                    date: (m.date as Timestamp).toDate()
                })),
                status: data.status,
                completionDate: data.completionDate ? (data.completionDate as Timestamp).toDate() : undefined,
            } as Coach;
        });
        setCoaches(coachesData);
    });

    return () => unsubscribe();
  }, []);

  const addCoach = async (newCoachData: Omit<Coach, 'id' | 'materials' | 'status' | 'completionDate'>) => {
    await addDoc(collection(db, 'coaches'), {
        ...newCoachData,
        offeredDate: Timestamp.fromDate(newCoachData.offeredDate),
        materials: [],
        status: 'active',
    });
  };

  const updateCoach = async (updatedCoach: Coach) => {
    const coachDocRef = doc(db, 'coaches', updatedCoach.id);
    const { id, ...coachData } = updatedCoach;
    
    // Convert Date objects back to Firestore Timestamps before updating
    const firestoreReadyData = {
        ...coachData,
        offeredDate: Timestamp.fromDate(coachData.offeredDate),
        completionDate: coachData.completionDate ? Timestamp.fromDate(coachData.completionDate) : null,
        materials: coachData.materials.map(m => ({ ...m, date: Timestamp.fromDate(m.date) })),
    };
    
    await updateDoc(coachDocRef, firestoreReadyData);
  };

  const removeCoach = async (coachId: string) => {
    const coachDocRef = doc(db, 'coaches', coachId);
    await deleteDoc(coachDocRef);
  };

  const markCoachAsCompleted = async (coachId: string) => {
    const coachDocRef = doc(db, 'coaches', coachId);
    await updateDoc(coachDocRef, {
      status: 'completed',
      completionDate: Timestamp.now()
    });
  };

  const isLoading = coaches === null;

  return { coaches: coaches ?? [], addCoach, updateCoach, removeCoach, markCoachAsCompleted, isLoading };
}
