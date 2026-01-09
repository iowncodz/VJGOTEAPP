
import React from 'react';
import { UserRole, TaskStatus, User, Task, AttendanceRecord, Instruction } from './types';

export const MOCK_USERS: User[] = [
  { id: '1', name: 'Rajesh Gote', email: 'owner@vjgote.com', role: UserRole.OWNER },
  { id: '2', name: 'Priya Sharma', email: 'hr@vjgote.com', role: UserRole.HR },
  { id: '3', name: 'Amit Kumar', email: 'amit@vjgote.com', role: UserRole.EMPLOYEE },
  { id: '4', name: 'Suresh Patil', email: 'suresh@vjgote.com', role: UserRole.EMPLOYEE },
  { id: '5', name: 'Ayaan', email: 'ayaan@gmail.com', role: UserRole.EMPLOYEE },
];

export const MOCK_TASKS: Task[] = [
  { 
    id: 't1', 
    title: 'Foundation Leveling', 
    description: 'Level the ground for Block A foundation.', 
    assignedTo: '3', 
    assignedToName: 'Amit Kumar',
    status: TaskStatus.IN_PROGRESS, 
    siteLocation: 'Skyline Heights, Sector 45',
    createdAt: '2023-10-25'
  },
  { 
    id: 't2', 
    title: 'Material Procurement', 
    description: 'Verify cement quality and quantity.', 
    assignedTo: '4', 
    assignedToName: 'Suresh Patil',
    status: TaskStatus.PENDING, 
    siteLocation: 'Riverview Residency',
    createdAt: '2023-10-26'
  },
  { 
    id: 't3', 
    title: 'Site Cleanup', 
    description: 'Clear debris from the north sector for inspection.', 
    assignedTo: '5', 
    assignedToName: 'Ayaan',
    status: TaskStatus.PENDING, 
    siteLocation: 'West Side Highway B',
    createdAt: '2023-10-29'
  }
];

export const MOCK_INSTRUCTIONS: Instruction[] = [
  { id: 'i1', author: 'Rajesh Gote', content: 'Safety helmets are mandatory for all site visits starting tomorrow.', date: '2023-10-27', priority: 'high' },
  { id: 'i2', author: 'Priya Sharma', content: 'Submit your month-end reports by Friday.', date: '2023-10-28', priority: 'medium' }
];

export const APP_THEME = {
  primary: 'bg-safetyOrange',
  secondary: 'bg-slateGray',
  accent: 'text-safetyOrange',
  button: 'bg-safetyOrange hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors'
};
