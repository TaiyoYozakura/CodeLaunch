import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Navbar from './components/Navbar';
import TabContent from './components/TabContent';
import { tabTimers, tabPasswords, passwordDialogDelay, reloadProtectionDuration } from './constants';
import { logError, showUserError, validatePassword, validateTabTransition } from './utils/errorHandler';

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState('kickoff');
  const [unlockedTabs, setUnlockedTabs] = useState(['kickoff']);
  const [timers, setTimers] = useState({});
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [nextTabToUnlock, setNextTabToUnlock] = useState('');
  const [tabStartTime, setTabStartTime] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
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

            if (newTimers[tab] === 0) {
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showLanding) {
    return <LandingPage onStartPlaying={handleStartPlaying} />;
  }

  return (
    <div style={{ backgroundColor: 'var(--background)', minHeight: '100vh' }}>
      <Navbar 
        activeTab={activeTab}
        unlockedTabs={unlockedTabs}
        onTabSwitch={handleTabSwitch}
        timers={timers}
        formatTime={formatTime}
      />
      <TabContent 
        activeTab={activeTab} 
        showPasswordDialog={showPasswordDialog}
        nextTabToUnlock={nextTabToUnlock}
        onPasswordSubmit={handlePasswordSubmit}
        isProcessing={isProcessing}
        error={error}
      />
    </div>
  );
}

export default App;
