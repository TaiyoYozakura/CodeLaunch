import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Navbar from './components/Navbar';
import TabContent from './components/TabContent';
import { tabTimers, tabPasswords, passwordDialogDelay, reloadProtectionDuration, bonusRoundMessage, bonusRoundMinTime } from './constants';
import { logError, showUserError, validatePassword, validateTabTransition } from './utils/errorHandler';

function App() {
  const [showDeskInput, setShowDeskInput] = useState(true);
  const [deskNumber, setDeskNumber] = useState('');
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState('kickoff');
  const [unlockedTabs, setUnlockedTabs] = useState(['kickoff']);
  const [timers, setTimers] = useState({});
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [nextTabToUnlock, setNextTabToUnlock] = useState('');
  const [tabStartTime, setTabStartTime] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBonusDialog, setShowBonusDialog] = useState(false);
  const [showBonusRound, setShowBonusRound] = useState(false);
  const [bonusCompleteEnabled, setBonusCompleteEnabled] = useState(false);
  const [noButtonClicks, setNoButtonClicks] = useState(0);
  const [noButtonPosition, setNoButtonPosition] = useState({ top: '50vh', left: '60vw' });
  const [error, setError] = useState(null);

  const tabs = ['kickoff', 'detect', 'predict', 'transform', 'decoded'];

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleStartPlaying = () => {
    try {
      setShowLanding(false);
      initializeTimers();
      setTabStartTime(Date.now());
      localStorage.setItem('gameStartTime', Date.now().toString());
      logError('App', 'Game Started', 'INFO: Game session initiated', { timestamp: Date.now() });
    } catch (err) {
      logError('App', 'handleStartPlaying', err);
      showUserError('Failed to start the game. Please refresh and try again.');
    }
  };

  const initializeTimers = () => {
    try {
      const initialTimers = {};
      Object.keys(tabTimers).forEach(tab => {
        initialTimers[tab] = tabTimers[tab];
      });
      setTimers(initialTimers);
    } catch (err) {
      logError('App', 'initializeTimers', err, { tabTimers });
      showUserError('Failed to initialize timers.');
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      const startTime = localStorage.getItem('gameStartTime');
      if (startTime) {
        const elapsed = (Date.now() - parseInt(startTime)) / 1000;
        if (elapsed < reloadProtectionDuration) {
          e.preventDefault();
          e.returnValue = 'Are you sure you want to leave? Your progress will be lost!';
          return e.returnValue;
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  useEffect(() => {
    if (showLanding) return;

    const interval = setInterval(() => {
      setTimers(prev => {
        const newTimers = { ...prev };
        let hasChanges = false;

        Object.keys(newTimers).forEach(tab => {
          if (!unlockedTabs.includes(tab) && newTimers[tab] > 0) {
            newTimers[tab] -= 1;
            hasChanges = true;

            // Don't auto-unlock predict tab - it requires bonus round
            if (newTimers[tab] === 0 && tab !== 'predict') {
              setUnlockedTabs(current => [...current, tab]);
            }
          }
        });

        return hasChanges ? newTimers : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showLanding, unlockedTabs]);

  useEffect(() => {
    if (!tabStartTime || activeTab === 'decoded') return;

    const timer = setTimeout(() => {
      const currentIndex = tabs.indexOf(activeTab);
      const nextTab = tabs[currentIndex + 1];
      if (nextTab && !unlockedTabs.includes(nextTab)) {
        setNextTabToUnlock(nextTab);
        setShowPasswordDialog(true);
      }
    }, passwordDialogDelay * 1000);

    return () => clearTimeout(timer);
  }, [activeTab, tabStartTime, unlockedTabs]);

  const handleTabSwitch = (tabId) => {
    try {
      const validation = validateTabTransition(activeTab, tabId, unlockedTabs);
      if (!validation.isValid) {
        logError('App', 'handleTabSwitch', validation.error, { activeTab, tabId, unlockedTabs });
        showUserError(validation.error, 'warning');
        return;
      }

      setActiveTab(tabId);
      setTabStartTime(Date.now());
      setShowPasswordDialog(false);
      logError('App', 'Tab Switch', 'INFO: Tab switched successfully', { from: activeTab, to: tabId });
    } catch (err) {
      logError('App', 'handleTabSwitch', err, { tabId, activeTab });
      showUserError('Failed to switch tabs. Please try again.');
    }
  };

  const handlePasswordSubmit = async (password) => {
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      setError(null);
      
      const validation = validatePassword(password);
      if (!validation.isValid) {
        logError('App', 'handlePasswordSubmit', validation.error, { password: '***', nextTabToUnlock });
        showUserError(validation.error, 'warning');
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (password.toUpperCase() === tabPasswords[nextTabToUnlock]) {
        // Special handling for predict tab - show bonus dialog
        if (nextTabToUnlock === 'predict') {
          setShowBonusDialog(true);
          setShowPasswordDialog(false);
          return;
        }
        
        setUnlockedTabs(current => [...current, nextTabToUnlock]);
        setActiveTab(nextTabToUnlock);
        setTabStartTime(Date.now());
        setShowPasswordDialog(false);
        showUserError(`Successfully unlocked ${nextTabToUnlock} tab!`, 'success');
        logError('App', 'Password Success', 'INFO: Tab unlocked via password', { tab: nextTabToUnlock });
      } else {
        logError('App', 'Password Failed', 'Incorrect password attempt', { 
          expected: tabPasswords[nextTabToUnlock], 
          received: password.toUpperCase(),
          tab: nextTabToUnlock 
        });
        showUserError('Incorrect password! Please try again.', 'error');
      }
    } catch (err) {
      logError('App', 'handlePasswordSubmit', err, { nextTabToUnlock });
      showUserError('Failed to process password. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBonusAccept = () => {
    setShowBonusDialog(false);
    setShowBonusRound(true);
    setBonusCompleteEnabled(false);
    setNoButtonClicks(0);
    setNoButtonPosition({ top: '50vh', left: '60vw' });
    showUserError('Welcome to the Bonus Round! Good luck!', 'success');
    
    // Enable complete button after minimum time
    setTimeout(() => {
      setBonusCompleteEnabled(true);
    }, bonusRoundMinTime * 1000);
  };

  const handleBonusComplete = () => {
    if (!bonusCompleteEnabled) return;
    setShowBonusRound(false);
    setBonusCompleteEnabled(false);
    setUnlockedTabs(current => [...current, 'predict']);
    setActiveTab('predict');
    setTabStartTime(Date.now());
    showUserError('Bonus Round completed! Proceeding to Predict round.', 'success');
  };

  const handleBonusDecline = () => {
    const newClicks = noButtonClicks + 1;
    setNoButtonClicks(newClicks);
    
    if (newClicks >= 4) {
      // After 4 clicks, proceed to predict
      setUnlockedTabs(current => [...current, 'predict']);
      setActiveTab('predict');
      setTabStartTime(Date.now());
      setShowBonusDialog(false);
      setNoButtonClicks(0);
      setNoButtonPosition({ top: '50vh', left: '60vw' });
      showUserError('Proceeding to Predict round.', 'info');
    } else {
      // Move button to random position on entire screen
      const randomTop = Math.random() * 90 + 5; // 5% to 95%
      const randomLeft = Math.random() * 90 + 5; // 5% to 95%
      setNoButtonPosition({ top: `${randomTop}vh`, left: `${randomLeft}vw` });
    }
  };

  const handleDeskSubmit = (e) => {
    e.preventDefault();
    const desk = e.target.desk.value.trim();
    if (desk) {
      setDeskNumber(desk);
      setShowDeskInput(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showDeskInput) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="rounded-lg shadow-2xl p-8 max-w-md w-full mx-4" style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}>
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--primary)' }}>Enter Desk Number</h1>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Please enter your assigned desk number to continue</p>
          </div>
          <form onSubmit={handleDeskSubmit}>
            <input
              type="text"
              name="desk"
              placeholder="e.g., DESK 0101"
              className="w-full p-3 rounded-lg mb-4 focus:outline-none focus:ring-2"
              style={{ 
                backgroundColor: 'var(--background)', 
                color: 'var(--foreground)', 
                border: '1px solid var(--border)'
              }}
              autoFocus
              required
            />
            <button 
              type="submit"
              className="w-full font-bold py-3 px-6 rounded-lg transition-all hover:scale-105"
              style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (showLanding) {
    return <LandingPage onStartPlaying={handleStartPlaying} deskNumber={deskNumber} />;
  }

  return (
    <div style={{ backgroundColor: 'var(--background)', minHeight: '100vh' }}>
      <Navbar 
        activeTab={activeTab}
        unlockedTabs={unlockedTabs}
        onTabSwitch={handleTabSwitch}
        timers={timers}
        formatTime={formatTime}
        deskNumber={deskNumber}
      />
      <TabContent 
        activeTab={activeTab} 
        showPasswordDialog={showPasswordDialog}
        nextTabToUnlock={nextTabToUnlock}
        onPasswordSubmit={handlePasswordSubmit}
        isProcessing={isProcessing}
        error={error}
      />
      
      {showBonusRound && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg max-w-4xl mx-4 w-full max-h-[90vh] overflow-y-auto" style={{ backgroundColor: 'var(--card)', color: 'var(--foreground)' }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold" style={{ color: 'var(--chart-6)' }}>🎯 Bonus Round - Ultimate Challenge</h2>
              <button
                onClick={handleBonusComplete}
                disabled={!bonusCompleteEnabled}
                className="px-4 py-2 rounded-lg font-bold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  backgroundColor: bonusCompleteEnabled ? 'var(--destructive)' : 'var(--muted)', 
                  color: bonusCompleteEnabled ? 'var(--destructive-foreground)' : 'var(--muted-foreground)'
                }}
              >
                ✅ Complete & Continue
              </button>
            </div>
            <p className="mb-6" style={{ color: 'var(--muted-foreground)' }}>Face the ultimate coding challenge that only legends have conquered!</p>
            
            <TabContent 
              activeTab="bonus" 
              showPasswordDialog={false}
              nextTabToUnlock=""
              onPasswordSubmit={() => {}}
              isProcessing={false}
              error={null}
            />
          </div>
        </div>
      )}
      
      {showBonusDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg max-w-md mx-4 text-center relative" style={{ backgroundColor: 'var(--card)', color: 'var(--foreground)' }}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--primary)' }}>{bonusRoundMessage.title}</h2>
            <p className="mb-4">{bonusRoundMessage.message}</p>
            <p className="mb-4 text-yellow-600 dark:text-yellow-400">{bonusRoundMessage.warning}</p>
            <p className="mb-6 font-semibold">{bonusRoundMessage.question}</p>
            <div className="flex gap-4 justify-center relative">
              <button
                onClick={handleBonusAccept}
                className="px-6 py-2 rounded-lg font-bold transition-all hover:scale-105"
                style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
              >
                🍗 Yes, I'm Ready!
              </button>
            </div>
            <button
              onClick={handleBonusDecline}
              className="px-6 py-2 rounded-lg font-bold transition-all hover:scale-105 fixed z-[60]"
              style={{ 
                backgroundColor: 'var(--secondary)', 
                color: 'var(--secondary-foreground)',
                top: noButtonPosition.top,
                left: noButtonPosition.left,
                transform: 'translate(-50%, -50%)'
              }}
            >
              ❌ No, Skip
            </button>
            {noButtonClicks > 0 && (
              <p className="mt-4 text-sm text-red-500">😏 Nice try! Click {4 - noButtonClicks} more times to skip!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
