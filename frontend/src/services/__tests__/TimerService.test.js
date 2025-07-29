import { TimerService } from '../TimerService';

// Mock timers for testing
jest.useFakeTimers();

describe('TimerService', () => {
  let timerService;
  let mockOnExpire;
  let mockOnTick;

  beforeEach(() => {
    timerService = new TimerService();
    mockOnExpire = jest.fn();
    mockOnTick = jest.fn();
    jest.clearAllTimers();
  });

  afterEach(() => {
    timerService.cleanup();
  });

  describe('startTimer', () => {
    test('should start timer with correct initial values', () => {
      timerService.startTimer(15, mockOnExpire, mockOnTick);
      
      expect(timerService.getCurrentTime()).toBe(15);
      expect(timerService.isActive()).toBe(true);
      expect(mockOnTick).toHaveBeenCalledWith(15);
    });

    test('should call onTick callback every second', () => {
      timerService.startTimer(3, mockOnExpire, mockOnTick);
      
      // Initial call
      expect(mockOnTick).toHaveBeenCalledWith(3);
      
      // After 1 second
      jest.advanceTimersByTime(1000);
      expect(mockOnTick).toHaveBeenCalledWith(2);
      
      // After 2 seconds
      jest.advanceTimersByTime(1000);
      expect(mockOnTick).toHaveBeenCalledWith(1);
    });

    test('should call onExpire callback when timer reaches zero', () => {
      timerService.startTimer(2, mockOnExpire, mockOnTick);
      
      // Advance timer to expiration
      jest.advanceTimersByTime(2000);
      
      expect(mockOnExpire).toHaveBeenCalled();
      expect(timerService.getCurrentTime()).toBe(0);
      expect(timerService.isActive()).toBe(false);
    });

    test('should reset previous timer when starting new one', () => {
      timerService.startTimer(5, mockOnExpire);
      jest.advanceTimersByTime(2000);
      expect(timerService.getCurrentTime()).toBe(3);
      
      // Start new timer
      const newMockOnExpire = jest.fn();
      timerService.startTimer(10, newMockOnExpire);
      
      expect(timerService.getCurrentTime()).toBe(10);
      expect(timerService.isActive()).toBe(true);
    });
  });

  describe('pauseTimer', () => {
    test('should pause running timer', () => {
      timerService.startTimer(5, mockOnExpire, mockOnTick);
      
      jest.advanceTimersByTime(1000);
      expect(timerService.getCurrentTime()).toBe(4);
      
      timerService.pauseTimer();
      
      // Timer should not advance when paused
      jest.advanceTimersByTime(2000);
      expect(timerService.getCurrentTime()).toBe(4);
      expect(timerService.getStatus().isPaused).toBe(true);
    });

    test('should not pause already paused timer', () => {
      timerService.startTimer(5, mockOnExpire);
      timerService.pauseTimer();
      
      const statusBefore = timerService.getStatus();
      timerService.pauseTimer();
      const statusAfter = timerService.getStatus();
      
      expect(statusBefore).toEqual(statusAfter);
    });
  });

  describe('resumeTimer', () => {
    test('should resume paused timer', () => {
      timerService.startTimer(5, mockOnExpire, mockOnTick);
      
      jest.advanceTimersByTime(1000);
      timerService.pauseTimer();
      
      // Verify timer is paused
      jest.advanceTimersByTime(1000);
      expect(timerService.getCurrentTime()).toBe(4);
      
      // Resume timer
      timerService.resumeTimer();
      jest.advanceTimersByTime(1000);
      
      expect(timerService.getCurrentTime()).toBe(3);
      expect(timerService.getStatus().isPaused).toBe(false);
    });
  });

  describe('resetTimer', () => {
    test('should reset timer to initial state', () => {
      timerService.startTimer(5, mockOnExpire, mockOnTick);
      jest.advanceTimersByTime(2000);
      
      timerService.resetTimer();
      
      expect(timerService.getCurrentTime()).toBe(0);
      expect(timerService.isActive()).toBe(false);
      expect(timerService.getStatus().isPaused).toBe(false);
    });
  });

  describe('getStatus', () => {
    test('should return correct status object', () => {
      timerService.startTimer(10, mockOnExpire);
      jest.advanceTimersByTime(3000);
      
      const status = timerService.getStatus();
      
      expect(status).toEqual({
        timeRemaining: 7,
        isRunning: true,
        isPaused: false,
        startTime: expect.any(Number)
      });
    });
  });

  describe('cleanup', () => {
    test('should clean up timer resources', () => {
      timerService.startTimer(5, mockOnExpire);
      
      timerService.cleanup();
      
      expect(timerService.getCurrentTime()).toBe(0);
      expect(timerService.isActive()).toBe(false);
      
      // Timer should not continue after cleanup
      jest.advanceTimersByTime(5000);
      expect(mockOnExpire).not.toHaveBeenCalled();
    });
  });
});