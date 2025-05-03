import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';

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

interface ComboCardProps {
  combo: Combo;
  songId: string;
}

const ComboCard: React.FC<ComboCardProps> = ({ combo, songId }) => {
  const [copied, setCopied] = useState(false);
  const queryClient = useQueryClient();

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Determine card color based on energy level
  const getCardColorClasses = () => {
    switch (combo.energyLevel) {
      case 1:
        return 'border-green-200 bg-green-50';
      case 2:
        return 'border-yellow-200 bg-yellow-50';
      case 3:
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  // Handle copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(combo.sequence);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Regenerate mutation
  const regenerateMutation = useMutation({
    mutationFn: async () => {
      console.log(`Regenerating combo ${combo.id} for song ${songId}`);
      try {
        const response = await apiClient<Combo[]>(`/api/v1/songs/${songId}/combos/regenerate`, {
          method: 'POST',
          body: {
            excludeComboIds: [combo.id]
          }
        });
        console.log("Regenerate response:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error regenerating combo:", error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log("Successfully regenerated combo");
      // Invalidate combos query to refetch
      queryClient.invalidateQueries({ queryKey: ['combos', songId] });
    }
  });

  return (
    <div className={`rounded-lg border p-4 ${getCardColorClasses()} relative overflow-hidden`}>
      {/* Energy level indicator */}
      <div className="absolute top-0 right-0 m-2">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          combo.energyLevel === 1 ? 'bg-green-100 text-green-800' :
          combo.energyLevel === 2 ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          Level {combo.energyLevel}
        </span>
      </div>

      {/* Time indicator */}
      <div className="text-sm text-gray-500 mb-2">
        {formatTime(combo.time)}
      </div>

      {/* Combo sequence */}
      <div className="text-2xl font-bold tracking-wide text-center my-4">
        {combo.sequence}
      </div>

      {/* Combo notation */}
      <div className="text-sm text-gray-600 mb-4">
        {combo.notation.map((punch, index) => (
          <span key={index}>
            {index > 0 && <span className="mx-1">→</span>}
            {punch}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-between mt-4">
        <button
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path>
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path>
              </svg>
              Copy
            </>
          )}
        </button>

        <button
          className="text-gray-600 hover:text-gray-800 text-sm font-medium flex items-center"
          onClick={() => regenerateMutation.mutate()}
          disabled={regenerateMutation.isPending}
        >
          {regenerateMutation.isPending ? (
            <>
              <svg className="animate-spin w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Regenerating...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"></path>
              </svg>
              Regenerate
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ComboCard;