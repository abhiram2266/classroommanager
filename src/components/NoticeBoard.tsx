import React, { useState } from 'react';
import { Bell, Trash2, AlertCircle, Loader } from 'lucide-react';
import { Notice, deleteNotice } from '@/services/community';

interface NoticeBoardProps {
  notices: Notice[];
  onDelete: () => void;
}

export const NoticeBoard: React.FC<NoticeBoardProps> = ({ notices, onDelete }) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const priorityStyles = {
    high: { border: 'border-l-4 border-red-600', bg: 'bg-red-600/10', badge: 'bg-red-600/30 text-red-400 border-red-600/50' },
    medium: { border: 'border-l-4 border-yellow-600', bg: 'bg-yellow-600/10', badge: 'bg-yellow-600/30 text-yellow-400 border-yellow-600/50' },
    low: { border: 'border-l-4 border-green-600', bg: 'bg-green-600/10', badge: 'bg-green-600/30 text-green-400 border-green-600/50' }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this notice?')) return;
    setDeletingId(id);
    setError(null);
    try {
      await deleteNotice(id);
      onDelete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  if (notices.length === 0) {
    return <p className="text-gray-400">No notices yet</p>;
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-900/30 border border-red-600/50 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
      {notices.map((notice) => {
        const style = priorityStyles[notice.priority];
        return (
          <div key={notice.id} className={`p-4 rounded-lg border ${style.border} ${style.bg}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Bell className="w-4 h-4 text-yellow-600" />
                  <h3 className="text-lg font-semibold text-white">{notice.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-semibold border ${style.badge}`}>
                    {notice.priority.toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-300 text-sm mb-2">{notice.content}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>By: {notice.createdBy}</span>
                  <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <button
                onClick={() => handleDelete(notice.id)}
                disabled={deletingId === notice.id}
                className="p-2 text-red-400 hover:bg-red-600/20 rounded disabled:opacity-50"
              >
                {deletingId === notice.id ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
