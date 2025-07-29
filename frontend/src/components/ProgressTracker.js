import React from 'react';

const ProgressTracker = ({ 
  current, 
  total, 
  taskName = 'Task',
  showPercentage = true,
  showSteps = true,
  variant = 'default',
  size = 'medium'
}) => {
  // Ensure current doesn't exceed total and handle edge cases
  const safeCurrent = Math.min(Math.max(current, 0), total);
  const safeTotal = Math.max(total, 1);
  
  // Calculate completion percentage
  const completionPercentage = Math.round((safeCurrent / safeTotal) * 100);
  
  // Size configurations
  const sizeConfig = {
    small: {
      height: 'h-2',
      text: 'text-sm',
      spacing: 'space-y-1'
    },
    medium: {
      height: 'h-3',
      text: 'text-base',
      spacing: 'space-y-2'
    },
    large: {
      height: 'h-4',
      text: 'text-lg',
      spacing: 'space-y-3'
    }
  };

  // Variant configurations
  const variantConfig = {
    default: {
      bg: 'bg-gray-200',
      fill: 'bg-blue-500',
      text: 'text-gray-700'
    },
    success: {
      bg: 'bg-gray-200',
      fill: 'bg-green-500',
      text: 'text-green-700'
    },
    warning: {
      bg: 'bg-gray-200',
      fill: 'bg-yellow-500',
      text: 'text-yellow-700'
    },
    error: {
      bg: 'bg-gray-200',
      fill: 'bg-red-500',
      text: 'text-red-700'
    }
  };

  const config = sizeConfig[size] || sizeConfig.medium;
  const colors = variantConfig[variant] || variantConfig.default;

  // Generate step indicators for visual representation
  const generateStepIndicators = () => {
    const steps = [];
    const maxStepsToShow = Math.min(safeTotal, 20); // Limit visual steps for large totals
    const stepInterval = safeTotal > 20 ? Math.ceil(safeTotal / 20) : 1;
    
    for (let i = 0; i < maxStepsToShow; i++) {
      const stepNumber = i * stepInterval + 1;
      const isCompleted = stepNumber <= safeCurrent;
      const isCurrent = stepNumber === safeCurrent + 1;
      
      steps.push(
        <div
          key={i}
          className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
            isCompleted
              ? `${colors.fill} border-transparent`
              : isCurrent
              ? `bg-white border-blue-500 ring-2 ring-blue-200`
              : `bg-white border-gray-300`
          }`}
          title={`Step ${stepNumber}`}
        />
      );
    }
    
    return steps;
  };

  return (
    <div className={`w-full ${config.spacing}`}>
      {/* Header with task name and progress info */}
      <div className="flex justify-between items-center">
        <h3 className={`font-semibold ${colors.text} ${config.text}`}>
          {taskName}
        </h3>
        <div className={`${config.text} ${colors.text}`}>
          {showSteps && (
            <span className="font-medium">
              {safeCurrent} / {safeTotal}
            </span>
          )}
          {showPercentage && showSteps && <span className="mx-2">•</span>}
          {showPercentage && (
            <span className="font-medium">
              {completionPercentage}%
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className={`w-full ${colors.bg} rounded-full ${config.height} overflow-hidden`}>
        <div
          className={`${config.height} ${colors.fill} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${completionPercentage}%` }}
        />
      </div>

      {/* Step indicators (for smaller totals) */}
      {showSteps && safeTotal <= 20 && (
        <div className="flex justify-between items-center mt-2">
          {generateStepIndicators()}
        </div>
      )}

      {/* Current step indicator for larger totals */}
      {safeTotal > 20 && (
        <div className="flex justify-center mt-2">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            completionPercentage === 100 
              ? 'bg-green-100 text-green-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {completionPercentage === 100 ? 'Completed' : `Question ${safeCurrent + 1}`}
          </div>
        </div>
      )}

      {/* Completion message */}
      {completionPercentage === 100 && (
        <div className="flex items-center justify-center mt-2">
          <div className="flex items-center space-x-2 text-green-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className={`font-medium ${config.text}`}>
              {taskName} Complete!
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;