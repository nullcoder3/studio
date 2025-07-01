
export interface Material {
  id: string;
  name: string;
  materialCode: string;
  unit: string;
  stockQuantity?: number;
  minStockLevel?: number;
  description?: string;
  ownership: 'Railway' | 'SSWPI';
}

export interface UsedMaterial {
  materialId: string;
  quantity: number;
  date: Date;
}

export interface Coach {
  id:string;
  coachNumber: string;
  offeredDate: Date;
  workTypes: string[];
  notes?: string;
  materials: UsedMaterial[];
  status: 'active' | 'completed';
  completionDate?: Date;
}

export interface Holiday {
  id: string;
  date: Date;
}
