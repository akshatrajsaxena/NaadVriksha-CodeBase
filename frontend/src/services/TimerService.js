export class TimerService {
  constructor() {
    this.intervalId = null;
    this.timeRemaining = 0;
    this.isRunning = false;
    this.isPaused = false;
    this.onTickCallback = null;
    this.onExpireCallback = null;
    this.startTime = null;
  }

  /**
   * Starts the timer with specified duration
   * @param {number} duration - Duration in seconds
   * @param {function} onExpire - Callback when timer expires
   * @param {function} onTick - Optional callback on each tick
   */
  startTimer(duration, onExpire, onTick = null) {
    this.resetTimer();
    
    this.timeRemaining = duration;
    this.onExpireCallback = onExpire;
    this.onTickCallback = onTick;
    this.isRunning = true;
    this.isPaused = false;
    this.startTime = Date.now();

    // Call onTick immediately with initial time
    if (this.onTickCallback) {
      this.onTickCallback(this.timeRemaining);
    }

    this.intervalId = setInterval(() => {
      if (!this.isPaused) {
        this.timeRemaining -= 1;

        // Call onTick callback if provided
        if (this.onTickCallback) {
          this.onTickCallback(this.timeRemaining);
        }

        // Check if timer expired
        if (this.timeRemaining <= 0) {
          this.timeRemaining = 0;
          this.isRunning = false;
          
          // Clear interval before calling callback to prevent race conditions
          if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
          }

          // Call expire callback
          if (this.onExpireCallback) {
            this.onExpireCallback();
          }
        }
      }
    }, 1000);
  }

  /**
   * Pauses the timer
   */
  pauseTimer() {
    if (this.isRunning && !this.isPaused) {
      this.isPaused = true;
    }
  }

  /**
   * Resumes the paused timer
   */
  resumeTimer() {
    if (this.isRunning && this.isPaused) {
      this.isPaused = false;
    }
  }

  /**
   * Resets and stops the timer
   */
  resetTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    this.timeRemaining = 0;
    this.isRunning = false;
    this.isPaused = false;
    this.onTickCallback = null;
    this.onExpireCallback = null;
    this.startTime = null;
  }

  /**
   * Gets the current remaining time
   * @returns {number} - Time remaining in seconds
   */
  getCurrentTime() {
    return this.timeRemaining;
  }

  /**
   * Gets the timer status
   * @returns {Object} - Timer status object
   */
  getStatus() {
    return {
      timeRemaining: this.timeRemaining,
      isRunning: this.isRunning,
      isPaused: this.isPaused,
      startTime: this.startTime
    };
  }

  /**
   * Checks if timer is currently active (running and not paused)
   * @returns {boolean} - True if timer is active
   */
  isActive() {
    return this.isRunning && !this.isPaused;
  }

  /**
   * Gets elapsed time since timer started
   * @returns {number} - Elapsed time in milliseconds
   */
  getElapsedTime() {
    if (!this.startTime) return 0;
    return Date.now() - this.startTime;
  }

  /**
   * Cleanup method to be called when component unmounts
   */
  cleanup() {
    this.resetTimer();
  }
}