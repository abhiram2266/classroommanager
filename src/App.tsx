import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { AuthProvider } from '@/context/AuthContext';
import { HomePage } from '@/pages/HomePage';
import { SchedulePage } from '@/pages/SchedulePage';
import { ClassroomsPage } from '@/pages/ClassroomsPage';
import { ScheduleClassPage } from '@/pages/ScheduleClassPage';
import { DrivePage } from '@/pages/DrivePage';
import { StudyMaterialsPage } from '@/pages/StudyMaterialsPage';
import { CommunityPage } from '@/pages/CommunityPage';
import { LoginPage } from '@/pages/LoginPage';
import { SignUpPage } from '@/pages/SignUpPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/classrooms" element={<ClassroomsPage />} />
          <Route path="/schedule-class" element={<ScheduleClassPage />} />
          <Route path="/drive" element={<DrivePage />} />
          <Route path="/study-materials" element={<StudyMaterialsPage />} />
          <Route path="/community" element={<CommunityPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
