import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';

const CompletionPage = () => {
  const navigate = useNavigate();
  const { state, actions } = useSession();
  const [results, setResults] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Export results when component mounts
    const exportedResults = actions.exportResults();
    setResults(exportedResults);
  }, []);

  const handleStartOver = () => {
    actions.resetSession();
    navigate('/');
  };

  const handleDownloadResults = () => {
    if (!results) return;

    const dataStr = JSON.stringify(results, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `naadvriksha_results_${results.sessionInfo.sessionId}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your results...</p>
        </div>
      </div>
    );
  }

  const { sessionInfo, summary, taskResults } = results;

  // Safety checks for undefined values
  const safeOverallAccuracy = summary?.overallAccuracy ?? 0;
  const safeAverageResponseTime = summary?.averageResponseTime ?? 0;
  const safeTotalCorrect = summary?.totalCorrect ?? 0;
  const safeCompletedTasks = summary?.completedTasks ?? 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Assessment Complete!</h1>
          <p className="text-xl text-gray-600">
            Thank you for participating in the NaadVriksha cognitive assessment.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {safeCompletedTasks}
              </div>
              <div className="text-sm text-gray-600">Tasks Completed</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {safeTotalCorrect}
              </div>
              <div className="text-sm text-gray-600">Correct Answers</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {safeOverallAccuracy.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Overall Accuracy</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {(safeAverageResponseTime / 1000).toFixed(1)}s
              </div>
              <div className="text-sm text-gray-600">Avg Response Time</div>
            </div>
          </div>
        </div>

        {/* Task Results */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Task Performance</h2>
            
            <div className="space-y-6">
              {taskResults && Object.entries(taskResults).map(([taskType, taskData]) => {
                const taskNames = {
                  math: 'Math Task',
                  stroop: 'Stroop Task',
                  captcha: 'CAPTCHA Task'
                };
                
                const taskColors = {
                  math: 'blue',
                  stroop: 'green',
                  captcha: 'purple'
                };
                
                const color = taskColors[taskType];
                
                // Safety checks for task data
                const safeTaskData = {
                  totalQuestions: taskData?.totalQuestions ?? 0,
                  totalCorrect: taskData?.totalCorrect ?? 0,
                  accuracy: taskData?.accuracy ?? 0,
                  averageResponseTime: taskData?.averageResponseTime ?? 0,
                  isCompleted: taskData?.isCompleted ?? false
                };
                
                return (
                  <div key={taskType} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`text-lg font-semibold text-${color}-600`}>
                        {taskNames[taskType]}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        safeTaskData.isCompleted 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {safeTaskData.isCompleted ? 'Completed' : 'Incomplete'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className={`text-2xl font-bold text-${color}-600`}>
                          {safeTaskData.totalQuestions}
                        </div>
                        <div className="text-sm text-gray-600">Questions</div>
                      </div>
                      
                      <div className="text-center">
                        <div className={`text-2xl font-bold text-${color}-600`}>
                          {safeTaskData.totalCorrect}
                        </div>
                        <div className="text-sm text-gray-600">Correct</div>
                      </div>
                      
                      <div className="text-center">
                        <div className={`text-2xl font-bold text-${color}-600`}>
                          {safeTaskData.accuracy.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-600">Accuracy</div>
                      </div>
                      
                      <div className="text-center">
                        <div className={`text-2xl font-bold text-${color}-600`}>
                          {(safeTaskData.averageResponseTime / 1000).toFixed(1)}s
                        </div>
                        <div className="text-sm text-gray-600">Avg Time</div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{safeTaskData.totalCorrect}/{safeTaskData.totalQuestions}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`bg-${color}-500 h-2 rounded-full transition-all duration-300`}
                          style={{ width: `${Math.min(safeTaskData.accuracy, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Session Details */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Session Details</h2>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {showDetails ? 'Hide Details' : 'Show Details'}
              </button>
            </div>
            
            {showDetails && (
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-gray-700">Session ID:</span>
                    <span className="ml-2 text-gray-600 font-mono">{sessionInfo?.sessionId || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Start Time:</span>
                    <span className="ml-2 text-gray-600">
                      {sessionInfo?.startTime ? new Date(sessionInfo.startTime).toLocaleString() : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Completion Time:</span>
                    <span className="ml-2 text-gray-600">
                      {sessionInfo?.completionTime ? new Date(sessionInfo.completionTime).toLocaleString() : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Total Duration:</span>
                    <span className="ml-2 text-gray-600">
                      {sessionInfo?.startTime && sessionInfo?.completionTime 
                        ? Math.round((new Date(sessionInfo.completionTime) - new Date(sessionInfo.startTime)) / 1000 / 60)
                        : 0
                      } minutes
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">What's Next?</h2>
            
            <div className="space-y-4">
              <button
                onClick={handleDownloadResults}
                className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors mr-0 md:mr-4 mb-4 md:mb-0"
              >
                Download Results
              </button>
              
              <button
                onClick={handleStartOver}
                className="w-full md:w-auto px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
              >
                Start New Assessment
              </button>
            </div>
            
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Thank you for your participation!</strong> Your data contributes to our research 
                on Plant-Computer Interaction and human cognitive assessment. The results have been 
                saved locally and can be downloaded for your records.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500">
          <p className="text-sm">
            NaadVriksha Research Project - Cognitive Assessment Platform
          </p>
          <p className="text-xs mt-2">
            Data is stored locally on your device and is not transmitted to external servers.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default CompletionPage;