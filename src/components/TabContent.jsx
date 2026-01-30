import React, { useState } from 'react';
import { ButtonLoading } from './LoadingStates';
import { getRandomQuestion } from '../finalDraftedQuestions';
import { oneCompilerUrls, sampleTableData } from '../constants';

const TabContent = ({ activeTab, showPasswordDialog, nextTabToUnlock, onPasswordSubmit, isProcessing, error }) => {
  const [currentQuestion, setCurrentQuestion] = useState(null);

  // Clear question when tab changes
  React.useEffect(() => {
    setCurrentQuestion(null);
  }, [activeTab]);

  const getTabContent = (tab) => {
    const tabData = {
      kickoff: {
        title: 'KickOff - Code Writing',
        description: 'Start your coding journey with simple programming problems.',
        chartColor: 'var(--chart-1)'
      },
      detect: {
        title: 'Detect - Debug & Fix',
        description: 'Identify and fix errors, typos, and bugs in the given code.',
        chartColor: 'var(--chart-2)'
      },
      bonus: {
        title: 'Bonus - Ultimate Challenge',
        description: 'Face the legendary coding challenge that only the greatest have conquered!',
        chartColor: 'var(--chart-6)'
      },
      predict: {
        title: 'Predict - Output Guessing',
        description: 'Predict the output of given code snippets without running them.',
        chartColor: 'var(--chart-3)'
      },
      transform: {
        title: 'Transform - Code Modification',
        description: 'Modify existing code to accomplish a new specified task.',
        chartColor: 'var(--chart-4)'
      },
      decoded: {
        title: 'Decoded - Algorithm Explanation',
        description: 'Explain the logic and working of complex algorithms.',
        chartColor: 'var(--chart-5)'
      }
    };
    
    return tabData[tab] || tabData.kickoff;
  };

  const handleGetQuestion = () => {
    const question = getRandomQuestion(activeTab);
    setCurrentQuestion(question);
  };

  const handleOpenSandbox = () => {
    if (!currentQuestion) {
      alert('Please get a question first!');
      return;
    }
    
    const url = oneCompilerUrls[currentQuestion.fileExtension] || oneCompilerUrls.py;
    window.open(url, '_blank');
  };

  const content = getTabContent(activeTab);

  return (
    <div className="p-8" style={{ backgroundColor: 'var(--background)', minHeight: 'calc(100vh - 140px)' }}>
      <div className="p-8 rounded-lg shadow-md max-w-4xl mx-auto relative" style={{ backgroundColor: 'var(--card)' }}>
        {error && (
          <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--destructive)', color: 'var(--destructive-foreground)', border: '2px solid var(--destructive)' }}>
            <p className="text-sm">
              ❌ <strong>Error:</strong> {error}
            </p>
          </div>
        )}
        
        <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--primary)' }}>{content.title}</h2>
        <p className="mb-6" style={{ color: 'var(--muted-foreground)' }}>{content.description}</p>
        
        {currentQuestion && (
          <div className="p-4 rounded mb-6" style={{ backgroundColor: 'var(--muted)', borderLeft: `4px solid ${content.chartColor}` }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold" style={{ color: content.chartColor }}>{currentQuestion.title}</h3>
              <div className="flex gap-2">
                <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: content.chartColor, color: 'var(--primary-foreground)' }}>
                  {currentQuestion.fileExtension?.toUpperCase() || 'TXT'}
                </span>
                <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: 'var(--background)', color: 'var(--muted-foreground)' }}>
                  {currentQuestion.difficulty}
                </span>
              </div>
            </div>
            <p style={{ color: 'var(--foreground)' }}>{currentQuestion.description}</p>
            
            {currentQuestion.isDBQuestion && (
              <div className="mt-4 p-3 rounded" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}>
                <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--chart-2)' }}>📊 Sample Table Data:</h4>
                <pre className="text-xs overflow-x-auto" style={{ color: 'var(--muted-foreground)' }}>{sampleTableData}</pre>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-4 justify-center mb-6">
          <button
            onClick={handleGetQuestion}
            className="font-bold py-3 px-6 rounded-lg transition-all hover:scale-105 shadow-lg"
            style={{ backgroundColor: 'var(--secondary)', color: 'var(--secondary-foreground)' }}
          >
            🎲 Get Question
          </button>
          <button
            onClick={handleOpenSandbox}
            className="font-bold py-3 px-6 rounded-lg transition-all hover:scale-105 shadow-lg"
            style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}
          >
            💻 Open Sandbox
          </button>
        </div>
        
        {showPasswordDialog && (
          <div className="rounded-lg p-6 mb-6" style={{ backgroundColor: 'var(--muted)', border: '2px solid var(--chart-4)' }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--chart-4)' }}>
              🎉 Excellent Work! Challenge Completed! 🎉
            </h3>
            <p className="mb-4" style={{ color: 'var(--foreground)' }}>
              Enter the password to unlock the next tab:
            </p>
            <form onSubmit={(e) => {
              e.preventDefault();
              const password = e.target.password.value.trim();
              if (password) {
                onPasswordSubmit(password);
                e.target.reset();
              }
            }}>
              <div className="flex gap-3">
                <input
                  type="text"
                  name="password"
                  placeholder="Enter password"
                  className="flex-1 p-3 rounded-lg focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: 'var(--background)', 
                    color: 'var(--foreground)', 
                    border: '1px solid var(--border)'
                  }}
                  autoFocus
                  disabled={isProcessing}
                  maxLength={20}
                />
                <ButtonLoading
                  type="submit"
                  isLoading={isProcessing}
                  className="font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-50 hover:scale-105"
                  style={{ backgroundColor: 'var(--chart-4)', color: 'var(--destructive-foreground)' }}
                >
                  Unlock
                </ButtonLoading>
              </div>
            </form>
          </div>
        )}
        
        {activeTab !== 'decoded' && !showPasswordDialog && (
          <div className="mt-6 p-4 rounded" style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--chart-2)', borderLeft: '4px solid var(--chart-2)' }}>
            <p className="text-sm" style={{ color: 'var(--foreground)' }}>
              💡 <strong style={{ color: 'var(--chart-2)' }}>Competition Tip:</strong> Complete the coding challenge above to unlock the next challenge early!
            </p>
          </div>
        )}
        
        {activeTab === 'decoded' && (
          <div className="mt-6 p-4 rounded" style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--chart-3)', borderLeft: '4px solid var(--chart-3)' }}>
            <p className="text-sm" style={{ color: 'var(--foreground)' }}>
              🏆 <strong style={{ color: 'var(--chart-3)' }}>Final Challenge:</strong> This is the last stage of CODE EVOLUTION 2026. Give your best explanation!
            </p>
          </div>
        )}

        {activeTab === 'decoded' && (
          <div className="mt-8 pt-4 border-t text-center" style={{ borderColor: 'var(--border)' }}>
            <p className="text-sm opacity-60" style={{ color: 'var(--muted-foreground)' }}>
              Crafted by <span className="font-bold" style={{ color: 'var(--primary)' }}>Lord Aizen</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabContent;