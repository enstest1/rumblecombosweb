import React from 'react';
import FileUpload from '../components/FileUpload';

const HomePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Upload Your Music</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Upload an MP3 file to analyze and generate boxing combos synchronized to the beat.
          Our system will detect BPM and energy levels to create perfect Rumble combos.
        </p>
      </div>
      
      <FileUpload />
      
      <div className="mt-12 bg-blue-50 rounded-lg p-6 border border-blue-100">
        <h3 className="text-lg font-medium text-blue-900 mb-3">How It Works</h3>
        <ol className="list-decimal pl-5 text-blue-800 space-y-2">
          <li>
            <span className="text-gray-700">Upload an MP3 file (up to 15MB)</span>
          </li>
          <li>
            <span className="text-gray-700">Our system analyzes the BPM and energy patterns</span>
          </li>
          <li>
            <span className="text-gray-700">Boxing combos are generated to match the music</span>
          </li>
          <li>
            <span className="text-gray-700">Regenerate any combo you don't like</span>
          </li>
          <li>
            <span className="text-gray-700">Copy combos to use in your Rumble workout</span>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default HomePage;