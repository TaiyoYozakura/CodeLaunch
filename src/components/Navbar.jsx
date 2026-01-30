import React from 'react';
import { navText } from '../constants';

const Navbar = ({ activeTab, unlockedTabs, onTabSwitch, timers, formatTime, deskNumber }) => {
  const tabs = [
    { id: 'kickoff', name: 'KickOff', color: 'var(--chart-1)' },
    { id: 'detect', name: 'Detect', color: 'var(--chart-2)' },
    { id: 'predict', name: 'Predict', color: 'var(--chart-3)' },
    { id: 'transform', name: 'Transform', color: 'var(--chart-4)' },
    { id: 'decoded', name: 'Decoded', color: 'var(--chart-5)' }
  ];

  return (
    <nav style={{ backgroundColor: 'var(--card)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
      <div className="text-center py-4 relative" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="absolute top-2 right-4">
          <div className="text-4xl font-black px-4 py-2 rounded-lg" style={{ 
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))', 
            color: 'white',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            border: '2px solid var(--border)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}>
            {deskNumber}
          </div>
        </div>
        <h1 className="text-xl font-bold mb-2" style={{ background: 'linear-gradient(90deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{navText}</h1>
        <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} - CodeLaunch
        </h2>
      </div>
      <div className="flex w-full">
        {tabs.map((tab) => {
          const isUnlocked = unlockedTabs.includes(tab.id);
          const isActive = activeTab === tab.id;
          const timeLeft = timers[tab.id];
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabSwitch(tab.id)}
              disabled={!isUnlocked}
              className="flex-1 py-3 px-2 text-center font-medium transition-all"
              style={{
                backgroundColor: isActive ? 'var(--secondary)' : isUnlocked ? 'var(--muted)' : 'var(--background)',
                color: isActive ? 'var(--secondary-foreground)' : isUnlocked ? 'var(--foreground)' : 'var(--muted-foreground)',
                borderBottom: isActive ? '4px solid var(--secondary)' : '4px solid transparent',
                opacity: isUnlocked ? 1 : 0.5,
                cursor: isUnlocked ? 'pointer' : 'not-allowed',
                transform: isUnlocked && !isActive ? 'translateY(0)' : undefined
              }}
              onMouseEnter={(e) => {
                if (isUnlocked && !isActive) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.backgroundColor = tab.color;
                }
              }}
              onMouseLeave={(e) => {
                if (isUnlocked && !isActive) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.backgroundColor = 'var(--muted)';
                }
              }}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="flex items-center gap-1">
                  <span>{isUnlocked ? '🔓' : '🔒'}</span> {tab.name}
                </span>
                {!isUnlocked && timeLeft > 0 && (
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)', animation: timeLeft < 60 ? 'pulse-low 2s infinite' : undefined }}>
                    {formatTime(timeLeft)}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
