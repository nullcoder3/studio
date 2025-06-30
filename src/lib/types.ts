export interface Material {
  id: string;
  name: string;
  ownership: 'Railway' | 'SSWPI';
}

export interface Coach {
  id: string;
  coachNumber: string;
  dateOffered: Date;
  workType: string;
  materials: Material[];
}
