import React, { useState, useEffect } from 'react';
import { BookOpen, AlertCircle } from 'lucide-react';
import { StudyMaterialUpload } from '@/components/StudyMaterialUpload';
import { StudyMaterialList } from '@/components/StudyMaterialList';
import {
  getAllStudyMaterials,
  StudyMaterial,
  MaterialCategory,
  getCategoryName,
} from '@/services/studyMaterials';

const CATEGORIES: { value: MaterialCategory; label: string; emoji: string }[] = [
  { value: 'pyq', label: 'Previous Year Questions', emoji: '📝' },
  { value: 'notes', label: 'Class Notes', emoji: '📖' },
  { value: 'books', label: 'Reference Books', emoji: '📚' },
  { value: 'lab-manual', label: 'Lab Manual', emoji: '🔬' },
  { value: 'assignments', label: 'Assignments', emoji: '✍️' },
  { value: 'other', label: 'Other', emoji: '📄' },
];

export const StudyMaterialsPage: React.FC = () => {
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<MaterialCategory | 'all'>('all');
  const [showUploadForm, setShowUploadForm] = useState(false);

  const loadMaterials = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const allMaterials = await getAllStudyMaterials();
      setMaterials(allMaterials);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load materials');
      setMaterials([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMaterials();
  }, []);

  const filteredMaterials = selectedCategory === 'all' 
    ? materials 
    : materials.filter((m) => m.category === selectedCategory);

  // Count materials by category
  const categoryCounts = CATEGORIES.reduce(
    (acc, cat) => {
      acc[cat.value] = materials.filter((m) => m.category === cat.value).length;
      return acc;
    },
    {} as Record<MaterialCategory, number>
  );

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-4 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-yellow-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: "'Audiowide', sans-serif" }}>
              Study Materials
            </h1>
            <span className="px-3 py-1 bg-green-600/20 border border-green-600/40 rounded text-sm text-green-400">🌍 Community Shared</span>
          </div>
          <p className="text-gray-400">Access PYQs, notes, and other study resources shared by the community</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
          <div className="bg-gray-900 p-3 rounded-lg border border-yellow-600/30">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Total Materials</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">{materials.length}</p>
          </div>
          <div className="bg-gray-900 p-3 rounded-lg border border-yellow-600/30">
            <p className="text-xs text-gray-400 uppercase tracking-wider">PYQs</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">{categoryCounts.pyq}</p>
          </div>
          <div className="bg-gray-900 p-3 rounded-lg border border-yellow-600/30">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Notes</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">{categoryCounts.notes}</p>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-900/30 border border-red-600/50 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <div>
              <p className="text-red-400 font-semibold">Error loading materials</p>
              <p className="text-sm text-red-400/80">{error}</p>
            </div>
          </div>
        )}

        {/* Upload Section - Toggle */}
        <div className="mb-8">
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-black font-semibold rounded transition-colors"
          >
            {showUploadForm ? 'Hide Upload Form' : '+ Upload Material'}
          </button>
        </div>

        {/* Upload Form */}
        {showUploadForm && (
          <div className="mb-8 bg-green-600/5 p-4 rounded-lg border border-green-600/20">
            <StudyMaterialUpload onUploadSuccess={loadMaterials} />
          </div>
        )}

        {/* Category Filters */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: "'Audiowide', sans-serif" }}>
            Filter by Category
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded transition-all ${
                selectedCategory === 'all'
                  ? 'bg-yellow-600 text-black'
                  : 'bg-gray-900 text-gray-400 hover:text-yellow-600 border border-yellow-600/30'
              }`}
            >
              All Materials
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded transition-all whitespace-nowrap ${
                  selectedCategory === cat.value
                    ? 'bg-yellow-600 text-black'
                    : 'bg-gray-900 text-gray-400 hover:text-yellow-600 border border-yellow-600/30'
                }`}
              >
                {cat.emoji} {cat.label} ({categoryCounts[cat.value]})
              </button>
            ))}
          </div>
        </div>

        {/* Materials List */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4" style={{ fontFamily: "'Audiowide', sans-serif" }}>
            {selectedCategory === 'all' ? 'All Materials' : getCategoryName(selectedCategory as MaterialCategory)}
          </h2>
          <StudyMaterialList
            materials={filteredMaterials}
            isLoading={isLoading}
            selectedCategory={selectedCategory === 'all' ? undefined : selectedCategory}
            onMaterialDeleted={loadMaterials}
          />
        </div>

        {/* Features Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-600/10 border border-green-600/30 rounded-lg">
            <p className="text-sm text-green-600 font-semibold mb-2">🌍 Publicly Shared</p>
            <p className="text-sm text-gray-300">All materials uploaded here are visible to everyone in the college</p>
          </div>
          <div className="p-4 bg-yellow-600/10 border border-yellow-600/30 rounded-lg">
            <p className="text-sm text-yellow-600 font-semibold mb-2">📚 Resources</p>
            <p className="text-sm text-gray-300">Browse PYQs, notes, reference books, and lab manuals</p>
          </div>
          <div className="p-4 bg-blue-600/10 border border-blue-600/30 rounded-lg">
            <p className="text-sm text-blue-600 font-semibold mb-2">🤝 Contribute</p>
            <p className="text-sm text-gray-300">Share your materials to help other students prepare</p>
          </div>
        </div>
      </div>
    </div>
  );
};
