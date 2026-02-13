import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Trash2, AlertCircle, Loader } from 'lucide-react';
import { Event, deleteEvent } from '@/services/community';

interface EventListProps {
  events: Event[];
  onDelete: () => void;
}

export const EventList: React.FC<EventListProps> = ({ events, onDelete }) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this event?')) return;
    setDeletingId(id);
    setError(null);
    try {
      await deleteEvent(id);
      onDelete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  if (events.length === 0) {
    return <p className="text-gray-400">No upcoming events</p>;
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-900/30 border border-red-600/50 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
      {events.map((event) => (
        <div
          key={event.id}
          className="p-4 rounded-lg border border-yellow-600/30 bg-black/50 hover:border-yellow-600 group"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-yellow-600">
                {event.title}
              </h3>
              <p className="text-gray-300 text-sm mb-4">{event.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar className="w-4 h-4 text-yellow-600" />
                  {event.date}
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  {event.time}
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin className="w-4 h-4 text-yellow-600" />
                  {event.location}
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500 mt-3">
                <span>By: {event.createdBy}</span>
                <span>{new Date(event.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <button
              onClick={() => handleDelete(event.id)}
              disabled={deletingId === event.id}
              className="p-2 text-red-400 hover:bg-red-600/20 rounded disabled:opacity-50 flex-shrink-0"
            >
              {deletingId === event.id ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
