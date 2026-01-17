// Error handling utilities for better debugging and user experience

export const logError = (component, action, error, context = {}) => {
  const errorInfo = {
    timestamp: new Date().toISOString(),
    component,
    action,
    error: error.message || error,
    stack: error.stack,
    context,
    userAgent: navigator.userAgent,
    url: window.location.href
  };
  
  console.group(`🚨 ERROR in ${component}`);
  console.error(`Action: ${action}`);
  console.error(`Error:`, error);
  console.error(`Context:`, context);
  console.error(`Full Info:`, errorInfo);
  console.groupEnd();
  
  // In production, you could send this to an error tracking service
  // sendToErrorService(errorInfo);
  
  return errorInfo;
};

export const showUserError = (message, type = 'error') => {
  // For now using alert, but can be replaced with toast notifications
  const icons = {
    error: '❌',
    warning: '⚠️',
    success: '✅',
    info: 'ℹ️'
  };
  
  alert(`${icons[type]} ${message}`);
};

export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, error: 'Password cannot be empty' };
  }
  
  if (password.length < 3) {
    return { isValid: false, error: 'Password too short' };
  }
  
  return { isValid: true };
};

export const validateTabTransition = (currentTab, targetTab, unlockedTabs) => {
  if (!targetTab) {
    return { isValid: false, error: 'Target tab not specified' };
  }
  
  if (!unlockedTabs.includes(targetTab)) {
    return { isValid: false, error: `Tab '${targetTab}' is still locked` };
  }
  
  return { isValid: true };
};