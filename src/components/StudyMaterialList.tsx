import React, { useState } from 'react';
import { Download, Trash2, AlertCircle, Loader, Eye } from 'lucide-react';
import { StudyMaterial, deleteStudyMaterial, formatFileSize, getCategoryEmoji } from '@/services/studyMaterials';

interface StudyMaterialListProps {
  materials: StudyMaterial[];
  isLoading: boolean;
  selectedCategory?: string;
  onMaterialDeleted: () => void;
}

export const StudyMaterialList: React.FC<StudyMaterialListProps> = ({
  materials,
  isLoading,
  selectedCategory,
  onMaterialDeleted,
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: string, storagePath: string) => {
    if (!window.confirm('Are you sure you want to delete this material?')) return;

    setDeletingId(id);
    setError(null);

    try {
      await deleteStudyMaterial(id, storagePath);
      onMaterialDeleted();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete material');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = (downloadUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="w-6 h-6 text-yellow-600 animate-spin" />
        <p className="ml-3 text-gray-400">Loading materials...</p>
      </div>
    );
  }

  if (materials.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No study materials available yet</p>
        {selectedCategory && <p className="text-sm text-gray-500 mt-2">Try selecting a different category</p>}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="p-3 bg-red-900/30 border border-red-600/50 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {materials.map((material) => (
          <div
            key={material.id}
            className="bg-gray-900 p-4 rounded-lg border border-yellow-600/30 hover:border-yellow-600/60 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start gap-2 flex-1">
                <span className="text-2xl">{getCategoryEmoji(material.category)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white font-semibold truncate" title={material.name}>
                      {material.name}
                    </p>
                    <span className="inline-block px-1.5 py-0.5 bg-green-600/20 border border-green-600/40 rounded text-xs text-green-400 whitespace-nowrap">
                      🌍 Shared
                    </span>
                  </div>
                  <span className="inline-block px-2 py-1 bg-yellow-600/20 border border-yellow-600/40 rounded text-xs text-yellow-400 mt-1">
                    {material.category.toUpperCase().replace('-', ' ')}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-400 mb-4">
              <p>
                <span className="text-gray-500">Uploaded by:</span> <span className="text-yellow-400">{material.uploadedBy}</span>
              </p>
              <p>
                <span className="text-gray-500">Subject:</span> {material.subject}
              </p>
              <p>
                <span className="text-gray-500">Semester:</span> {material.semester}
              </p>
              <p>
                <span className="text-gray-500">Size:</span> {formatFileSize(material.size)}
              </p>
              {material.description && (
                <p>
                  <span className="text-gray-500">Description:</span> {material.description}
                </p>
              )}
              <p className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {material.downloads} downloads
              </p>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-yellow-600/20">
              <button
                onClick={() => handleDownload(material.downloadUrl, material.fileName)}
                className="flex-1 py-2 bg-yellow-600/20 hover:bg-yellow-600/40 border border-yellow-600/50 text-yellow-600 rounded transition-colors text-sm font-semibold flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                onClick={() => handleDelete(material.id, material.storagePath)}
                disabled={deletingId === material.id}
                className="p-2 text-red-400 hover:bg-red-600/20 rounded transition-colors disabled:opacity-50"
                title="Delete material"
              >
                {deletingId === material.id ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 text-center mt-4">
        Total materials: {materials.length}
      </p>
    </div>
  );
};
