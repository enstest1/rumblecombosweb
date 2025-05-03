import React from 'react';

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

interface AnalysisResultsDisplayProps {
  analysis: AnalysisResult;
  songName?: string;
}

const AnalysisResultsDisplay: React.FC<AnalysisResultsDisplayProps> = ({ analysis, songName }) => {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (analysis.status === 'pending' || analysis.status === 'processing') {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <div className="text-lg font-medium text-gray-900">Analyzing music...</div>
        </div>
        <p className="mt-3 text-gray-500 text-center">
          Please wait while we analyze your track. This may take a minute.
        </p>
      </div>
    );
  }

  if (analysis.status === 'failed') {
    return (
      <div className="bg-red-50 p-6 rounded-lg shadow-sm border border-red-200">
        <h3 className="text-lg font-medium text-red-800">Analysis Failed</h3>
        <p className="mt-2 text-red-700">
          {analysis.error || 'An unknown error occurred during analysis'}
        </p>
        <div className="mt-4">
          <button
            onClick={() => window.location.href = '/'}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Try Again with Another Track
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Analysis Results</h3>
          {songName && (
            <p className="text-gray-500">{songName}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-md">
            <div className="text-sm font-medium text-blue-700">Tempo (BPM)</div>
            <div className="mt-1 text-2xl font-bold">{analysis.bpm || 'N/A'}</div>
            {analysis.variableBpm && (
              <div className="mt-1 text-xs text-blue-600">Variable BPM detected</div>
            )}
          </div>

          <div className="bg-blue-50 p-4 rounded-md">
            <div className="text-sm font-medium text-blue-700">Duration</div>
            <div className="mt-1 text-2xl font-bold">
              {analysis.duration ? formatTime(analysis.duration) : 'N/A'}
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-md">
            <div className="text-sm font-medium text-blue-700">Energy Segments</div>
            <div className="mt-1 text-2xl font-bold">
              {analysis.energyProfile?.length || 'N/A'}
            </div>
          </div>
        </div>

        {analysis.energyProfile && analysis.energyProfile.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Energy Profile</h4>
            <div className="h-10 bg-gray-200 rounded-md overflow-hidden flex">
              {analysis.energyProfile.map((segment, index) => {
                const width = analysis.duration
                  ? ((segment.endTime - segment.startTime) / analysis.duration) * 100
                  : 0;
                
                let bgColor = 'bg-green-300';
                if (segment.level === 2) bgColor = 'bg-yellow-400';
                if (segment.level === 3) bgColor = 'bg-red-500';
                
                return (
                  <div
                    key={index}
                    className={`${bgColor} h-full relative group`}
                    style={{ width: `${width}%` }}
                    title={`${formatTime(segment.startTime)} - ${formatTime(segment.endTime)}: Level ${segment.level}`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-20">
                      <span className="text-xs text-white font-bold px-1">
                        {segment.level}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>0:00</span>
              <span>{analysis.duration ? formatTime(analysis.duration) : ''}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisResultsDisplay;