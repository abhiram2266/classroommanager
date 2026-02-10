
export type UserRole = 'admin' | 'faculty' | 'student' | 'staff';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  createdAt: Date;
  updatedAt: Date;
}


export interface Classroom {
  id: string;
  roomNumber: string;
  building: string;
  capacity: number;
  amenities: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}


export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  department: string;
  semester: string;
  createdAt: Date;
  updatedAt: Date;
}


export type FacultyStatus = 'present' | 'absent' | 'leave' | 'unavailable';

export interface Faculty {
  id: string;
  userId: string;
  name: string;
  email: string;
  department: string;
  specialization: string[];
  status: FacultyStatus;
  statusUpdatedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}


export interface TimeSlot {
  startTime: string; 
  endTime: string;   
  dayOfWeek: number; 
}


export type ScheduleStatus = 'scheduled' | 'cancelled' | 'rescheduled' | 'completed';

export interface Schedule {
  id: string;
  classroomId: string;
  courseId: string;
  facultyId: string;
  date: Date;
  timeSlot: TimeSlot;
  status: ScheduleStatus;
  notes?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}


export interface Event {
  id: string;
  title: string;
  description?: string;
  classroomId: string;
  date: Date;
  timeSlot: TimeSlot;
  organizerId: string;
  attendees?: string[];
  createdAt: Date;
  updatedAt: Date;
}


export interface ScheduleConflict {
  id: string;
  scheduleId: string;
  conflictType: 'classroom' | 'faculty' | 'room_capacity';
  details: string;
  resolvedAt?: Date;
  createdAt: Date;
}


export interface DashboardData {
  todaySchedules: Schedule[];
  upcomingSchedules: Schedule[];
  conflicts: ScheduleConflict[];
  facultyStatus: Faculty[];
  totalClassrooms: number;
}
