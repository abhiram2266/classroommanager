import {
  collection,
  addDoc,
  Timestamp,
  writeBatch,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Classroom, Faculty, Schedule } from '@/types';


const classroomsData: Omit<Classroom, 'id'>[] = [
  {
    name: 'Lecture Hall A',
    capacity: 100,
    location: 'Block A, 1st Floor',
    floor: 1,
    building: 'Block A',
    amenities: ['Projector', 'WiFi', 'AC', 'Whiteboard'],
    isActive: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    name: 'Conference Room B',
    capacity: 50,
    location: 'Block B, 2nd Floor',
    floor: 2,
    building: 'Block B',
    amenities: ['Projector', 'WiFi', 'Round Table'],
    isActive: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    name: 'Lab C',
    capacity: 40,
    location: 'Block C, 3rd Floor',
    floor: 3,
    building: 'Block C',
    amenities: ['Computers', 'WiFi', 'AC'],
    isActive: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    name: 'Seminar Room D',
    capacity: 30,
    location: 'Block A, Ground Floor',
    floor: 0,
    building: 'Block A',
    amenities: ['WiFi', 'Whiteboard', 'Projector'],
    isActive: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
];


const facultyData: Omit<Faculty, 'id'>[] = [
  {
    name: 'Dr. John Smith',
    email: 'john.smith@college.edu',
    department: 'Computer Science',
    availability: 'available',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    name: 'Prof. Sarah Johnson',
    email: 'sarah.johnson@college.edu',
    department: 'Mathematics',
    availability: 'available',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    name: 'Dr. Michael Brown',
    email: 'michael.brown@college.edu',
    department: 'Physics',
    availability: 'on-leave',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    name: 'Prof. Emily Davis',
    email: 'emily.davis@college.edu',
    department: 'Computer Science',
    availability: 'available',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
];


const schedulesData = [
  {
    classroomId: '', 
    facultyId: '',
    courseId: 'CS101',
    courseName: 'Introduction to Programming',
    date: Timestamp.fromDate(new Date(2026, 1, 15)),
    startTime: '10:00',
    endTime: '11:30',
    duration: 90,
    status: 'scheduled',
    enrolledStudents: 45,
    notes: 'Bring laptops for practical session',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    classroomId: '',
    facultyId: '',
    courseId: 'MATH201',
    courseName: 'Advanced Calculus',
    date: Timestamp.fromDate(new Date(2026, 1, 16)),
    startTime: '14:00',
    endTime: '15:30',
    duration: 90,
    status: 'scheduled',
    enrolledStudents: 35,
    notes: 'Chapter 5-7 will be covered',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    classroomId: '',
    facultyId: '',
    courseId: 'PHYS301',
    courseName: 'Quantum Mechanics',
    date: Timestamp.fromDate(new Date(2026, 1, 17)),
    startTime: '09:00',
    endTime: '10:30',
    duration: 90,
    status: 'scheduled',
    enrolledStudents: 28,
    notes: 'Lab session scheduled for next week',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
];


export async function initializeFirebase(): Promise<boolean> {
  try {
    console.log('🔥 Checking Firebase initialization status...\n');

    
    const classroomsSnapshot = await getDocs(collection(db, 'classrooms'));
    
    
    const realDocs = classroomsSnapshot.docs.filter(
      (doc) => doc.id !== 'init_doc'
    );

    if (realDocs.length === 0) {
      console.log('📋 First-time setup detected. Initializing database...\n');
      await seedAllData();
      return true;
    } else {
      console.log('✓ Database already initialized. Skipping setup.');
      console.log(`📊 Found ${realDocs.length} classrooms.\n`);
      return false;
    }
  } catch (error) {
    console.error('⚠️  Initialization check failed:', error);
    return false;
  }
}


export async function initializeCollections(): Promise<void> {
  try {
    console.log('🔧 Initializing Firestore collections...\n');

    const collections = [
      {
        name: 'classrooms',
        docId: 'init_doc',
        data: { initialized: true, createdAt: Timestamp.now() },
      },
      {
        name: 'schedules',
        docId: 'init_doc',
        data: { initialized: true, createdAt: Timestamp.now() },
      },
      {
        name: 'faculty',
        docId: 'init_doc',
        data: { initialized: true, createdAt: Timestamp.now() },
      },
      {
        name: 'users',
        docId: 'init_doc',
        data: { initialized: true, createdAt: Timestamp.now() },
      },
      {
        name: 'courses',
        docId: 'init_doc',
        data: { initialized: true, createdAt: Timestamp.now() },
      },
    ];

    for (const col of collections) {
      try {
        const snapshot = await getDocs(collection(db, col.name));

        
        if (snapshot.empty) {
          console.log(`📝 Creating collection: '${col.name}'...`);
          const docRef = doc(db, col.name, col.docId);
          await setDoc(docRef, col.data);
          console.log(`✅ Collection '${col.name}' created\n`);
        } else {
          console.log(`✓ Collection '${col.name}' already exists\n`);
        }
      } catch (error) {
        console.error(`⚠️  Collection '${col.name}' check failed:`, error);
      }
    }

    console.log('✨ All collections initialized!\n');
  } catch (error) {
    console.error('❌ Error initializing collections:', error);
    throw error;
  }
}


export async function cleanupInitDocs(): Promise<void> {
  try {
    console.log('🧹 Cleaning up initialization documents...\n');

    const collections = ['classrooms', 'schedules', 'faculty', 'users', 'courses'];

    for (const colName of collections) {
      const docRef = doc(db, colName, 'init_doc');
      const docSnap = await getDocs(collection(db, colName));

      if (
        docSnap.docs.length === 1 &&
        docSnap.docs[0].id === 'init_doc'
      ) {
        await deleteDoc(docRef);
        console.log(`✅ Cleaned up '${colName}'`);
      }
    }

    console.log('\n✨ Cleanup complete!');
  } catch (error) {
    console.error('❌ Error cleaning up:', error);
  }
}


export async function seedClassrooms(): Promise<string[]> {
  try {
    const classroomIds: string[] = [];
    const classroomsRef = collection(db, 'classrooms');

    for (const classroom of classroomsData) {
      const docRef = await addDoc(classroomsRef, classroom);
      classroomIds.push(docRef.id);
      console.log(`✅ Classroom added: ${classroom.name} (${docRef.id})`);
    }

    return classroomIds;
  } catch (error) {
    console.error('❌ Error seeding classrooms:', error);
    throw error;
  }
}


export async function seedFaculty(): Promise<string[]> {
  try {
    const facultyIds: string[] = [];
    const facultyRef = collection(db, 'faculty');

    for (const member of facultyData) {
      const docRef = await addDoc(facultyRef, member);
      facultyIds.push(docRef.id);
      console.log(`✅ Faculty added: ${member.name} (${docRef.id})`);
    }

    return facultyIds;
  } catch (error) {
    console.error('❌ Error seeding faculty:', error);
    throw error;
  }
}


export async function seedSchedules(
  classroomIds: string[],
  facultyIds: string[]
): Promise<void> {
  try {
    const schedulesRef = collection(db, 'schedules');
    let classroomIndex = 0;
    let facultyIndex = 0;

    for (const schedule of schedulesData) {
      const docRef = await addDoc(schedulesRef, {
        ...schedule,
        classroomId: classroomIds[classroomIndex % classroomIds.length],
        facultyId: facultyIds[facultyIndex % facultyIds.length],
      });

      console.log(
        `✅ Schedule added: ${schedule.courseName} (${docRef.id})`
      );

      classroomIndex++;
      facultyIndex++;
    }
  } catch (error) {
    console.error('❌ Error seeding schedules:', error);
    throw error;
  }
}


export async function seedAllData(): Promise<void> {
  try {
    console.log('🚀 Starting complete setup...\n');

    
    await initializeCollections();

    
    console.log('📚 Seeding classrooms...');
    const classroomIds = await seedClassrooms();
    console.log(`✨ ${classroomIds.length} classrooms added\n`);

    
    console.log('👨‍🏫 Seeding faculty...');
    const facultyIds = await seedFaculty();
    console.log(`✨ ${facultyIds.length} faculty members added\n`);

    
    console.log('📅 Seeding schedules...');
    await seedSchedules(classroomIds, facultyIds);
    console.log(`✨ ${schedulesData.length} schedules added\n`);

    
    await cleanupInitDocs();

    console.log('✅ All data seeded successfully!');
  } catch (error) {
    console.error('❌ Error during setup:', error);
    throw error;
  }
}


export async function clearAllCollections(): Promise<void> {
  try {
    console.log('⚠️  Clearing all collections...');

    const collections = ['classrooms', 'faculty', 'schedules'];

    for (const collectionName of collections) {
      const batch = writeBatch(db);
      const snapshot = await getDocs(collection(db, collectionName));

      snapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      console.log(`✅ Cleared ${collectionName}`);
    }

    console.log('✨ All collections cleared');
  } catch (error) {
    console.error('❌ Error clearing collections:', error);
    throw error;
  }
}
