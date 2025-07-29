export class ValidationService {
  /**
   * Validates math answer by comparing user input with correct answer
   * @param {Object} question - The math question object
   * @param {string} userAnswer - User's answer input
   * @returns {boolean} - True if answer is correct
   */
  static validateMathAnswer(question, userAnswer) {
    if (!question || !question.answer || userAnswer === null || userAnswer === undefined) {
      return false;
    }
    
    // Normalize both answers by trimming whitespace and converting to lowercase
    const normalizedUserAnswer = String(userAnswer).trim().toLowerCase();
    const normalizedCorrectAnswer = String(question.answer).trim().toLowerCase();
    
    return normalizedUserAnswer === normalizedCorrectAnswer;
  }

  /**
   * Validates Stroop response by comparing selected color with correct color
   * @param {Object} stimulus - The Stroop stimulus object
   * @param {string} userResponse - User's selected color
   * @returns {boolean} - True if response is correct
   */
  static validateStroopResponse(stimulus, userResponse) {
    if (!stimulus || !stimulus.correctAnswer || !userResponse) {
      return false;
    }
    
    // Normalize both responses
    const normalizedUserResponse = String(userResponse).trim().toLowerCase();
    const normalizedCorrectAnswer = String(stimulus.correctAnswer).trim().toLowerCase();
    
    return normalizedUserResponse === normalizedCorrectAnswer;
  }

  /**
   * Validates CAPTCHA response by comparing user input with correct answer
   * @param {Object} challenge - The CAPTCHA challenge object
   * @param {string} userResponse - User's response input
   * @returns {boolean} - True if response is correct
   */
  static validateCaptchaResponse(challenge, userResponse) {
    if (!challenge || !challenge.answer || userResponse === null || userResponse === undefined) {
      return false;
    }
    
    // For image-based CAPTCHA, exact match is required (case-sensitive)
    if (challenge.image || challenge.filename) {
      return String(userResponse).trim() === String(challenge.answer).trim();
    }
    
    // For text-based CAPTCHA, exact match is required (case-sensitive)
    if (challenge.type === 'text') {
      return String(userResponse).trim() === String(challenge.answer).trim();
    }
    
    // For math-based CAPTCHA, normalize and compare
    if (challenge.type === 'math') {
      const normalizedUserResponse = String(userResponse).trim().toLowerCase();
      const normalizedCorrectAnswer = String(challenge.answer).trim().toLowerCase();
      return normalizedUserResponse === normalizedCorrectAnswer;
    }
    
    return false;
  }

  /**
   * Generic validation method that routes to appropriate validator
   * @param {string} taskType - Type of task ('math', 'stroop', 'captcha')
   * @param {Object} item - Question/stimulus/challenge object
   * @param {string} userInput - User's input/response
   * @returns {boolean} - True if input is correct
   */
  static validate(taskType, item, userInput) {
    switch (taskType) {
      case 'math':
        return this.validateMathAnswer(item, userInput);
      case 'stroop':
        return this.validateStroopResponse(item, userInput);
      case 'captcha':
        return this.validateCaptchaResponse(item, userInput);
      default:
        console.error(`Unknown task type: ${taskType}`);
        return false;
    }
  }
}