import type { Coach, Material } from './types';

export const materials: Material[] = [
  { id: 'mat-001', name: 'Brake Pads', ownership: 'Railway' },
  { id: 'mat-002', name: 'Seat Covers', ownership: 'SSWPI' },
  { id: 'mat-003', name: 'Window Panes', ownership: 'Railway' },
  { id: 'mat-004', name: 'Flooring Material', ownership: 'SSWPI' },
  { id: 'mat-005', name: 'Lighting Fixtures', ownership: 'Railway' },
];

export const coaches: Coach[] = [
  {
    id: 'coach-001',
    coachNumber: 'C-101',
    offeredDate: new Date('2024-05-01'),
    workTypes: ['General Overhaul'],
    materials: [materials[0], materials[1]],
  },
  {
    id: 'coach-002',
    coachNumber: 'C-102',
    offeredDate: new Date('2024-05-15'),
    workTypes: ['Interior Refurbishment'],
    materials: [materials[1], materials[3]],
  },
  {
    id: 'coach-003',
    coachNumber: 'C-103',
    offeredDate: new Date('2024-06-01'),
    workTypes: ['Exterior Painting'],
    materials: [materials[4]],
  },
  {
    id: 'coach-004',
    coachNumber: 'C-104',
    offeredDate: new Date('2024-06-10'),
    workTypes: ['General Overhaul'],
    materials: [materials[0], materials[2], materials[4]],
  },
  {
    id: 'coach-005',
    coachNumber: 'C-201',
    offeredDate: new Date('2024-06-20'),
    workTypes: ['Wheelset Replacement'],
    materials: [materials[0]],
  },
  {
    id: 'coach-006',
    coachNumber: 'C-202',
    offeredDate: new Date('2024-07-01'),
    workTypes: ['Interior Refurbishment', 'Head Stock Repair'],
    materials: [materials[1], materials[3]],
  },
];
