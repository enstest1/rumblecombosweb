import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Upload mutation using the apiClient
  const uploadMutation = useMutation({
    mutationFn: async (fileToUpload: File) => {
      console.log('Starting file upload for:', fileToUpload.name);
      
      const formData = new FormData();
      formData.append('file', fileToUpload);
      
      console.log('FormData created with file appended');
      
      try {
        const response = await apiClient<{ songId: string; status: string }>('/api/v1/songs', {
          method: 'POST',
          body: formData,
          // Don't set Content-Type header - browser will set it with boundary
          headers: {},
        });
        
        console.log('Upload successful, received response:', response);
        return response.data;
      } catch (err) {
        console.error('Upload failed:', err);
        throw err;
      }
    },
    onSuccess: (data) => {
      console.log('Upload mutation succeeded, navigating to analysis page');
      // Navigate to the analysis page on success
      navigate(`/analysis/${data.songId}`);
    },
    onError: (error: any) => {
      console.error('Upload mutation error:', error);
      setError(error.message || 'Failed to upload file');
    },
  });

  // Handle file selection from the file input
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    validateAndSetFile(selectedFile);
  };

  // Handle file drop for drag and drop functionality
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    
    const droppedFile = event.dataTransfer.files?.[0];
    validateAndSetFile(droppedFile);
  };

  // Validate the file type and size
  const validateAndSetFile = (selectedFile?: File) => {
    setError(null);
    
    if (!selectedFile) {
      setFile(null);
      return;
    }
    
    // Check file type
    if (!selectedFile.type.includes('audio/mpeg') && !selectedFile.name.toLowerCase().endsWith('.mp3')) {
      setError('Only MP3 files are supported');
      setFile(null);
      return;
    }
    
    // Check file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError(`File is too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
      setFile(null);
      return;
    }
    
    setFile(selectedFile);
  };

  // Handle click on the upload area to trigger file input
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Handle submit to upload the file
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!file) {
      setError('Please select a file');
      return;
    }
    
    uploadMutation.mutate(file);
  };

  // Drag and drop handlers
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragging 
              ? 'border-blue-500 bg-blue-50' 
              : file 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-300 hover:border-gray-400'
          }`}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="audio/mpeg,.mp3"
            className="hidden"
          />
          
          {file ? (
            <div className="py-4">
              <div className="text-green-600 mb-2">File selected:</div>
              <div className="text-lg font-medium">{file.name}</div>
              <div className="text-gray-500 text-sm mt-1">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </div>
            </div>
          ) : (
            <div className="py-8">
              <svg 
                className="mx-auto h-12 w-12 text-gray-400" 
                stroke="currentColor" 
                fill="none" 
                viewBox="0 0 48 48" 
                aria-hidden="true"
              >
                <path 
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4h-8m-12 0H8m12 0a4 4 0 01-4-4v-4m0 0h12m0 0v-4a4 4 0 014-4h4" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                />
              </svg>
              <p className="mt-2 text-sm text-gray-600">
                <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
              </p>
              <p className="mt-1 text-xs text-gray-500">MP3 up to 15MB</p>
            </div>
          )}
        </div>
        
        {error && (
          <div className="mt-3 text-red-600 text-sm">{error}</div>
        )}
        
        <div className="mt-6">
          <button
            type="submit"
            disabled={!file || uploadMutation.isPending}
            className={`w-full py-3 px-4 rounded-md shadow-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              !file || uploadMutation.isPending
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {uploadMutation.isPending ? (
              <>
                <span className="inline-block animate-spin mr-2">&#8635;</span>
                Uploading...
              </>
            ) : (
              'Upload & Analyze'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FileUpload;