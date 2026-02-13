import React, { useState, useEffect } from 'react';
import { Building2, Search, AlertCircle } from 'lucide-react';
import type { Classroom } from '@/types';
import { classroomService } from '@/services/database';

interface ClassroomSelectorProps {
  onSelectClassroom: (classroom: Classroom) => void;
  selectedClassroom: Classroom | null;
}

export const ClassroomSelector: React.FC<ClassroomSelectorProps> = ({
  onSelectClassroom,
  selectedClassroom,
}) => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchClassrooms = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await classroomService.getAll();
        setClassrooms(data);
        if (data.length > 0 && !selectedClassroom) {
          onSelectClassroom(data[0]);
        }
      } catch (err) {
        setError('Failed to load classrooms');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClassrooms();
  }, []);

  const filteredClassrooms = classrooms.filter((room) =>
    room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.building.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 h-full flex flex-col">
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2 animate-pulse backdrop-blur-sm">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      <div className="mb-4 relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-yellow-600/50" />
        <input
          type="text"
          placeholder="Search classrooms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-yellow-600/30 rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-600/50 focus:border-yellow-600/50 transition-all duration-300 text-white placeholder-white/30 font-mono text-sm"
        />
      </div>

      {loading ? (
        <div className="space-y-3 flex-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-14 bg-gradient-to-r from-white/5 to-white/10 rounded-lg animate-pulse backdrop-blur-sm" />
          ))}
        </div>
      ) : filteredClassrooms.length === 0 ? (
        <div className="text-center py-8 flex-1 flex flex-col items-center justify-center">
          <Building2 className="w-8 h-8 text-cyan-400/30 mx-auto mb-2 animate-float" />
          <p className="text-white/40 text-sm">No classrooms found</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto flex-1">
          {filteredClassrooms.map((classroom, idx) => (
            <button
              key={classroom.id}
              onClick={() => onSelectClassroom(classroom)}
              className={`w-full text-left p-4 rounded-lg border transition-all duration-300 fade-in-up backdrop-blur-sm font-mono text-sm ${
                selectedClassroom?.id === classroom.id
                  ? 'border-yellow-600 bg-yellow-600/10 text-yellow-600'
                  : 'border-yellow-600/20 bg-black/50 text-white hover:border-yellow-600/50 hover:bg-yellow-600/5'
              }`}
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-white leading-tight">
                    {classroom.roomNumber}
                  </p>
                  <p className="text-xs text-white/60 mt-1.5">
                    {classroom.building} • Capacity: {classroom.capacity}
                  </p>
                </div>
                {selectedClassroom?.id === classroom.id && (
                  <div className="w-2 h-2 rounded-full bg-yellow-600 mt-1 animate-pulse" />
                )}
              </div>
              {classroom.amenities.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {classroom.amenities.slice(0, 2).map((amenity: string, i: number) => (
                    <span key={i} className="text-xs bg-yellow-600/10 text-yellow-600 px-2.5 py-1 rounded border border-yellow-600/20 font-mono">
                      {amenity}
                    </span>
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
