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
import type { Classroom, Faculty } from '@/types';


const classroomsData: Omit<Classroom, 'id'>[] = [
  {
    roomNumber: 'A101',
    capacity: 100,
    building: 'Block A',
    amenities: ['Projector', 'WiFi', 'AC', 'Whiteboard'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    roomNumber: 'B201',
    capacity: 50,
    building: 'Block B',
    amenities: ['Projector', 'WiFi', 'Round Table'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    roomNumber: 'C301',
    capacity: 40,
    building: 'Block C',
    amenities: ['Computers', 'WiFi', 'AC'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    roomNumber: 'A102',
    capacity: 30,
    building: 'Block A',
    amenities: ['WiFi', 'Whiteboard', 'Projector'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];


const facultyData: Omit<Faculty, 'id'>[] = [
  {
    userId: 'user-john-smith',
    name: 'Dr. John Smith',
    email: 'john.smith@college.edu',
    department: 'Computer Science',
    specialization: ['Programming', 'AI'],
    status: 'present',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    userId: 'user-sarah-johnson',
    name: 'Prof. Sarah Johnson',
    email: 'sarah.johnson@college.edu',
    department: 'Mathematics',
    specialization: ['Algebra', 'Calculus'],
    status: 'present',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    userId: 'user-michael-brown',
    name: 'Dr. Michael Brown',
    email: 'michael.brown@college.edu',
    department: 'Physics',
    specialization: ['Quantum Physics', 'Mechanics'],
    status: 'leave',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    userId: 'user-emily-davis',
    name: 'Prof. Emily Davis',
    email: 'emily.davis@college.edu',
    department: 'Computer Science',
    specialization: ['Web Development', 'Databases'],
    status: 'present',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const schedulesData: never[] = [];



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
      console.log(`✅ Classroom added: ${classroom.roomNumber} (${docRef.id})`);
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
  _classroomIds: string[],
  _facultyIds: string[]
): Promise<void> {
  try {
    // Schedules seeding disabled - schedules are created through UI
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
