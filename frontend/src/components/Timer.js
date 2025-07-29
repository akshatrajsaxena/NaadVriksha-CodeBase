import React, { useState, useEffect, useRef } from 'react';
import { TimerService } from '../services/TimerService';

const Timer = ({ 
  duration = 15, 
  onExpire, 
  isActive = false, 
  onTick = null,
  showProgress = true,
  size = 'medium' 
}) => {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const timerServiceRef = useRef(null);

  // Initialize timer service
  useEffect(() => {
    timerServiceRef.current = new TimerService();
    
    return () => {
      if (timerServiceRef.current) {
        timerServiceRef.current.cleanup();
      }
    };
  }, []);

  // Handle timer activation/deactivation
  useEffect(() => {
    if (isActive) {
      startTimer();
    } else {
      stopTimer();
    }
  }, [isActive, duration]);

  // Reset timer when duration changes
  useEffect(() => {
    setTimeRemaining(duration);
    if (timerServiceRef.current && isRunning) {
      startTimer();
    }
  }, [duration]);

  const startTimer = () => {
    if (timerServiceRef.current) {
      setIsRunning(true);
      timerServiceRef.current.startTimer(
        duration,
        handleExpire,
        handleTick
      );
    }
  };

  const stopTimer = () => {
    if (timerServiceRef.current) {
      timerServiceRef.current.resetTimer();
      setIsRunning(false);
      setTimeRemaining(duration);
    }
  };

  const handleTick = (time) => {
    setTimeRemaining(time);
    if (onTick) {
      onTick(time);
    }
  };

  const handleExpire = () => {
    setIsRunning(false);
    setTimeRemaining(0);
    if (onExpire) {
      onExpire();
    }
  };

  // Calculate progress percentage
  const progressPercentage = duration > 0 ? ((duration - timeRemaining) / duration) * 100 : 0;
  
  // Determine color based on time remaining
  const getTimerColor = () => {
    const percentage = (timeRemaining / duration) * 100;
    if (percentage > 60) return 'text-green-600';
    if (percentage > 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = () => {
    const percentage = (timeRemaining / duration) * 100;
    if (percentage > 60) return 'bg-green-500';
    if (percentage > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Size configurations
  const sizeConfig = {
    small: {
      container: 'w-16 h-16',
      text: 'text-sm',
      strokeWidth: '4'
    },
    medium: {
      container: 'w-20 h-20',
      text: 'text-lg',
      strokeWidth: '6'
    },
    large: {
      container: 'w-24 h-24',
      text: 'text-xl',
      strokeWidth: '8'
    }
  };

  const config = sizeConfig[size] || sizeConfig.medium;
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center space-y-2">
      {/* Circular Progress Timer */}
      <div className={`relative ${config.container}`}>
        <svg
          className="transform -rotate-90 w-full h-full"
          viewBox="0 0 100 100"
        >
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="currentColor"
            strokeWidth={config.strokeWidth}
            fill="transparent"
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="currentColor"
            strokeWidth={config.strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`transition-all duration-1000 ease-linear ${getProgressColor()}`}
          />
        </svg>
        
        {/* Timer text overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold ${config.text} ${getTimerColor()}`}>
            {timeRemaining}
          </span>
        </div>
      </div>

      {/* Linear progress bar (optional) */}
      {showProgress && (
        <div className="w-full max-w-xs">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-1000 ease-linear ${getProgressColor()}`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0s</span>
            <span>{duration}s</span>
          </div>
        </div>
      )}

      {/* Timer status indicator */}
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
        <span className="text-xs text-gray-600">
          {isRunning ? 'Active' : 'Inactive'}
        </span>
      </div>
    </div>
  );
};

export default Timer;