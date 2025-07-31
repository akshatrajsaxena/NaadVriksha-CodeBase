import { useState, useCallback, useMemo } from 'react';

/**
 * Unified timer hook for both Math Task and Stroop Task
 * Implements consistent 60s/50s penalty system across both tasks
 */
const useUnifiedTimer = () => {
  // Core timing constants
  const DEFAULT_TIME = 60; // Default question time in seconds
  const PENALTY_TIME = 50; // Penalty question time in seconds

  // State management
  const [currentTimerDuration, setCurrentTimerDuration] = useState(DEFAULT_TIME);
  const [hasIncorrectAttemptInCurrentQuestion, setHasIncorrectAttemptInCurrentQuestion] = useState(false);

  /**
   * Reset flags for a new question/stimulus
   * Should be called when starting each new question
   */
  const resetForNewQuestion = useCallback(() => {
    setHasIncorrectAttemptInCurrentQuestion(false);
  }, []);

  /**
   * Mark that user made an incorrect attempt on current question
   * This will trigger penalty for the next question
   */
  const markIncorrectAttempt = useCallback(() => {
    setHasIncorrectAttemptInCurrentQuestion(true);
  }, []);

  /**
   * Calculate timer duration for next question based on current question's performance
   * Should be called when moving to the next question
   */
  const calculateNextQuestionTime = useCallback(() => {
    if (hasIncorrectAttemptInCurrentQuestion) {
      setCurrentTimerDuration(PENALTY_TIME); // Apply penalty: 50 seconds
    } else {
      setCurrentTimerDuration(DEFAULT_TIME); // No penalty: full 60 seconds
    }
  }, [hasIncorrectAttemptInCurrentQuestion]);

  /**
   * Handle timer expiration scenarios
   * Applies penalty logic for timeout situations
   */
  const handleTimeout = useCallback(() => {
    // If user had any incorrect attempts before timeout, or timeout without any correct answer,
    // penalty should be applied to next question
    setHasIncorrectAttemptInCurrentQuestion(true);
  }, []);

  /**
   * Check if penalty should be applied to next question
   */
  const shouldApplyPenalty = useCallback(() => {
    return hasIncorrectAttemptInCurrentQuestion;
  }, [hasIncorrectAttemptInCurrentQuestion]);

  /**
   * Get comprehensive timer status information
   * Returns all relevant state for UI display and logic
   */
  const getTimerStatus = useMemo(() => ({
    duration: currentTimerDuration,
    hasIncorrectAttempt: hasIncorrectAttemptInCurrentQuestion,
    willHavePenalty: hasIncorrectAttemptInCurrentQuestion,
    isPenaltyTime: currentTimerDuration === PENALTY_TIME,
    isFullTime: currentTimerDuration === DEFAULT_TIME,
    penaltyDuration: PENALTY_TIME,
    defaultDuration: DEFAULT_TIME
  }), [currentTimerDuration, hasIncorrectAttemptInCurrentQuestion]);

  /**
   * Get display information for timer UI
   */
  const getDisplayInfo = useMemo(() => ({
    timeLabel: currentTimerDuration === DEFAULT_TIME ? 'Full Time' : 'Penalty Time',
    timeClass: currentTimerDuration === DEFAULT_TIME ? 'text-green-600' : 'text-orange-600',
    warningMessage: hasIncorrectAttemptInCurrentQuestion 
      ? '⚠️ Next question will have 50 seconds (penalty)'
      : null,
    penaltyMessage: currentTimerDuration === PENALTY_TIME 
      ? '⏰ Penalty time: 50 seconds'
      : null
  }), [currentTimerDuration, hasIncorrectAttemptInCurrentQuestion]);

  /**
   * Initialize timer for first question
   * Sets up default state for task start
   */
  const initializeTimer = useCallback(() => {
    setCurrentTimerDuration(DEFAULT_TIME);
    setHasIncorrectAttemptInCurrentQuestion(false);
  }, []);

  return {
    // Core methods
    resetForNewQuestion,
    markIncorrectAttempt,
    calculateNextQuestionTime,
    handleTimeout,
    initializeTimer,
    
    // Status and utility methods
    getTimerStatus,
    getDisplayInfo,
    shouldApplyPenalty,
    
    // Constants for external use
    DEFAULT_TIME,
    PENALTY_TIME
  };
};

export default useUnifiedTimer;
