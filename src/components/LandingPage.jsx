import React from 'react';
import { eventName, festName, deptName } from '../constants';

const LandingPage = ({ onStartPlaying }) => {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
      <div className="rounded-lg shadow-2xl p-8 max-w-2xl w-full mx-4" style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--primary)' }}>{eventName}</h1>
          <h2 className="text-2xl font-semibold mb-2" style={{ color: 'var(--secondary)' }}>{festName}</h2>
          <p className="text-lg" style={{ color: 'var(--muted-foreground)' }}>{deptName}</p>
        </div>
        
        <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: 'var(--muted)', borderLeft: '4px solid var(--chart-3)' }}>
          <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--accent)' }}>Rules & Regulations</h3>
          <ul className="space-y-2 text-sm" style={{ color: 'var(--foreground)' }}>
            <li>• Participants must follow all competition guidelines</li>
            <li>• No external help or collaboration allowed during the event</li>
            <li>• All submissions must be original work</li>
            <li>• Time limits must be strictly adhered to</li>
            <li>• Fair play and sportsmanship are expected</li>
          </ul>
        </div>
        
        <div className="text-center">
          <button 
            onClick={onStartPlaying}
            className="font-bold py-3 px-8 rounded-lg transition-all text-lg hover:scale-105 shadow-lg"
            style={{ backgroundColor: 'var(--secondary)', color: 'var(--secondary-foreground)' }}
          >
            🚀 Start Playing
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
