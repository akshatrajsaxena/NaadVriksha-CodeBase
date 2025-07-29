import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Action types
const SESSION_ACTIONS = {
  INITIALIZE_SESSION: 'INITIALIZE_SESSION',
  START_TASK: 'START_TASK',
  COMPLETE_TASK: 'COMPLETE_TASK',
  RECORD_RESPONSE: 'RECORD_RESPONSE',
  UPDATE_PROGRESS: 'UPDATE_PROGRESS',
  RESET_SESSION: 'RESET_SESSION',
  LOAD_FROM_STORAGE: 'LOAD_FROM_STORAGE'
};

// Initial state
const initialState = {
  sessionId: null,
  startTime: null,
  currentTask: 'home', // 'home', 'math', 'stroop', 'captcha', 'complete'
  tasks: {
    math: {
      taskType: 'math',
      startTime: null,
      endTime: null,
      currentQuestion: 0,
      questions: [],
      totalCorrect: 0,
      totalAttempted: 0,
      averageResponseTime: 0,
      isCompleted: false
    },
    stroop: {
      taskType: 'stroop',
      startTime: null,
      endTime: null,
      currentQuestion: 0,
      questions: [],
      totalCorrect: 0,
      totalAttempted: 0,
      averageResponseTime: 0,
      isCompleted: false
    },
    captcha: {
      taskType: 'captcha',
      startTime: null,
      endTime: null,
      currentQuestion: 0,
      questions: [],
      totalCorrect: 0,
      totalAttempted: 0,
      averageResponseTime: 0,
      isCompleted: false
    }
  },
  isCompleted: false
};

// Reducer function
const sessionReducer = (state, action) => {
  switch (action.type) {
    case SESSION_ACTIONS.INITIALIZE_SESSION:
      return {
        ...state,
        sessionId: action.payload.sessionId,
        startTime: action.payload.startTime,
        currentTask: 'home'
      };

    case SESSION_ACTIONS.START_TASK:
      return {
        ...state,
        currentTask: action.payload.taskType,
        tasks: {
          ...state.tasks,
          [action.payload.taskType]: {
            ...state.tasks[action.payload.taskType],
            startTime: action.payload.startTime,
            currentQuestion: 0
          }
        }
      };

    case SESSION_ACTIONS.COMPLETE_TASK:
      const updatedTasks = {
        ...state.tasks,
        [action.payload.taskType]: {
          ...state.tasks[action.payload.taskType],
          endTime: action.payload.endTime,
          isCompleted: true
        }
      };

      // Determine next task
      let nextTask = 'complete';
      if (action.payload.taskType === 'math' && !updatedTasks.stroop.isCompleted) {
        nextTask = 'stroop';
      } else if (action.payload.taskType === 'stroop' && !updatedTasks.captcha.isCompleted) {
        nextTask = 'captcha';
      }

      // Check if all tasks are completed
      const allCompleted = updatedTasks.math.isCompleted && 
                          updatedTasks.stroop.isCompleted && 
                          updatedTasks.captcha.isCompleted;

      return {
        ...state,
        currentTask: nextTask,
        tasks: updatedTasks,
        isCompleted: allCompleted
      };

    case SESSION_ACTIONS.RECORD_RESPONSE:
      const { taskType, questionData } = action.payload;
      const currentTask = state.tasks[taskType];
      const updatedQuestions = [...currentTask.questions];
      
      // Update or add question data
      const existingIndex = updatedQuestions.findIndex(q => q.questionId === questionData.questionId);
      if (existingIndex >= 0) {
        updatedQuestions[existingIndex] = questionData;
      } else {
        updatedQuestions.push(questionData);
      }

      // Calculate statistics
      const correctAnswers = updatedQuestions.filter(q => q.isCorrect).length;
      const totalResponseTime = updatedQuestions.reduce((sum, q) => sum + (q.responseTime || 0), 0);
      const averageResponseTime = updatedQuestions.length > 0 ? totalResponseTime / updatedQuestions.length : 0;

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [taskType]: {
            ...currentTask,
            questions: updatedQuestions,
            totalCorrect: correctAnswers,
            totalAttempted: updatedQuestions.length,
            averageResponseTime: averageResponseTime
          }
        }
      };

    case SESSION_ACTIONS.UPDATE_PROGRESS:
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.payload.taskType]: {
            ...state.tasks[action.payload.taskType],
            currentQuestion: action.payload.currentQuestion
          }
        }
      };

    case SESSION_ACTIONS.RESET_SESSION:
      return {
        ...initialState,
        sessionId: generateSessionId(),
        startTime: new Date().toISOString()
      };

    case SESSION_ACTIONS.LOAD_FROM_STORAGE:
      return {
        ...state,
        ...action.payload
      };

    default:
      return state;
  }
};

