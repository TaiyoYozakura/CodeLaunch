import { tabColors } from '../constants';

export const getAccentColor = (tab) => {
  const colorMap = {
    cyan: {
      css: 'var(--chart-1)'
    },
    violet: {
      css: 'var(--chart-3)'
    },
    blue: {
      css: 'var(--accent)'
    },
    amber: {
      css: 'var(--chart-4)'
    },
    green: {
      css: 'var(--chart-2)'
    }
  };
  
  return colorMap[tabColors[tab]] || colorMap.cyan;
};

export const getTimerState = (timeLeft, totalTime) => {
  const percentage = (timeLeft / totalTime) * 100;
  
  if (timeLeft <= 30) {
    return { state: 'critical', color: 'var(--destructive)', pulse: true };
  } else if (percentage <= 20) {
    return { state: 'warning', color: 'var(--chart-4)', pulse: false };
  } else {
    return { state: 'normal', color: '', pulse: false };
  }
};