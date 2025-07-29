/**
 * DataService - Handles data persistence and session management
 */
export class DataService {
  static STORAGE_KEY = 'naadvriksha_session';
  static BACKUP_KEY = 'naadvriksha_backup';

  /**
   * Saves session progress to localStorage
   * @param {string} taskType - Type of task (math, stroop, captcha)
   * @param {number} questionIndex - Current question index
   * @param {Object} response - User response data
   * @param {number} timeSpent - Time spent on question in milliseconds
   */
  static saveProgress(taskType, questionIndex, response, timeSpent) {
    try {
      const sessionData = this.getSessionData() || this.createNewSession();
      
      if (!sessionData.tasks[taskType]) {
        sessionData.tasks[taskType] = {
          taskType,
          startTime: new Date().toISOString(),
          endTime: null,
          questions: [],
          totalCorrect: 0,
          totalAttempted: 0,
          averageResponseTime: 0
        };
      }

      const questionData = {
        questionId: `${taskType}_${questionIndex}`,
        questionIndex,
        question: response.question,
        correctAnswer: response.correctAnswer,
        userAnswer: response.userAnswer,
        isCorrect: response.isCorrect,
        responseTime: timeSpent,
        timedOut: response.timedOut || false,
        timestamp: new Date().toISOString()
      };

      // Update or add question data
      const existingIndex = sessionData.tasks[taskType].questions.findIndex(
        q => q.questionIndex === questionIndex
      );

      if (existingIndex >= 0) {
        sessionData.tasks[taskType].questions[existingIndex] = questionData;
      } else {
        sessionData.tasks[taskType].questions.push(questionData);
      }

      // Recalculate statistics
      this.updateTaskStatistics(sessionData.tasks[taskType]);

      // Save to localStorage
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessionData));
      
      // Create backup
      this.createBackup(sessionData);

