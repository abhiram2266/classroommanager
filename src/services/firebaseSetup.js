import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
  Timestamp
} from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7Jn5zZh4e3lq5vafMifnhVIKb2t7emTM",
  authDomain: "webp-e9b6a.firebaseapp.com",
  projectId: "webp-e9b6a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ============================================
// CREATE CLASSROOMS
// ============================================
async function createClassrooms() {
  const classrooms = [
    {
      id: "C1",
      name: "Lecture Hall A",
      capacity: 100,
      location: "Block A, 1st Floor",
      floor: 1,
      building: "Block A",
      amenities: ["Projector", "WiFi", "AC"],
      isActive: true
    },
    {
      id: "C2",
      name: "Lecture Hall B",
      capacity: 80,
      location: "Block A, 2nd Floor",
      floor: 2,
      building: "Block A",
      amenities: ["Projector", "WiFi"],
      isActive: true
    },
    {
      id: "C3",
      name: "Computer Lab 1",
      capacity: 60,
      location: "Block B, Ground Floor",
      floor: 0,
      building: "Block B",
      amenities: ["Computers", "AC", "LAN"],
      isActive: true
    },
    {
      id: "C4",
      name: "Main Auditorium",
      capacity: 300,
      location: "Block C, Ground Floor",
      floor: 0,
      building: "Block C",
      amenities: ["Stage", "Sound System", "Projector", "AC"],
      isActive: true
    }
  ];

  for (const room of classrooms) {
    await setDoc(doc(db, "classrooms", room.id), {
      name: room.name,
      capacity: room.capacity,
      location: room.location,
      floor: room.floor,
      building: room.building,
      amenities: room.amenities,
      isActive: room.isActive,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log(`✅ Classroom created: ${room.name}`);
  }

  console.log("\n🎉 classrooms collection created successfully\n");
}

// ============================================
// CREATE FACULTY
// ============================================
async function createFaculty() {
  const faculty = [
    {
      id: "F1",
      name: "Dr. John Smith",
      email: "john.smith@college.edu",
      department: "Computer Science",
      availability: "available"
    },
    {
      id: "F2",
      name: "Dr. Emily Davis",
      email: "emily.davis@college.edu",
      department: "Information Technology",
      availability: "available"
    },
    {
      id: "F3",
      name: "Dr. Robert Brown",
      email: "robert.brown@college.edu",
      department: "Electronics",
      availability: "on-leave"
    },
    {
      id: "F4",
      name: "Dr. Sarah Wilson",
      email: "sarah.wilson@college.edu",
      department: "Computer Science",
      availability: "available"
    }
  ];

  for (const member of faculty) {
    await setDoc(doc(db, "faculty", member.id), {
      name: member.name,
      email: member.email,
      department: member.department,
      availability: member.availability,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log(`✅ Faculty added: ${member.name}`);
  }

  console.log("\n🎉 faculty collection created successfully\n");
}

// ============================================
// CREATE SCHEDULES
// ============================================
async function createSchedules() {
  const schedules = [
    {
      id: "S1",
      courseId: "CS101",
      courseName: "Data Structures",
      facultyId: "F1",
      classroomId: "C1",
      date: Timestamp.fromDate(new Date("2026-02-15")),
      startTime: "10:00",
      endTime: "11:30",
      duration: 90,
      status: "scheduled",
      enrolledStudents: 45,
      notes: "Bring laptops"
    },
    {
      id: "S2",
      courseId: "CS102",
      courseName: "Operating Systems",
      facultyId: "F2",
      classroomId: "C2",
      date: Timestamp.fromDate(new Date("2026-02-15")),
      startTime: "12:00",
      endTime: "13:30",
      duration: 90,
      status: "scheduled",
      enrolledStudents: 50,
      notes: "Lab session"
    },
    {
      id: "S3",
      courseId: "CS103",
      courseName: "Database Systems",
      facultyId: "F4",
      classroomId: "C3",
      date: Timestamp.fromDate(new Date("2026-02-16")),
      startTime: "09:00",
      endTime: "10:30",
      duration: 90,
      status: "scheduled",
      enrolledStudents: 40,
      notes: "Project discussion"
    }
  ];

  for (const schedule of schedules) {
    await setDoc(doc(db, "schedules", schedule.id), {
      courseId: schedule.courseId,
      courseName: schedule.courseName,
      facultyId: schedule.facultyId,
      classroomId: schedule.classroomId,
      date: schedule.date,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      duration: schedule.duration,
      status: schedule.status,
      enrolledStudents: schedule.enrolledStudents,
      notes: schedule.notes,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log(`✅ Schedule added: ${schedule.courseName}`);
  }

  console.log("\n🎉 schedules collection created successfully\n");
}

// ============================================
// RUN ALL
// ============================================
async function run() {
  try {
    console.log("🚀 Starting Firebase setup...\n");
    await createClassrooms();
    await createFaculty();
    await createSchedules();
    console.log("✨ All collections updated successfully!");
  } catch (error) {
    console.error("❌ Error setting up Firebase:", error);
  }
}

run();
