import React, { useState, useEffect } from 'react';
import { Calendar, BookOpen, AlertCircle } from 'lucide-react';
import type { Classroom, Schedule } from '@/types';
import { scheduleService } from '@/services/database';

interface ScheduleViewProps {
  selectedClassroom: Classroom | null;
  selectedDate: Date;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({ selectedClassroom, selectedDate }) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      if (!selectedClassroom) {
        setSchedules([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await scheduleService.getByClassroomAndDate(
          selectedClassroom.id,
          selectedDate
        );
        setSchedules(data);
      } catch (err) {
        setError('Failed to load schedules');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [selectedClassroom, selectedDate]);

  if (!selectedClassroom) {
    return (
      <div className="flex items-center justify-center h-full p-8 backdrop-blur-sm">
        <div className="text-center">
          <Calendar className="w-12 h-12 text-yellow-600/30 mx-auto mb-4" />
          <p className="text-white/60 text-lg font-mono">Select a classroom to view schedules</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 backdrop-blur-sm">
      <div className="mb-8 border border-yellow-600/30 p-6 rounded-lg fade-in-up backdrop-blur-md bg-black/50" style={{
        textShadow: '0 0 20px rgba(212, 175, 55, 0.1)',
      }}>
        <h2 className="text-3xl font-bold text-yellow-600 mb-2 font-black tracking-tight">
          {selectedClassroom.roomNumber}
        </h2>
        <p className="text-white/60 font-mono text-sm mb-4">
          {selectedClassroom.building}
        </p>
        <div className="text-white/70 text-lg mb-4">
          {selectedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="px-4 py-2 bg-yellow-600/15 text-yellow-600 border border-yellow-600/30 rounded font-mono">
            👥 Capacity: {selectedClassroom.capacity} students
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 animate-pulse backdrop-blur-sm">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <div className="w-12 h-12 border-3 border-yellow-600/20 border-t-yellow-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/50 font-mono">Loading schedules...</p>
          </div>
        </div>
      ) : schedules.length === 0 ? (
        <div className="p-12 border border-yellow-600/20 rounded-lg card-3d backdrop-blur-md bg-black/50 text-center">
          <Calendar className="w-12 h-12 text-yellow-600/30 mx-auto mb-4" />
          <p className="text-white/60 font-mono">No schedules for this classroom on this date</p>
        </div>
      ) : (
        <div className="space-y-4">
          {schedules.map((schedule, idx) => (
            <div
              key={schedule.id}
              className={`p-5 rounded-lg border card-3d fade-in-up transition-all duration-300 backdrop-blur-md font-mono text-sm ${
                schedule.status === 'cancelled'
                  ? 'border-red-500/30 bg-red-500/5'
                  : 'border-yellow-600/30 bg-yellow-600/5 hover:border-yellow-600/50 hover:bg-yellow-600/10'
              }`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2.5 mb-3">
                    <BookOpen className="w-4 h-4 text-yellow-600" />
                    <h3 className="font-semibold text-white text-lg">
                      Schedule {schedule.id.slice(0, 8)}
                    </h3>
                  </div>
                  <p className="text-sm text-white/70 mb-2">
                    <span className="inline-block px-3 py-1.5 bg-yellow-600/15 text-yellow-600 rounded text-xs mr-3 border border-yellow-600/20 font-mono">
                      🕐 {schedule.timeSlot.startTime} - {schedule.timeSlot.endTime}
                    </span>
                  </p>
                </div>
                <span
                  className={`px-4 py-1.5 rounded text-xs font-mono font-bold whitespace-nowrap ml-3 border backdrop-blur-sm tracking-widest uppercase ${
                    schedule.status === 'cancelled'
                      ? 'bg-red-500/20 text-red-400 border-red-500/30'
                      : 'bg-green-500/20 text-green-400 border-green-500/30'
                  }`}
                >
                  {schedule.status}
                </span>
              </div>
              {schedule.notes && (
                <p className="mt-4 text-xs text-white/70 p-3 bg-yellow-600/10 rounded border border-yellow-600/20 font-mono">
                  📝 {schedule.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
