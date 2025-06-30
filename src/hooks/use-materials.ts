"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Material } from '@/lib/types';
import { initialMaterials } from '@/lib/data';

const MATERIALS_STORAGE_KEY = 'coachTrackMaterials';

export function useMaterials() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateLocalStorage = (newMaterials: Material[]) => {
     try {
       window.localStorage.setItem(MATERIALS_STORAGE_KEY, JSON.stringify(newMaterials));
     } catch (error) {
       console.error("Failed to save materials to localStorage", error);
     }
  }

  const addMaterial = useCallback((newMaterialData: Omit<Material, 'id'>) => {
    setMaterials(prevMaterials => {
        const newMaterial: Material = {
            id: `mat-${crypto.randomUUID()}`,
            ...newMaterialData,
        };
        const newMaterials = [newMaterial, ...prevMaterials];
        updateLocalStorage(newMaterials);
        return newMaterials;
    });
  }, []);

  return { materials, addMaterial, isLoading };
}
