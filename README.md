# College Classroom Schedule Management System

A smart, real-time classroom and event scheduling platform for colleges that streamlines timetable management, prevents double-booking, and enables efficient utilization of campus resources.

## 🎯 Features

### Core Features
- **Interactive Schedule Viewer**: View all classes/events for a specific classroom on any selected date
- **Real-time Faculty Availability**: Track and update faculty status (present, absent, on leave, unavailable)
- **Automatic Conflict Detection**: Identify and prevent double-booking of classrooms and faculty
- **Mobile-Responsive Design**: Accessible on all devices with Tailwind CSS
- **Secure Authentication**: Firebase Authentication for role-based access control

### User Roles
- **Admin**: Full access to manage classrooms, schedules, faculty, and courses
- **Faculty**: View their schedules and request time off
- **Students**: Access timetables and classroom information
- **Staff**: View and manage general scheduling information

### Administrative Features
- Add and manage classrooms with capacities and amenities
- Create and modify course schedules
- Update faculty availability in real-time
- Cancel or reschedule classes with automatic notifications
- View conflict reports and scheduling analytics

## 🏗️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Firestore + Authentication)
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Build Tool**: Vite

## 📂 Project Structure

```
src/
├── components/          # React components
│   ├── ClassroomSelector.tsx    # Classroom selection UI
│   ├── DateSelector.tsx         # Date navigation
│   └── ScheduleView.tsx         # Schedule display
├── context/            # React Context for state management
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/
│   ├── firebase.ts     # Firebase configuration
│   └── database.ts     # Firestore operations
├── types/
│   └── index.ts        # TypeScript type definitions
├── utils/              # Utility functions
├── App.tsx             # Main App component
├── main.tsx            # Entry point
└── App.css            # Global styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- Firebase account and project

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd college-schedule-management
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Firebase**
   - Copy `.env.example` to `.env.local`
   - Get your Firebase credentials from [Firebase Console](https://console.firebase.google.com)
   - Update `.env.local` with your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_AUTH_DOMAIN=your_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Start the development server**
```bash
npm run dev
```

The app will open at `http://localhost:5173`

## 📦 Build for Production

```bash
npm run build
npm run preview  # Preview the production build locally
```

## 🗄️ Database Schema (Firestore)

### Collections

**users**
```typescript
{
  id: string
  email: string
  name: string
  role: 'admin' | 'faculty' | 'student' | 'staff'
  department: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

**classrooms**
```typescript
{
  id: string
  roomNumber: string
  building: string
  capacity: number
  amenities: string[]
  isActive: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

**courses**
```typescript
{
  id: string
  code: string
  name: string
  credits: number
  department: string
  semester: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

**faculty**
```typescript
{
  id: string
  userId: string
  name: string
  email: string
  department: string
  specialization: string[]
  status: 'present' | 'absent' | 'leave' | 'unavailable'
  statusUpdatedAt: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

**schedules**
```typescript
{
  id: string
  classroomId: string
  courseId: string
  facultyId: string
  date: Timestamp
  timeSlot: {
    startTime: string    // HH:MM
    endTime: string      // HH:MM
    dayOfWeek: number    // 0-6
  }
  status: 'scheduled' | 'cancelled' | 'rescheduled' | 'completed'
  notes: string?
  createdBy: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

**events**
```typescript
{
  id: string
  title: string
  description: string?
  classroomId: string
  date: Timestamp
  timeSlot: TimeSlot
  organizerId: string
  attendees: string[]?
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

## 🔐 Firebase Security Rules

Configure these in your Firestore console:

```javascript
// Example rules - customize based on your requirements
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read their own document
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId && request.auth.token.admin == true;
    }

    // Classrooms - readable by all authenticated users
    match /classrooms/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.admin == true;
    }

    // Schedules - readable by all, writable by admin
    match /schedules/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.admin == true;
    }
  }
}
```

## 🔄 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🛠️ Key Services

### Database Service (`src/services/database.ts`)
- Classroom operations (CRUD)
- Schedule management
- Faculty status updates
- Conflict detection

### Firebase Service (`src/services/firebase.ts`)
- Firebase initialization
- Authentication setup
- Firestore reference
- Storage configuration

## 🎨 Styling

The project uses Tailwind CSS for styling with custom color scheme:
- Primary: Sky blue (`#0ea5e9`)
- Secondary: Purple (`#a855f7`)
- Fully responsive design

## 📱 Features Implementation Guide

### Adding a New Component
1. Create the component in `src/components/`
2. Define TypeScript interfaces in `src/types/` if needed
3. Use provided hooks and services for data fetching
4. Apply Tailwind CSS for styling

### Adding Database Operations
1. Add methods to `src/services/database.ts`
2. Use Firestore SDK functions
3. Handle errors appropriately
4. Update type definitions as needed

### Authentication Flow
1. Firebase Auth handles user authentication
2. Store user info in the `users` collection
3. Use role-based access control (RBAC)
4. Implement role checks in components

## 🐛 Troubleshooting

### Firebase Configuration Issues
- Verify all environment variables are set correctly
- Check Firebase project is accessible
- Ensure Firestore database is created in Firebase Console

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf dist && npm run build`

### Import Path Issues
- Check path aliases in `vite.config.ts` and `tsconfig.json` match
- Verify file exists at the specified path

## 📝 Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx
VITE_FIREBASE_PROJECT_ID=xxx
VITE_FIREBASE_STORAGE_BUCKET=xxx
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
VITE_FIREBASE_APP_ID=xxx
```

## 🚢 Deployment

### Deploy to Firebase Hosting

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Initialize Firebase in your project:
```bash
firebase init
```

3. Build and deploy:
```bash
npm run build
firebase deploy
```

### Deploy to Other Platforms
- **Vercel**: Connect your GitHub repo to Vercel for automatic deployments
- **Netlify**: Connect your repo and set build command to `npm run build`
- **AWS Amplify**: Use AWS Amplify CLI for Firebase integration and hosting

## 📖 Additional Resources

- [React Documentation](https://react.dev)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Documentation](https://vitejs.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Support

For issues, questions, or suggestions, please open an issue on the project repository.

---

**Made with ❤️ for efficient college scheduling**
