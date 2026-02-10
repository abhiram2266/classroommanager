import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Schedule, Classroom, Faculty } from '@/types';

// Firestore collection references
const CLASSROOMS_COLLECTION = 'classrooms';
const SCHEDULES_COLLECTION = 'schedules';
const FACULTY_COLLECTION = 'faculty';

// Classroom operations
export const classroomService = {
  async getAll(): Promise<Classroom[]> {
    try {
      const q = query(collection(db, CLASSROOMS_COLLECTION), where('isActive', '==', true));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Classroom));
    } catch (error) {
      console.error('Error fetching classrooms:', error);
      return [];
    }
  },

  async getById(id: string): Promise<Classroom | null> {
    const docRef = doc(db, CLASSROOMS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Classroom) : null;
  },

  async create(classroom: Omit<Classroom, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const newDocRef = doc(collection(db, CLASSROOMS_COLLECTION));
    const now = Timestamp.now();
    await setDoc(newDocRef, {
      ...classroom,
      createdAt: now,
      updatedAt: now,
    });
    return newDocRef.id;
  },

  async update(id: string, updates: Partial<Classroom>): Promise<void> {
    const docRef = doc(db, CLASSROOMS_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, CLASSROOMS_COLLECTION, id);
    await deleteDoc(docRef);
  },
};

// Schedule operations
export const scheduleService = {
  async getByClassroomAndDate(classroomId: string, date: Date): Promise<Schedule[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const q = query(
      collection(db, SCHEDULES_COLLECTION),
      where('classroomId', '==', classroomId),
      where('date', '>=', Timestamp.fromDate(startOfDay)),
      where('date', '<=', Timestamp.fromDate(endOfDay))
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date.toDate(),
      } as Schedule;
    });
  },

  async getByFacultyAndDate(facultyId: string, date: Date): Promise<Schedule[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const q = query(
      collection(db, SCHEDULES_COLLECTION),
      where('facultyId', '==', facultyId),
      where('date', '>=', Timestamp.fromDate(startOfDay)),
      where('date', '<=', Timestamp.fromDate(endOfDay))
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date.toDate(),
      } as Schedule;
    });
  },

  async create(schedule: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const newDocRef = doc(collection(db, SCHEDULES_COLLECTION));
    const now = Timestamp.now();
    await setDoc(newDocRef, {
      ...schedule,
      date: Timestamp.fromDate(schedule.date),
      createdAt: now,
      updatedAt: now,
    });
    return newDocRef.id;
  },

  async update(id: string, updates: Partial<Schedule>): Promise<void> {
    const docRef = doc(db, SCHEDULES_COLLECTION, id);
    const updateData: any = {
      ...updates,
      updatedAt: Timestamp.now(),
    };
    if (updates.date) {
      updateData.date = Timestamp.fromDate(updates.date);
    }
    await updateDoc(docRef, updateData);
  },
};

// Faculty service
export const facultyService = {
  async getAll(): Promise<Faculty[]> {
    const snapshot = await getDocs(collection(db, FACULTY_COLLECTION));
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        statusUpdatedAt: data.statusUpdatedAt?.toDate(),
      } as Faculty;
    });
  },

  async getById(id: string): Promise<Faculty | null> {
    const docRef = doc(db, FACULTY_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      statusUpdatedAt: data.statusUpdatedAt?.toDate(),
    } as Faculty;
  },

  async updateStatus(id: string, status: string): Promise<void> {
    const docRef = doc(db, FACULTY_COLLECTION, id);
    await updateDoc(docRef, {
      status,
      statusUpdatedAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  },
};
