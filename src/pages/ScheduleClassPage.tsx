import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, Clock, Building2, Plus } from 'lucide-react';
import type { Classroom, Faculty, Schedule } from '@/types';
import { classroomService } from '@/services/database';
import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/services/firebase';

export const ScheduleClassPage: React.FC = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [todaySchedules, setTodaySchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    courseName: '',
    courseId: '',
    classroomId: '',
    facultyId: '',
    startTime: '09:00',
    endTime: '10:30',
    enrolledStudents: 0,
    notes: '',
  });

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Starfield animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars: Array<{ x: number; y: number; radius: number; opacity: number; twinkleSpeed: number }> = [];
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        opacity: Math.random() * 0.5 + 0.5,
        twinkleSpeed: Math.random() * 0.03 + 0.005,
      });
    }

    let animationFrame: number;
    let time = 0;

    const animate = () => {
      time += 1;
      ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        const twinkle = Math.abs(Math.sin(time * star.twinkleSpeed)) * 0.5 + 0.5;
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch classrooms
        const classroomData = await classroomService.getAll();
        setClassrooms(classroomData);

        // Fetch faculty
        const facultySnapshot = await getDocs(collection(db, 'faculty'));
        const facultyData = facultySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Faculty));
        setFaculty(facultyData);

        // Fetch today's schedules
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const q = query(
          collection(db, 'schedules'),
          where('date', '>=', Timestamp.fromDate(today)),
          where('date', '<', Timestamp.fromDate(tomorrow))
        );

        const scheduleSnapshot = await getDocs(q);
        const scheduleData = scheduleSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Schedule));
        setTodaySchedules(scheduleData);
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Check classroom status
  const getClassroomStatus = (classroomId: string) => {
    const schedules = todaySchedules.filter((s) => s.classroomId === classroomId);
    if (schedules.length === 0) return { status: 'available', message: 'No classes today' };
    return {
      status: 'occupied',
      message: `${schedules.length} class${schedules.length > 1 ? 'es' : ''}`,
    };
  };

  // Check for time conflicts
  const checkTimeConflict = (classroomId: string, startTime: string, endTime: string) => {
    if (!classroomId) return null;

    const [newStartHour, newStartMin] = startTime.split(':').map(Number);
    const [newEndHour, newEndMin] = endTime.split(':').map(Number);

    const newStartMinutes = newStartHour * 60 + newStartMin;
    const newEndMinutes = newEndHour * 60 + newEndMin;

    const conflicts = todaySchedules.filter((schedule) => {
      if (schedule.classroomId !== classroomId) return false;

      const [existingStartHour, existingStartMin] = schedule.startTime.split(':').map(Number);
      const [existingEndHour, existingEndMin] = schedule.endTime.split(':').map(Number);

      const existingStartMinutes = existingStartHour * 60 + existingStartMin;
      const existingEndMinutes = existingEndHour * 60 + existingEndMin;

      // Check if times overlap
      return newStartMinutes < existingEndMinutes && newEndMinutes > existingStartMinutes;
    });

    return conflicts.length > 0 ? conflicts : null;
  };

  // Get conflicting schedules for the current form
  const conflictingSchedules = checkTimeConflict(formData.classroomId, formData.startTime, formData.endTime);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.courseName || !formData.classroomId || !formData.facultyId) {
      setError('Please fill in all required fields');
      return;
    }

    // Check for time conflicts
    const conflicts = checkTimeConflict(formData.classroomId, formData.startTime, formData.endTime);
    if (conflicts && conflicts.length > 0) {
      setError(`Time conflict! This classroom is already booked for: ${conflicts.map((c) => c.courseName).join(', ')}`);
      return;
    }

    try {
      const [startHour, startMin] = formData.startTime.split(':').map(Number);
      const [endHour, endMin] = formData.endTime.split(':').map(Number);

      const today = new Date();
      const scheduleDate = new Date(today);
      scheduleDate.setHours(startHour, startMin, 0, 0);

      const endDate = new Date(today);
      endDate.setHours(endHour, endMin, 0, 0);

      const duration = (endDate.getTime() - scheduleDate.getTime()) / (1000 * 60);

      await addDoc(collection(db, 'schedules'), {
        courseName: formData.courseName,
        courseId: formData.courseId || 'UNSET',
        facultyId: formData.facultyId,
        classroomId: formData.classroomId,
        date: Timestamp.fromDate(today),
        startTime: formData.startTime,
        endTime: formData.endTime,
        duration: Math.round(duration),
        status: 'scheduled',
        enrolledStudents: Number(formData.enrolledStudents) || 0,
        notes: formData.notes,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      setSuccessMessage(`✅ Class "${formData.courseName}" scheduled successfully!`);
      setFormData({
        courseName: '',
        courseId: '',
        classroomId: '',
        facultyId: '',
        startTime: '09:00',
        endTime: '10:30',
        enrolledStudents: 0,
        notes: '',
      });

      // Refresh today's schedules
      const today2 = new Date();
      today2.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today2);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const q = query(
        collection(db, 'schedules'),
        where('date', '>=', Timestamp.fromDate(today2)),
        where('date', '<', Timestamp.fromDate(tomorrow))
      );

      const scheduleSnapshot = await getDocs(q);
      const scheduleData = scheduleSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Schedule));
      setTodaySchedules(scheduleData);

      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      setError('Failed to schedule class');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Starfield Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      />

      {/* Content */}
      <div className="relative z-10 pt-24">
        {/* Top right coordinates */}
        <div className="fixed top-24 right-6 md:right-12 text-right text-xs md:text-sm font-mono text-yellow-600 z-20">
          <div>CLASS SCHEDULER</div>
          <div>Create New Schedule</div>
        </div>

        {/* Main Title Section */}
        <section className="px-6 py-12 border-b border-yellow-600/20">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter" style={{
              textShadow: '0 0 30px rgba(212, 175, 55, 0.3), 0 0 60px rgba(212, 175, 55, 0.1)',
              letterSpacing: '-0.02em',
            }}>
              SCHEDULE
              <br />
              <span className="text-yellow-600">NEW CLASS</span>
            </h1>
            <p className="text-white/60 font-mono uppercase tracking-widest text-sm md:text-base mt-4">
              Add new classes to your institution's schedule
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="px-6 py-16 md:py-24">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <div className="border border-yellow-600/30 rounded-lg p-8 bg-black/50 backdrop-blur-md">
                <h2 className="text-2xl font-black text-yellow-600 mb-6 font-mono">NEW SCHEDULE</h2>

                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 animate-pulse">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-red-300">{error}</p>
                  </div>
                )}

                {successMessage && (
                  <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-3 animate-pulse">
                    <p className="text-green-300">{successMessage}</p>
                  </div>
                )}

                {conflictingSchedules && conflictingSchedules.length > 0 && (
                  <div className="mb-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                    <p className="text-orange-300 font-mono text-sm mb-3 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      ⚠️ TIME CONFLICT DETECTED
                    </p>
                    <div className="space-y-2 ml-6">
                      {conflictingSchedules.map((conflict) => (
                        <div key={conflict.id} className="text-orange-200 text-xs bg-orange-500/10 p-2 rounded border border-orange-500/30">
                          <p className="font-bold">{conflict.courseName}</p>
                          <p className="text-orange-300">{conflict.startTime} - {conflict.endTime}</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-orange-300 text-xs mt-3">Please select a different time or classroom</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Course Name */}
                  <div>
                    <label className="block text-xs text-yellow-600 font-mono uppercase mb-2">Course Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.courseName}
                      onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                      className="w-full px-4 py-3 bg-yellow-600/5 border border-yellow-600/30 rounded-lg focus:border-yellow-600 focus:outline-none text-white font-mono text-sm transition-colors"
                      placeholder="e.g., Data Structures"
                    />
                  </div>

                  {/* Course ID */}
                  <div>
                    <label className="block text-xs text-yellow-600 font-mono uppercase mb-2">Course ID</label>
                    <input
                      type="text"
                      value={formData.courseId}
                      onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                      className="w-full px-4 py-3 bg-yellow-600/5 border border-yellow-600/30 rounded-lg focus:border-yellow-600 focus:outline-none text-white font-mono text-sm transition-colors"
                      placeholder="e.g., CS101"
                    />
                  </div>

                  {/* Classroom Selector */}
                  <div>
                    <label className="block text-xs text-yellow-600 font-mono uppercase mb-2">Classroom *</label>
                    <select
                      required
                      value={formData.classroomId}
                      onChange={(e) => setFormData({ ...formData, classroomId: e.target.value })}
                      className="w-full px-4 py-3 bg-yellow-600/5 border border-yellow-600/30 rounded-lg focus:border-yellow-600 focus:outline-none text-white font-mono text-sm transition-colors"
                    >
                      <option value="">Select a classroom</option>
                      {classrooms.map((room) => (
                        <option key={room.id} value={room.id}>
                          {room.name} (Capacity: {room.capacity})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Faculty Selector */}
                  <div>
                    <label className="block text-xs text-yellow-600 font-mono uppercase mb-2">Faculty *</label>
                    <select
                      required
                      value={formData.facultyId}
                      onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
                      className="w-full px-4 py-3 bg-yellow-600/5 border border-yellow-600/30 rounded-lg focus:border-yellow-600 focus:outline-none text-white font-mono text-sm transition-colors"
                    >
                      <option value="">Select faculty</option>
                      {faculty.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name} ({f.department})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Time Section */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-yellow-600 font-mono uppercase mb-2">Start Time *</label>
                      <input
                        type="time"
                        required
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        className="w-full px-4 py-3 bg-yellow-600/5 border border-yellow-600/30 rounded-lg focus:border-yellow-600 focus:outline-none text-white font-mono text-sm transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-yellow-600 font-mono uppercase mb-2">End Time *</label>
                      <input
                        type="time"
                        required
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        className="w-full px-4 py-3 bg-yellow-600/5 border border-yellow-600/30 rounded-lg focus:border-yellow-600 focus:outline-none text-white font-mono text-sm transition-colors"
                      />
                    </div>
                  </div>

                  {/* Enrolled Students */}
                  <div>
                    <label className="block text-xs text-yellow-600 font-mono uppercase mb-2">Enrolled Students</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.enrolledStudents}
                      onChange={(e) => setFormData({ ...formData, enrolledStudents: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 bg-yellow-600/5 border border-yellow-600/30 rounded-lg focus:border-yellow-600 focus:outline-none text-white font-mono text-sm transition-colors"
                      placeholder="0"
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-xs text-yellow-600 font-mono uppercase mb-2">Notes</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-4 py-3 bg-yellow-600/5 border border-yellow-600/30 rounded-lg focus:border-yellow-600 focus:outline-none text-white font-mono text-sm transition-colors resize-none h-20"
                      placeholder="Additional notes..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={conflictingSchedules && conflictingSchedules.length > 0}
                    className={`w-full px-6 py-3 font-mono font-bold uppercase tracking-widest rounded-lg transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 ${
                      conflictingSchedules && conflictingSchedules.length > 0
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
                        : 'bg-yellow-600 text-black hover:bg-yellow-500 active:scale-95'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    {conflictingSchedules && conflictingSchedules.length > 0 ? 'Resolve Conflict' : 'Schedule Class'}
                  </button>
                </form>
              </div>
            </div>

            {/* Status Section */}
            <div className="lg:col-span-1">
              <div className="border border-yellow-600/30 rounded-lg p-6 bg-black/50 backdrop-blur-md sticky top-32">
                <h3 className="text-lg font-black text-yellow-600 mb-4 font-mono">TODAY'S STATUS</h3>

                {loading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-12 bg-yellow-600/10 rounded animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {classrooms.map((classroom) => {
                      const status = getClassroomStatus(classroom.id);
                      return (
                        <div
                          key={classroom.id}
                          className="p-4 bg-yellow-600/10 border border-yellow-600/30 rounded-lg"
                        >
                          <p className="text-sm font-bold text-white mb-1">{classroom.name}</p>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                status.status === 'available'
                                  ? 'bg-green-500 animate-pulse'
                                  : 'bg-yellow-500'
                              }`}
                            />
                            <span className="text-xs text-white/70 font-mono">{status.message}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Today's Schedule */}
                <div className="mt-6 pt-6 border-t border-yellow-600/20">
                  <h4 className="text-sm font-bold text-yellow-600 mb-4 font-mono flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    SCHEDULED CLASSES
                  </h4>
                  {todaySchedules.length === 0 ? (
                    <p className="text-xs text-white/50 font-mono">No classes scheduled for today</p>
                  ) : (
                    <div className="space-y-3">
                      {todaySchedules.map((schedule) => (
                        <div key={schedule.id} className="text-xs bg-yellow-600/5 p-3 rounded border border-yellow-600/20">
                          <p className="font-bold text-white mb-1">{schedule.courseName}</p>
                          <p className="text-white/60">
                            {schedule.startTime} - {schedule.endTime}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom status bar */}
        <div className="fixed bottom-8 left-8 text-xs font-mono text-yellow-600/60 z-20">
          <div>SYSTEM STATUS: ONLINE</div>
          <div>CLASSROOMS: {classrooms.length}</div>
        </div>
      </div>
    </div>
  );
};
