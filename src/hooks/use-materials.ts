"use client";

import { useState, useEffect } from 'react';
import type { Material } from '@/lib/types';
import { initialMaterials } from '@/lib/data';

const MATERIALS_STORAGE_KEY = 'coachTrackMaterials';

export function useMaterials() {
  const [materials, setMaterials] = useState<Material[] | null>(null);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(MATERIALS_STORAGE_KEY);
      if (item) {
        setMaterials(JSON.parse(item));
      } else {
        setMaterials(initialMaterials);
        window.localStorage.setItem(MATERIALS_STORAGE_KEY, JSON.stringify(initialMaterials));
      }
    } catch (error) {
      console.error("Failed to parse materials from localStorage", error);
      setMaterials(initialMaterials);
    }
  }, []);

  const updateLocalStorage = (newMaterials: Material[]) => {
     try {
       window.localStorage.setItem(MATERIALS_STORAGE_KEY, JSON.stringify(newMaterials));
     } catch (error) {
       console.error("Failed to save materials to localStorage", error);
     }
  }

  const addMaterial = (newMaterialData: Omit<Material, 'id'>) => {
    setMaterials(prevMaterials => {
        const currentMaterials = prevMaterials ?? [];
        const newMaterial: Material = {
            id: `mat-${crypto.randomUUID()}`,
            ...newMaterialData,
        };
        const newMaterials = [newMaterial, ...currentMaterials];
        updateLocalStorage(newMaterials);
        return newMaterials;
    });
  };

  const isLoading = materials === null;

  return { materials: materials ?? [], addMaterial, isLoading };
}
