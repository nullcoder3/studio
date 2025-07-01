
import type { Coach, Material, UsedMaterial } from './types';

export const initialMaterials: Material[] = [
  { id: 'mat-001', name: 'Brake Pads', materialCode: 'BP001', unit: 'set', stockQuantity: 100, minStockLevel: 20, description: 'Standard issue brake pads.', ownership: 'Railway' },
  { id: 'mat-002', name: 'Seat Covers', materialCode: 'SC001', unit: 'piece', stockQuantity: 200, minStockLevel: 50, description: 'Fabric seat covers.', ownership: 'SSWPI' },
  { id: 'mat-003', name: 'Window Panes', materialCode: 'WP001', unit: 'piece', stockQuantity: 50, minStockLevel: 10, description: 'Double-glazed window panes.', ownership: 'Railway' },
  { id: 'mat-004', name: 'Flooring Material', materialCode: 'FM001', unit: 'sqm', stockQuantity: 150, minStockLevel: 30, description: 'Anti-skid flooring.', ownership: 'SSWPI' },
  { id: 'mat-005', name: 'Lighting Fixtures', materialCode: 'LF001', unit: 'piece', stockQuantity: 300, minStockLevel: 50, description: 'LED lighting fixtures.', ownership: 'Railway' },
  { id: 'mat-006', name: 'Welding Rod', materialCode: 'WR001', unit: 'piece', stockQuantity: 500, minStockLevel: 100, description: 'General purpose welding rods.', ownership: 'Railway' },
];

export const initialCoaches: Coach[] = [
  {
    id: 'coach-001',
    coachNumber: 'C-101',
    offeredDate: new Date('2024-05-01'),
    workTypes: ['General Overhaul'],
    materials: [
      { materialId: 'mat-001', quantity: 8, date: new Date('2024-05-10') },
      { materialId: 'mat-002', quantity: 40, date: new Date('2024-05-12') },
    ],
  },
  {
    id: 'coach-002',
    coachNumber: 'C-102',
    offeredDate: new Date('2024-05-15'),
    workTypes: ['Interior Refurbishment'],
    materials: [
      { materialId: 'mat-002', quantity: 60, date: new Date('2024-05-20') },
      { materialId: 'mat-004', quantity: 15, date: new Date('2024-05-22') },
    ],
  },
  {
    id: 'coach-003',
    coachNumber: 'C-103',
    offeredDate: new Date('2024-06-01'),
    workTypes: ['Exterior Painting'],
    materials: [
      { materialId: 'mat-005', quantity: 25, date: new Date('2024-06-05') },
    ],
  },
  {
    id: 'coach-004',
    coachNumber: 'C-104',
    offeredDate: new Date('2024-06-10'),
    workTypes: ['General Overhaul'],
    materials: [
        { materialId: 'mat-001', quantity: 8, date: new Date('2024-06-15') },
        { materialId: 'mat-003', quantity: 4, date: new Date('2024-06-16') },
        { materialId: 'mat-005', quantity: 10, date: new Date('2024-06-18') },
    ],
  },
  {
    id: 'coach-005',
    coachNumber: 'C-201',
    offeredDate: new Date('2024-06-20'),
    workTypes: ['Wheelset Replacement'],
    materials: [
      { materialId: 'mat-001', quantity: 4, date: new Date('2024-06-25') },
    ],
  },
  {
    id: 'coach-006',
    coachNumber: 'C-202',
    offeredDate: new Date('2024-07-01'),
    workTypes: ['Interior Refurbishment', 'Head Stock Repair'],
    materials: [
        { materialId: 'mat-002', quantity: 25, date: new Date('2024-07-05') },
        { materialId: 'mat-004', quantity: 10, date: new Date('2024-07-06') },
        { materialId: 'mat-006', quantity: 50, date: new Date('2024-07-08') },
    ],
  },
];
