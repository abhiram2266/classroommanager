import React, { useState, useEffect } from 'react';
import { HardDrive, AlertCircle } from 'lucide-react';
import { FileUpload } from '@/components/FileUpload';
import { FileList } from '@/components/FileList';
import { getUserFiles, StorageFile, formatFileSize } from '@/services/storage';

export const DrivePage: React.FC = () => {
  const userId = 'demo-user-123';
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFiles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const userFiles = await getUserFiles(userId);
      setFiles(userFiles);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load files');
      setFiles([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const totalSize = files.reduce((sum, f) => sum + f.size, 0);
  const usedSpacePercent = Math.min((totalSize / (10 * 1024 * 1024 * 1024)) * 100, 100);

  const storageColor = usedSpacePercent > 90 ? 'bg-red-600' : usedSpacePercent > 70 ? 'bg-orange-600' : 'bg-yellow-600';

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-4 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <HardDrive className="w-8 h-8 text-yellow-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: "'Audiowide', sans-serif" }}>
              College DRIVE
            </h1>
            <span className="px-3 py-1 bg-blue-600/20 border border-blue-600/40 rounded text-sm text-blue-400">🔒 Private</span>
          </div>
          <p className="text-gray-400">Store and manage your personal files securely (Private - only you can access)</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 p-4 rounded-lg border border-yellow-600/30">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Total Files</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">{files.length}</p>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg border border-yellow-600/30">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Used Space</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">{formatFileSize(totalSize)}</p>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg border border-yellow-600/30">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Storage Limit</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">10 GB</p>
          </div>
        </div>

        <div className="mb-8 bg-gray-900 p-4 rounded-lg border border-yellow-600/30">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-400">Storage Usage</p>
            <p className="text-sm text-yellow-600 font-semibold">{usedSpacePercent.toFixed(1)}%</p>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${storageColor}`}
              style={{ width: `${usedSpacePercent}%` }}
            />
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-900/30 border border-red-600/50 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <div>
              <p className="text-red-400 font-semibold">Error loading files</p>
              <p className="text-sm text-red-400/80">{error}</p>
            </div>
          </div>
        )}

        <div className="mb-8">
          <FileUpload userId={userId} onUploadSuccess={loadFiles} />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-4" style={{ fontFamily: "'Audiowide', sans-serif" }}>
            My Files
          </h2>
          <FileList files={files} isLoading={isLoading} onFileDeleted={loadFiles} />
        </div>

        <div className="mt-8 p-4 bg-blue-600/10 border border-blue-600/30 rounded-lg">
          <p className="text-sm text-gray-300 mb-2 font-semibold">🔒 Private Storage</p>
          <p className="text-sm text-gray-300">
            ✓ All files encrypted and securely stored<br />
            ✓ Only you can access your files<br />
            ✓ Max file size: 100MB | Total: 10GB<br />
            ✓ Use Study Materials to share resources instead
          </p>
        </div>
      </div>
    </div>
  );
};
