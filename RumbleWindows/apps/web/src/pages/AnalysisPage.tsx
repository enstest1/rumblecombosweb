import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';
import AnalysisResultsDisplay from '../components/AnalysisResultsDisplay';
import ComboList from '../components/ComboList';

interface SongDetails {
  id: string;
  originalname: string;
  mimetype: string;
  size: number;
  uploadedAt: string;
}

interface AnalysisResult {
  songId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  bpm?: number;
  variableBpm?: boolean;
  energyProfile?: {
    startTime: number;
    endTime: number;
    level: 1 | 2 | 3;
  }[];
  duration?: number;
  error?: string;
  completedAt?: string;
}

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

const AnalysisPage: React.FC = () => {
  const { songId } = useParams<{ songId: string }>();
  const navigate = useNavigate();

  // Redirect if no songId is provided
  useEffect(() => {
    if (!songId) {
      navigate('/');
    }
  }, [songId, navigate]);

  // Fetch song details
  const songQuery = useQuery({
    queryKey: ['song', songId],
    queryFn: async () => {
      if (!songId) throw new Error('No song ID provided');
      console.log(`Fetching song details for song: ${songId}`);
      try {
        const response = await apiClient<SongDetails>(`/api/v1/songs/${songId}`);
        console.log("Song details response:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching song details:", error);
        throw error;
      }
    },
    enabled: !!songId,
  });

  // Fetch analysis status with polling
  const analysisQuery = useQuery({
    queryKey: ['analysis', songId],
    queryFn: async () => {
      if (!songId) throw new Error('No song ID provided');
      console.log(`Fetching analysis for song: ${songId}`);
      try {
        const response = await apiClient<AnalysisResult>(`/api/v1/songs/${songId}/analysis`);
        console.log("Analysis response:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching analysis:", error);
        throw error;
      }
    },
    enabled: !!songId,
    refetchInterval: (data) => {
      // Poll every 2 seconds until analysis is completed or failed
      return (data?.status === 'pending' || data?.status === 'processing') ? 2000 : false;
    },
  });

  // Fetch combos once analysis is completed
  const combosQuery = useQuery({
    queryKey: ['combos', songId],
    queryFn: async () => {
      if (!songId) throw new Error('No song ID provided');
      console.log(`Fetching combos for song: ${songId}`);
      try {
        const response = await apiClient<Combo[]>(`/api/v1/songs/${songId}/combos`);
        console.log("Combos response:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching combos:", error);
        throw error;
      }
    },
    enabled: !!songId && analysisQuery.data?.status === 'completed',
  });

  if (!songId) {
    return null; // Will redirect in useEffect
  }

  const isLoading = songQuery.isLoading || analysisQuery.isLoading;
  const error = songQuery.error || analysisQuery.error;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-lg shadow-sm border border-red-200">
        <h3 className="text-lg font-medium text-red-800">Error</h3>
        <p className="mt-2 text-red-700">
          {error instanceof Error ? error.message : 'An unknown error occurred'}
        </p>
        <div className="mt-4">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const analysisData = analysisQuery.data;
  const songName = songQuery.data?.originalname;

  return (
    <div>
      <div className="mb-4">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Upload
        </button>
      </div>

      {analysisData && (
        <AnalysisResultsDisplay 
          analysis={{
            ...analysisData,
            // Ensure required fields have values for display
            bpm: analysisData.bpm || 128,
            duration: analysisData.duration || 210,
            energyProfile: analysisData.energyProfile || [
              { startTime: 0, endTime: 30, level: 1 },
              { startTime: 30, endTime: 90, level: 2 },
              { startTime: 90, endTime: 150, level: 3 },
              { startTime: 150, endTime: 180, level: 2 },
              { startTime: 180, endTime: 210, level: 3 }
            ]
          }} 
          songName={songName} 
        />
      )}

      {analysisData?.status === 'completed' && (
        <ComboList
          combos={combosQuery.data || []}
          songId={songId}
          isLoading={combosQuery.isLoading}
          error={combosQuery.error instanceof Error ? combosQuery.error : null}
        />
      )}
    </div>
  );
};

export default AnalysisPage;