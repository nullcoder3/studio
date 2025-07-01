
"use client";

import { useState, useEffect } from 'react';
import type { Material } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';

export function useMaterials() {
  const [materials, setMaterials] = useState<Material[] | null>(null);

  useEffect(() => {
    const materialsCollection = collection(db, 'materials');
    const unsubscribe = onSnapshot(materialsCollection, (snapshot) => {
        const materialsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Material));
        setMaterials(materialsData);
    });
    return () => unsubscribe();
  }, []);

  const addMaterial = async (newMaterialData: Omit<Material, 'id'>) => {
    await addDoc(collection(db, 'materials'), newMaterialData);
  };

  const isLoading = materials === null;

  return { materials: materials ?? [], addMaterial, isLoading };
}
