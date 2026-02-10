# College Schedule Management System - Copilot Instructions

## Project Overview
A smart event and classroom schedule management website for colleges with real-time classroom utilization tracking, faculty availability updates, and auto-conflict detection.

## Progress Checklist

- [x] Create copilot-instructions.md
- [x] Scaffold the Vite + React TypeScript Project
- [x] Install required dependencies
- [x] Create project folder structure
- [x] Set up Firebase configuration
- [x] Create core components
- [x] Create and run dev server task
- [x] Ensure documentation is complete

## Development Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Firestore + Authentication)
- **State Management**: Context API + React Hooks
- **Date Handling**: date-fns

## Key Features Implemented
1. ✅ Basic project scaffolding with Vite
2. ✅ Type definitions for data models
3. ✅ Firebase configuration setup
4. ✅ Database service layer with CRUD operations
5. ✅ Core UI components (ClassroomSelector, DateSelector, ScheduleView)
6. ✅ Responsive design with Tailwind CSS
7. Next: Authentication, admin dashboard, conflict detection

## Database Schema (Firestore)
- `classrooms` - Room details with capacity and amenities
- `courses` - Course information
- `schedules` - Class/event schedules with status tracking
- `faculty` - Faculty with availability status
- `users` - User accounts and roles
- `events` - Special events/sessions

## Getting Started

### Prerequisites
- Node.js 16+ with npm
- Firebase account with Firestore database

### Setup Instructions

1. **Install Dependencies** (already done)
   ```bash
   npm install
   ```

2. **Configure Firebase**
   - Copy `.env.example` to `.env.local`
   - Add your Firebase credentials from [Firebase Console](https://console.firebase.google.com)

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   Opens automatically at `http://localhost:5173`

4. **Build for Production**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/              # React components
│   ├── ClassroomSelector.tsx   # Classroom selection UI
│   ├── DateSelector.tsx        # Date navigation
│   └── ScheduleView.tsx        # Schedule display
├── context/                # React Context state management
├── hooks/                  # Custom React hooks
├── pages/                  # Page components
├── services/
│   ├── firebase.ts         # Firebase configuration
│   └── database.ts         # Firestore CRUD operations
├── types/
│   └── index.ts            # TypeScript type definitions
├── utils/                  # Utility functions
└── vite-env.d.ts          # Vite environment types
```

## Available Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint (when configured)

## Next Steps for Development

### Immediate Priority
1. ✅ Set up Firebase authentication
2. ✅ Create admin dashboard for schedule management
3. ✅ Implement conflict detection logic
4. ✅ Add faculty availability status updates

### Medium Priority
5. Real-time updates with Firestore listeners
6. Role-based access control (RBAC)
7. Email notifications for schedule changes
8. Mobile optimization and PWA setup

### Long-term
9. Advanced analytics and reporting
10. Room booking system
11. Faculty workload management
12. Integration with student information system

## Important Notes

- **Environment Variables**: Must be prefixed with `VITE_` to be exposed to client
- **TypeScript Paths**: Configured in `vite.config.ts` for cleaner imports (@/ prefix)
- **Firebase Rules**: Configure security rules in Firebase Console for production
- **Build Warnings**: Large bundle size can be optimized with code splitting

## Troubleshooting

### Port Already in Use
If `localhost:5173` is busy, Vite will automatically use the next available port.

### Firebase Configuration Missing
Error: `Property 'env' does not exist` - Make sure `.env.local` exists with all required variables.

### Build Fails
Clear cache and reinstall:
```bash
rm -r node_modules && npm install
npm run build
```

## Support & Resources

- [React Documentation](https://react.dev)
- [Firebase Docs](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Guide](https://vitejs.dev)

