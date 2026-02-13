import React, { useRef, useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { uploadFile } from '@/services/storage';

interface FileUploadProps {
  userId: string;
  onUploadSuccess: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ userId, onUploadSuccess }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (100MB max)
    if (file.size > 100 * 1024 * 1024) {
      setError('File size exceeds 100MB limit');
      return;
    }

    setError(null);
    setIsUploading(true);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) clearInterval(progressInterval);
          return Math.min(prev + 10, 90);
        });
      }, 100);

      await uploadFile(file, userId);

      clearInterval(progressInterval);
      setProgress(100);

      // Reset after success
      setTimeout(() => {
        setIsUploading(false);
        setProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        onUploadSuccess();
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setIsUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg border border-blue-600/30">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-blue-400 text-xl">🔒</span>
        <h3 className="text-lg font-semibold text-white">Your Personal Storage</h3>
      </div>
      <div
        className="border-2 border-dashed border-blue-600/50 rounded-lg p-8 text-center hover:border-blue-600 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          disabled={isUploading}
          className="hidden"
          accept="*"
        />

        <div className="flex flex-col items-center gap-3">
          <Upload className={`w-8 h-8 ${isUploading ? 'text-gray-500' : 'text-blue-600'}`} />
          <div>
            <p className="text-white font-semibold">Click to upload or drag and drop</p>
            <p className="text-sm text-gray-400">Maximum file size: 100MB (Private Storage)</p>
          </div>
        </div>

        {isUploading && (
          <div className="mt-4">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-400 mt-2">Uploading... {progress}%</p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-900/30 border border-red-600/50 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
};
