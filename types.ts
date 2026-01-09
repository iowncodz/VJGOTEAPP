
export enum UserRole {
  EMPLOYEE = 'EMPLOYEE',
  HR = 'HR',
  OWNER = 'OWNER'
}

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkInTime: string;
  checkOutTime?: string;
  location?: { lat: number; lng: number };
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedToName: string;
  status: TaskStatus;
  siteLocation: string;
  createdAt: string;
}

export interface Instruction {
  id: string;
  author: string;
  content: string;
  date: string;
  priority: 'low' | 'medium' | 'high';
}

export interface SalaryRecord {
  employeeId: string;
  base: number;
  allowance: number;
  deduction: number;
  net: number;
  lastUpdated: string;
}
