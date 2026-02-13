import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { HomePage } from '@/pages/HomePage';
import { SchedulePage } from '@/pages/SchedulePage';
import { ClassroomsPage } from '@/pages/ClassroomsPage';
import { ScheduleClassPage } from '@/pages/ScheduleClassPage';
import { DrivePage } from '@/pages/DrivePage';
import { StudyMaterialsPage } from '@/pages/StudyMaterialsPage';
import { CommunityPage } from '@/pages/CommunityPage';
import './App.css';

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/classrooms" element={<ClassroomsPage />} />
        <Route path="/schedule-class" element={<ScheduleClassPage />} />
        <Route path="/drive" element={<DrivePage />} />
        <Route path="/study-materials" element={<StudyMaterialsPage />} />
        <Route path="/community" element={<CommunityPage />} />
      </Routes>
    </Router>
  );
}

export default App;
