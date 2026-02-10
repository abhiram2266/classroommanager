import React, { useState } from 'react';
import { seedAllData, clearAllCollections, initializeCollections } from '@/services/seedData';

/**
 * Component to manage database seeding
 * Only show in development or for admins
 */
export const SeedDataManager: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>('');

  const handleInitializeCollections = async () => {
    if (window.confirm('This will create empty collections. Continue?')) {
      setLoading(true);
      setMessage('Initializing collections...');
      try {
        await initializeCollections();
        setMessage('✅ Collections initialized!');
      } catch (error) {
        setMessage(
          `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSeedData = async () => {
    if (window.confirm('This will add sample data to Firestore. Continue?')) {
      setLoading(true);
      setMessage('Seeding data...');
      try {
        await seedAllData();
        setMessage('✅ Data seeded successfully!');
      } catch (error) {
        setMessage(
          `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClearData = async () => {
    if (
      window.confirm(
        '⚠️  This will DELETE all data from Firestore. Are you absolutely sure?'
      )
    ) {
      setLoading(true);
      setMessage('Clearing data...');
      try {
        await clearAllCollections();
        setMessage('✅ All data cleared!');
      } catch (error) {
        setMessage(
          `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      } finally {
        setLoading(false);
      }
    }
  };

  // Only show in development
  if (import.meta.env.MODE !== 'development') {
    return null;
  }

  return (
    <div
      className="fixed bottom-4 right-4 p-4 bg-black/90 border border-yellow-600/50 rounded"
      style={{ fontFamily: "'Space Grotesk', monospace" }}
    >
      <h3 className="text-yellow-600 font-bold mb-3 text-sm">
        🛠️ Database Tools (Dev Only)
      </h3>

      <div className="space-y-2">
        <button
          onClick={handleInitializeCollections}
          disabled={loading}
          className="w-full px-3 py-2 bg-blue-600 text-white font-bold text-sm rounded hover:bg-blue-500 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Create Empty Collections'}
        </button>

        <button
          onClick={handleSeedData}
          disabled={loading}
          className="w-full px-3 py-2 bg-yellow-600 text-black font-bold text-sm rounded hover:bg-yellow-500 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Seed All Data'}
        </button>

        <button
          onClick={handleClearData}
          disabled={loading}
          className="w-full px-3 py-2 bg-red-600 text-white font-bold text-sm rounded hover:bg-red-500 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Clear All Data'}
        </button>
      </div>

      {message && (
        <div className="mt-3 p-2 bg-gray-800 rounded text-xs text-gray-300 max-h-20 overflow-y-auto">
          {message}
        </div>
      )}
    </div>
  );
};
