import React, { useState } from 'react';
import { Download, Trash2, AlertCircle, Loader } from 'lucide-react';
import { StorageFile, deleteFile, formatFileSize } from '@/services/storage';

interface FileListProps {
  files: StorageFile[];
  isLoading: boolean;
  onFileDeleted: () => void;
}

export const FileList: React.FC<FileListProps> = ({ files, isLoading, onFileDeleted }) => {
  const [deletingPath, setDeletingPath] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (filePath: string) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;

    setDeletingPath(filePath);
    setError(null);

    try {
      await deleteFile(filePath);
      onFileDeleted();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete file');
    } finally {
      setDeletingPath(null);
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
        <p className="ml-3 text-gray-400">Loading files...</p>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No files uploaded yet</p>
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

      <div className="bg-gray-900 rounded-lg border border-yellow-600/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-yellow-600/20 bg-gray-800/50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-yellow-600">File Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-yellow-600">Size</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-yellow-600">Uploaded</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-yellow-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.path} className="border-b border-yellow-600/10 hover:bg-gray-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-white truncate max-w-xs" title={file.name}>
                      {file.name}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-400">{formatFileSize(file.size)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-400">
                      {new Date(file.uploadedAt).toLocaleDateString()} {new Date(file.uploadedAt).toLocaleTimeString()}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleDownload(file.downloadUrl, file.name)}
                        className="p-2 text-yellow-600 hover:bg-yellow-600/20 rounded transition-colors"
                        title="Download file"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(file.path)}
                        disabled={deletingPath === file.path}
                        className="p-2 text-red-400 hover:bg-red-600/20 rounded transition-colors disabled:opacity-50"
                        title="Delete file"
                      >
                        {deletingPath === file.path ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-gray-500 text-right">
        Total files: {files.length} | Total size: {formatFileSize(files.reduce((sum, f) => sum + f.size, 0))}
      </p>
    </div>
  );
};
