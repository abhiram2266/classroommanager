import React, { useRef, useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { uploadStudyMaterial, MaterialCategory } from '@/services/studyMaterials';

interface StudyMaterialUploadProps {
  onUploadSuccess: () => void;
}

const CATEGORIES: MaterialCategory[] = ['pyq', 'notes', 'books', 'lab-manual', 'assignments', 'other'];
const SEMESTERS = ['1', '2', '3', '4', '5', '6', '7', '8'];
const SUBJECTS = [
  'Data Structures', 'Web Development', 'Database Management', 'Algorithms',
  'Operating Systems', 'Computer Networks', 'Software Engineering', 'Mobile Development',
  'Machine Learning', 'Cloud Computing',
];

export const StudyMaterialUpload: React.FC<StudyMaterialUploadProps> = ({ onUploadSuccess }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState({
    category: 'pyq' as MaterialCategory,
    subject: '',
    semester: '1',
    description: '',
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      setError('File exceeds 50MB limit');
      return;
    }

    if (!formData.subject) {
      setError('Select a subject');
      return;
    }

    setError(null);
    setIsUploading(true);
    setProgress(0);

    try {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) clearInterval(interval);
          return Math.min(prev + 10, 90);
        });
      }, 100);

      await uploadStudyMaterial(
        file,
        formData.category,
        formData.subject,
        formData.semester,
        'Anonymous Student',
        formData.description
      );

      clearInterval(interval);
      setProgress(100);

      setTimeout(() => {
        setIsUploading(false);
        setProgress(0);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setFormData({ category: 'pyq', subject: '', semester: '1', description: '' });
        onUploadSuccess();
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setIsUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg border border-green-600/30">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-green-400 text-xl">🌍</span>
        <h3 className="text-lg font-semibold text-white" style={{ fontFamily: "'Audiowide', sans-serif" }}>
          Upload Study Material
        </h3>
      </div>
      <p className="text-xs text-green-400 mb-4">Visible to everyone in the college</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as MaterialCategory })}
            disabled={isUploading}
            className="w-full bg-gray-800 border border-yellow-600/30 rounded px-3 py-2 text-white disabled:opacity-50"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat.toUpperCase().replace('-', ' ')}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Subject</label>
          <select
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            disabled={isUploading}
            className="w-full bg-gray-800 border border-yellow-600/30 rounded px-3 py-2 text-white disabled:opacity-50"
          >
            <option value="">Select...</option>
            {SUBJECTS.map((subject) => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Semester</label>
          <select
            value={formData.semester}
            onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
            disabled={isUploading}
            className="w-full bg-gray-800 border border-yellow-600/30 rounded px-3 py-2 text-white disabled:opacity-50"
          >
            {SEMESTERS.map((sem) => (
              <option key={sem} value={sem}>Sem {sem}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Description</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="e.g., Final exam 2024"
            disabled={isUploading}
            className="w-full bg-gray-800 border border-yellow-600/30 rounded px-3 py-2 text-white placeholder-gray-500 disabled:opacity-50"
          />
        </div>
      </div>

      <div
        className="border-2 border-dashed border-yellow-600/50 rounded-lg p-8 text-center hover:border-yellow-600 cursor-pointer mb-4"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          disabled={isUploading}
          className="hidden"
          accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx,.zip"
        />

        <div className="flex flex-col items-center gap-3">
          <Upload className={`w-8 h-8 ${isUploading ? 'text-gray-500' : 'text-yellow-600'}`} />
          <div>
            <p className="text-white font-semibold">Click to upload</p>
            <p className="text-sm text-gray-400">Max 50MB</p>
          </div>
        </div>

        {isUploading && (
          <div className="mt-4">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-yellow-600 h-2 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-400 mt-2">{progress}%</p>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-900/30 border border-red-600/50 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
};
