import type { Coach, Material } from './types';

export const initialMaterials: Material[] = [
  { id: 'mat-001', name: 'Brake Pads', materialCode: 'BP001', unit: 'set', stockQuantity: 100, minStockLevel: 20, description: 'Standard issue brake pads.', ownership: 'Railway' },
  { id: 'mat-002', name: 'Seat Covers', materialCode: 'SC001', unit: 'piece', stockQuantity: 200, minStockLevel: 50, description: 'Fabric seat covers.', ownership: 'SSWPI' },
  { id: 'mat-003', name: 'Window Panes', materialCode: 'WP001', unit: 'piece', stockQuantity: 50, minStockLevel: 10, description: 'Double-glazed window panes.', ownership: 'Railway' },
  { id: 'mat-004', name: 'Flooring Material', materialCode: 'FM001', unit: 'sqm', stockQuantity: 150, minStockLevel: 30, description: 'Anti-skid flooring.', ownership: 'SSWPI' },
  { id: 'mat-005', name: 'Lighting Fixtures', materialCode: 'LF001', unit: 'piece', stockQuantity: 300, minStockLevel: 50, description: 'LED lighting fixtures.', ownership: 'Railway' },
];

export const initialCoaches: Coach[] = [
  {
    id: 'coach-001',
    coachNumber: 'C-101',
    offeredDate: new Date('2024-05-01'),
    workTypes: ['General Overhaul'],
    materials: [initialMaterials[0], initialMaterials[1]],
  },
  {
    id: 'coach-002',
    coachNumber: 'C-102',
    offeredDate: new Date('2024-05-15'),
    workTypes: ['Interior Refurbishment'],
    materials: [initialMaterials[1], initialMaterials[3]],
  },
  {
    id: 'coach-003',
    coachNumber: 'C-103',
    offeredDate: new Date('2024-06-01'),
    workTypes: ['Exterior Painting'],
    materials: [initialMaterials[4]],
  },
  {
    id: 'coach-004',
    coachNumber: 'C-104',
    offeredDate: new Date('2024-06-10'),
    workTypes: ['General Overhaul'],
    materials: [initialMaterials[0], initialMaterials[2], initialMaterials[4]],
  },
  {
    id: 'coach-005',
    coachNumber: 'C-201',
    offeredDate: new Date('2024-06-20'),
    workTypes: ['Wheelset Replacement'],
    materials: [initialMaterials[0]],
  },
  {
    id: 'coach-006',
    coachNumber: 'C-202',
    offeredDate: new Date('2024-07-01'),
    workTypes: ['Interior Refurbishment', 'Head Stock Repair'],
    materials: [initialMaterials[1], initialMaterials[3]],
  },
];
