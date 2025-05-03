import React from 'react';
import ComboCard from './ComboCard';

interface Combo {
  id: string;
  sequence: string;
  notation: string[];
  energyLevel: 1 | 2 | 3;
  bpm: number;
  time: number;
  duration: number;
  createdAt: string;
}

interface ComboListProps {
  combos: Combo[];
  songId: string;
  isLoading?: boolean;
  error?: Error | null;
}

const ComboList: React.FC<ComboListProps> = ({ combos, songId, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Generated Combos</h2>
        <div className="grid grid-cols-1 gap-6 animate-pulse">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-gray-100 rounded-lg h-48"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Generated Combos</h2>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-red-700">
            Failed to load combos: {error.message || 'Unknown error'}
          </p>
        </div>
      </div>
    );
  }

  if (!combos || combos.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Generated Combos</h2>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
          <p className="text-gray-700">
            No combos have been generated yet.
          </p>
        </div>
      </div>
    );
  }

  // Sort combos by time (chronological order)
  const sortedCombos = [...combos].sort((a, b) => a.time - b.time);

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Generated Combos</h2>
        <span className="text-sm text-gray-500">{combos.length} combos</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedCombos.map((combo) => (
          <ComboCard key={combo.id} combo={combo} songId={songId} />
        ))}
      </div>
    </div>
  );
};

export default ComboList;