// Utility functions
const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const saveToLocalStorage = (state) => {
  try {
    localStorage.setItem('naadvriksha_session', JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save session to localStorage:', error);
  }
};

const loadFromLocalStorage = () => {
  try {
    const saved = localStorage.getItem('naadvriksha_session');
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Failed to load session from localStorage:', error);
    return null;
  }
};

// Create context
const SessionContext = createContext();

// Custom hook to use session context
export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

// Session provider component
export const SessionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(sessionReducer, initialState);

  // Initialize session on mount
  useEffect(() => {
    const savedSession = loadFromLocalStorage();
    if (savedSession && savedSession.sessionId) {
      dispatch({
        type: SESSION_ACTIONS.LOAD_FROM_STORAGE,
        payload: savedSession
      });
    } else {
      dispatch({
        type: SESSION_ACTIONS.INITIALIZE_SESSION,
        payload: {
          sessionId: generateSessionId(),
          startTime: new Date().toISOString()
        }
      });
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (state.sessionId) {
      saveToLocalStorage(state);
    }
  }, [state]);

  // Action creators
  const actions = {
    initializeSession: () => {
      dispatch({
        type: SESSION_ACTIONS.INITIALIZE_SESSION,
        payload: {
          sessionId: generateSessionId(),
          startTime: new Date().toISOString()
        }
      });
    },

    startTask: (taskType) => {
      dispatch({
        type: SESSION_ACTIONS.START_TASK,
        payload: {
          taskType,
          startTime: new Date().toISOString()
        }
      });
    },

    completeTask: (taskType) => {
      dispatch({
        type: SESSION_ACTIONS.COMPLETE_TASK,
        payload: {
          taskType,
          endTime: new Date().toISOString()
        }
      });
    },

    recordResponse: (taskType, questionData) => {
      dispatch({
        type: SESSION_ACTIONS.RECORD_RESPONSE,
        payload: {
          taskType,
          questionData: {
            ...questionData,
            timestamp: new Date().toISOString()
          }
        }
      });
    },

    updateProgress: (taskType, currentQuestion) => {
      dispatch({
        type: SESSION_ACTIONS.UPDATE_PROGRESS,
        payload: {
          taskType,
          currentQuestion
        }
      });
    },

    resetSession: () => {
      localStorage.removeItem('naadvriksha_session');
      dispatch({
        type: SESSION_ACTIONS.RESET_SESSION
      });
    },

    exportResults: () => {
      const totalCorrect = Object.values(state.tasks).reduce((sum, task) => sum + task.totalCorrect, 0);
      const totalAttempted = Object.values(state.tasks).reduce((sum, task) => sum + task.totalAttempted, 0);
      const overallAccuracy = totalAttempted > 0 ? (totalCorrect / totalAttempted) * 100 : 0;
      
      const results = {
        sessionInfo: {
          sessionId: state.sessionId,
          startTime: state.startTime,
          completionTime: new Date().toISOString(),
          isCompleted: state.isCompleted
        },
        taskResults: {},
        summary: {
          totalCorrect,
          totalAttempted,
          overallAccuracy,
          averageResponseTime: Object.values(state.tasks).reduce((sum, task) => sum + (task.averageResponseTime || 0), 0) / 3,
          completedTasks: Object.values(state.tasks).filter(task => task.isCompleted).length
        }
      };

      // Process each task for taskResults
      Object.entries(state.tasks).forEach(([taskType, taskData]) => {
        results.taskResults[taskType] = {
          taskType: taskData.taskType,
          startTime: taskData.startTime,
          endTime: taskData.endTime,
          isCompleted: taskData.isCompleted,
          totalQuestions: taskData.questions.length,
          totalCorrect: taskData.totalCorrect,
          totalAttempted: taskData.totalAttempted,
          accuracy: taskData.totalAttempted > 0 ? (taskData.totalCorrect / taskData.totalAttempted) * 100 : 0,
          averageResponseTime: taskData.averageResponseTime || 0,
          questions: taskData.questions.map(q => ({
            questionIndex: q.questionIndex || 0,
            question: q.question,
            userAnswer: q.userAnswer,
            correctAnswer: q.correctAnswer,
            isCorrect: q.isCorrect,
            responseTime: q.responseTime,
            timedOut: q.timedOut,
            timestamp: q.timestamp
          }))
        };
      });
      
      return results;
    }
  };

  const contextValue = {
    state,
    actions,
    // Convenience getters
    currentTask: state.currentTask,
    isCompleted: state.isCompleted,
    getTaskData: (taskType) => state.tasks[taskType],
    getProgress: (taskType) => {
      const task = state.tasks[taskType];
      return {
        current: task.currentQuestion,
        total: task.questions.length,
        completed: task.isCompleted
      };
    }
  };

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
};

export { SESSION_ACTIONS };