      return true;
    } catch (error) {
      console.error('Failed to save progress:', error);
      return false;
    }
  }

  /**
   * Gets current session data from localStorage
   * @returns {Object|null} - Session data or null if not found
   */
  static getSessionData() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get session data:', error);
      return this.restoreFromBackup();
    }
  }

  /**
   * Creates a new session
   * @returns {Object} - New session data structure
   */
  static createNewSession() {
    const sessionData = {
      sessionId: this.generateSessionId(),
      startTime: new Date().toISOString(),
      currentTask: 'home',
      tasks: {
        math: this.createTaskStructure('math'),
        stroop: this.createTaskStructure('stroop'),
        captcha: this.createTaskStructure('captcha')
      },
      isCompleted: false
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessionData));
    return sessionData;
  }

  /**
   * Creates task data structure
   * @param {string} taskType - Type of task
   * @returns {Object} - Task data structure
   */
  static createTaskStructure(taskType) {
    return {
      taskType,
      startTime: null,
      endTime: null,
      questions: [],
      totalCorrect: 0,
      totalAttempted: 0,
      averageResponseTime: 0,
      isCompleted: false
    };
  }

  /**
   * Updates task statistics
   * @param {Object} taskData - Task data to update
   */
  static updateTaskStatistics(taskData) {
    const questions = taskData.questions;
    taskData.totalAttempted = questions.length;
    taskData.totalCorrect = questions.filter(q => q.isCorrect).length;
    
    const totalResponseTime = questions.reduce((sum, q) => sum + (q.responseTime || 0), 0);
    taskData.averageResponseTime = questions.length > 0 ? totalResponseTime / questions.length : 0;
  }

  /**
   * Marks a task as completed
   * @param {string} taskType - Type of task to complete
   */
  static completeTask(taskType) {
    try {
      const sessionData = this.getSessionData();
      if (!sessionData) return false;

      if (sessionData.tasks[taskType]) {
        sessionData.tasks[taskType].endTime = new Date().toISOString();
        sessionData.tasks[taskType].isCompleted = true;
      }

      // Check if all tasks are completed
      const allTasksCompleted = Object.values(sessionData.tasks).every(task => task.isCompleted);
      if (allTasksCompleted) {
        sessionData.isCompleted = true;
        sessionData.completionTime = new Date().toISOString();
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessionData));
      return true;
    } catch (error) {
      console.error('Failed to complete task:', error);
      return false;
    }
  }

  /**
   * Exports session results for analysis
   * @returns {Object} - Formatted results data
   */
  static exportResults() {
    try {
      const sessionData = this.getSessionData();
      if (!sessionData) return null;

      const results = {
        sessionInfo: {
          sessionId: sessionData.sessionId,
          startTime: sessionData.startTime,
          completionTime: sessionData.completionTime || new Date().toISOString(),
          isCompleted: sessionData.isCompleted
        },
        taskResults: {},
        summary: {
          totalQuestions: 0,
          totalCorrect: 0,
          totalAttempted: 0,
          overallAccuracy: 0,
          averageResponseTime: 0,
          completedTasks: 0
        }
      };

      // Process each task
      Object.entries(sessionData.tasks).forEach(([taskType, taskData]) => {
        results.taskResults[taskType] = {
          taskType: taskData.taskType,
          startTime: taskData.startTime,
          endTime: taskData.endTime,
          isCompleted: taskData.isCompleted,
          totalQuestions: taskData.questions.length,
          totalCorrect: taskData.totalCorrect,
          totalAttempted: taskData.totalAttempted,
          accuracy: taskData.totalAttempted > 0 ? (taskData.totalCorrect / taskData.totalAttempted) * 100 : 0,
          averageResponseTime: taskData.averageResponseTime,
          questions: taskData.questions.map(q => ({
            questionIndex: q.questionIndex,
            question: q.question,
            userAnswer: q.userAnswer,
            correctAnswer: q.correctAnswer,
            isCorrect: q.isCorrect,
            responseTime: q.responseTime,
            timedOut: q.timedOut,
            timestamp: q.timestamp
          }))
        };

        // Update summary
        results.summary.totalQuestions += taskData.questions.length;
        results.summary.totalCorrect += taskData.totalCorrect;
        results.summary.totalAttempted += taskData.totalAttempted;
        results.summary.averageResponseTime += taskData.averageResponseTime;
        if (taskData.isCompleted) results.summary.completedTasks++;
      });

      // Calculate overall metrics
      results.summary.overallAccuracy = results.summary.totalAttempted > 0 
        ? (results.summary.totalCorrect / results.summary.totalAttempted) * 100 
        : 0;
      results.summary.averageResponseTime = results.summary.averageResponseTime / 3; // Average across tasks

      return results;
    } catch (error) {
      console.error('Failed to export results:', error);
      return null;
    }
  }

  /**
   * Clears session data
   */
  static clearSession() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.BACKUP_KEY);
      return true;
    } catch (error) {
      console.error('Failed to clear session:', error);
      return false;
    }
  }

  /**
   * Creates a backup of session data
   * @param {Object} sessionData - Data to backup
   */
  static createBackup(sessionData) {
    try {
      const backup = {
        data: sessionData,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(this.BACKUP_KEY, JSON.stringify(backup));
    } catch (error) {
      console.error('Failed to create backup:', error);
    }
  }

  /**
   * Restores session from backup
   * @returns {Object|null} - Restored session data or null
   */
  static restoreFromBackup() {
    try {
      const backup = localStorage.getItem(this.BACKUP_KEY);
      if (backup) {
        const parsedBackup = JSON.parse(backup);
        console.log('Restored session from backup');
        return parsedBackup.data;
      }
      return null;
    } catch (error) {
      console.error('Failed to restore from backup:', error);
      return null;
    }
  }

  /**
   * Generates a unique session ID
   * @returns {string} - Unique session identifier
   */
  static generateSessionId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `naadvriksha_${timestamp}_${random}`;
  }

  /**
   * Gets storage usage information
   * @returns {Object} - Storage usage stats
   */
  static getStorageInfo() {
    try {
      const sessionData = localStorage.getItem(this.STORAGE_KEY);
      const backupData = localStorage.getItem(this.BACKUP_KEY);
      
      return {
        sessionSize: sessionData ? new Blob([sessionData]).size : 0,
        backupSize: backupData ? new Blob([backupData]).size : 0,
        totalSize: (sessionData ? new Blob([sessionData]).size : 0) + 
                  (backupData ? new Blob([backupData]).size : 0),
        hasSession: !!sessionData,
        hasBackup: !!backupData
      };
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return {
        sessionSize: 0,
        backupSize: 0,
        totalSize: 0,
        hasSession: false,
        hasBackup: false
      };
    }
  }
}