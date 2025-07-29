import { DataService } from '../DataService';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

describe('DataService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('createNewSession', () => {
    test('should create a new session with correct structure', () => {
      const session = DataService.createNewSession();
      
      expect(session).toHaveProperty('sessionId');
      expect(session).toHaveProperty('startTime');
      expect(session).toHaveProperty('currentTask', 'home');
      expect(session).toHaveProperty('tasks');
      expect(session.tasks).toHaveProperty('math');
      expect(session.tasks).toHaveProperty('stroop');
      expect(session.tasks).toHaveProperty('captcha');
      expect(session.isCompleted).toBe(false);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        DataService.STORAGE_KEY,
        JSON.stringify(session)
      );
    });

    test('should generate unique session IDs', () => {
      const session1 = DataService.createNewSession();
      const session2 = DataService.createNewSession();
      
      expect(session1.sessionId).not.toBe(session2.sessionId);
    });
  });

  describe('saveProgress', () => {
    test('should save progress for a new task', () => {
      const mockSession = {
        sessionId: 'test-session',
        tasks: {}
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockSession));

      const response = {
        question: 'What is 2+2?',
        correctAnswer: '4',
        userAnswer: '4',
        isCorrect: true
      };

      const result = DataService.saveProgress('math', 0, response, 1500);
      
      expect(result).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    test('should update existing question data', () => {
      const mockSession = {
        sessionId: 'test-session',
        tasks: {
          math: {
            taskType: 'math',
            questions: [{
              questionIndex: 0,
              question: 'What is 2+2?',
              userAnswer: '3',
              isCorrect: false
            }],
            totalCorrect: 0,
            totalAttempted: 1
          }
        }
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockSession));

      const response = {
        question: 'What is 2+2?',
        correctAnswer: '4',
        userAnswer: '4',
        isCorrect: true
      };

      DataService.saveProgress('math', 0, response, 2000);
      
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    test('should handle localStorage errors gracefully', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const response = {
        question: 'What is 2+2?',
        correctAnswer: '4',
        userAnswer: '4',
        isCorrect: true
      };

      const result = DataService.saveProgress('math', 0, response, 1500);
      
      expect(result).toBe(false);
    });
  });

  describe('getSessionData', () => {
    test('should return parsed session data', () => {
      const mockSession = { sessionId: 'test-session' };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockSession));

      const result = DataService.getSessionData();
      
      expect(result).toEqual(mockSession);
      expect(localStorageMock.getItem).toHaveBeenCalledWith(DataService.STORAGE_KEY);
    });

    test('should return null if no data exists', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = DataService.getSessionData();
      
      expect(result).toBeNull();
    });

    test('should attempt backup restore on parse error', () => {
      localStorageMock.getItem
        .mockReturnValueOnce('invalid json')
        .mockReturnValueOnce(JSON.stringify({
          data: { sessionId: 'backup-session' },
          timestamp: new Date().toISOString()
        }));

      const result = DataService.getSessionData();
      
      expect(result).toEqual({ sessionId: 'backup-session' });
    });
  });

  describe('completeTask', () => {
    test('should mark task as completed', () => {
      const mockSession = {
        sessionId: 'test-session',
        tasks: {
          math: {
            taskType: 'math',
            isCompleted: false,
            endTime: null
          },
          stroop: {
            taskType: 'stroop',
            isCompleted: false
          },
          captcha: {
            taskType: 'captcha',
            isCompleted: false
          }
        },
        isCompleted: false
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockSession));

      const result = DataService.completeTask('math');
      
      expect(result).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    test('should mark session as completed when all tasks done', () => {
      const mockSession = {
        sessionId: 'test-session',
        tasks: {
          math: { taskType: 'math', isCompleted: true },
          stroop: { taskType: 'stroop', isCompleted: true },
          captcha: { taskType: 'captcha', isCompleted: false }
        },
        isCompleted: false
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockSession));

      DataService.completeTask('captcha');
      
      const savedData = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
      expect(savedData.isCompleted).toBe(true);
      expect(savedData.completionTime).toBeDefined();
    });
  });

  describe('exportResults', () => {
    test('should export formatted results', () => {
      const mockSession = {
        sessionId: 'test-session',
        startTime: '2023-01-01T00:00:00.000Z',
        isCompleted: true,
        tasks: {
          math: {
            taskType: 'math',
            startTime: '2023-01-01T00:01:00.000Z',
            endTime: '2023-01-01T00:05:00.000Z',
            isCompleted: true,
            questions: [
              {
                questionIndex: 0,
                question: 'What is 2+2?',
                userAnswer: '4',
                correctAnswer: '4',
                isCorrect: true,
                responseTime: 1500,
                timedOut: false,
                timestamp: '2023-01-01T00:01:30.000Z'
              }
            ],
            totalCorrect: 1,
            totalAttempted: 1,
            averageResponseTime: 1500
          },
          stroop: {
            taskType: 'stroop',
            questions: [],
            totalCorrect: 0,
            totalAttempted: 0,
            averageResponseTime: 0,
            isCompleted: false
          },
          captcha: {
            taskType: 'captcha',
            questions: [],
            totalCorrect: 0,
            totalAttempted: 0,
            averageResponseTime: 0,
            isCompleted: false
          }
        }
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockSession));

      const results = DataService.exportResults();
      
      expect(results).toHaveProperty('sessionInfo');
      expect(results).toHaveProperty('taskResults');
      expect(results).toHaveProperty('summary');
      expect(results.sessionInfo.sessionId).toBe('test-session');
      expect(results.taskResults.math.totalCorrect).toBe(1);
      expect(results.summary.totalCorrect).toBe(1);
      expect(results.summary.completedTasks).toBe(1);
    });

    test('should return null if no session data', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const results = DataService.exportResults();
      
      expect(results).toBeNull();
    });
  });

  describe('clearSession', () => {
    test('should remove session and backup data', () => {
      const result = DataService.clearSession();
      
      expect(result).toBe(true);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(DataService.STORAGE_KEY);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(DataService.BACKUP_KEY);
    });
  });

  describe('getStorageInfo', () => {
    test('should return storage usage information', () => {
      localStorageMock.getItem
        .mockReturnValueOnce('{"sessionId":"test"}')
        .mockReturnValueOnce('{"backup":"data"}');

      const info = DataService.getStorageInfo();
      
      expect(info).toHaveProperty('sessionSize');
      expect(info).toHaveProperty('backupSize');
      expect(info).toHaveProperty('totalSize');
      expect(info).toHaveProperty('hasSession');
      expect(info).toHaveProperty('hasBackup');
      expect(info.hasSession).toBe(true);
      expect(info.hasBackup).toBe(true);
    });
  });
});