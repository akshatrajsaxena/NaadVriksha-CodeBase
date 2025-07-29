import { ValidationService } from '../ValidationService';

describe('ValidationService', () => {
  describe('validateMathAnswer', () => {
    const mathQuestion = { id: 1, question: "What is 15 × 8?", answer: "120" };

    test('should return true for correct answer', () => {
      expect(ValidationService.validateMathAnswer(mathQuestion, "120")).toBe(true);
    });

    test('should return true for correct answer with whitespace', () => {
      expect(ValidationService.validateMathAnswer(mathQuestion, " 120 ")).toBe(true);
    });

    test('should return false for incorrect answer', () => {
      expect(ValidationService.validateMathAnswer(mathQuestion, "121")).toBe(false);
    });

    test('should return false for empty answer', () => {
      expect(ValidationService.validateMathAnswer(mathQuestion, "")).toBe(false);
    });

    test('should return false for null answer', () => {
      expect(ValidationService.validateMathAnswer(mathQuestion, null)).toBe(false);
    });

    test('should return false for undefined question', () => {
      expect(ValidationService.validateMathAnswer(undefined, "120")).toBe(false);
    });
  });

  describe('validateStroopResponse', () => {
    const stroopStimulus = { id: 1, word: "RED", color: "blue", correctAnswer: "blue" };

    test('should return true for correct color selection', () => {
      expect(ValidationService.validateStroopResponse(stroopStimulus, "blue")).toBe(true);
    });

    test('should return true for correct color with different case', () => {
      expect(ValidationService.validateStroopResponse(stroopStimulus, "BLUE")).toBe(true);
    });

    test('should return false for incorrect color selection', () => {
      expect(ValidationService.validateStroopResponse(stroopStimulus, "red")).toBe(false);
    });

    test('should return false for empty response', () => {
      expect(ValidationService.validateStroopResponse(stroopStimulus, "")).toBe(false);
    });

    test('should return false for undefined stimulus', () => {
      expect(ValidationService.validateStroopResponse(undefined, "blue")).toBe(false);
    });
  });

  describe('validateCaptchaResponse', () => {
    const textChallenge = { id: 1, type: "text", challenge: "5K8N", answer: "5K8N" };
    const mathChallenge = { id: 2, type: "math", challenge: "3 + 7 = ?", answer: "10" };

    test('should return true for correct text CAPTCHA', () => {
      expect(ValidationService.validateCaptchaResponse(textChallenge, "5K8N")).toBe(true);
    });

    test('should return false for incorrect case in text CAPTCHA', () => {
      expect(ValidationService.validateCaptchaResponse(textChallenge, "5k8n")).toBe(false);
    });

    test('should return true for correct math CAPTCHA', () => {
      expect(ValidationService.validateCaptchaResponse(mathChallenge, "10")).toBe(true);
    });

    test('should return false for incorrect math CAPTCHA', () => {
      expect(ValidationService.validateCaptchaResponse(mathChallenge, "11")).toBe(false);
    });

    test('should return false for empty response', () => {
      expect(ValidationService.validateCaptchaResponse(textChallenge, "")).toBe(false);
    });

    test('should return false for undefined challenge', () => {
      expect(ValidationService.validateCaptchaResponse(undefined, "5K8N")).toBe(false);
    });
  });

  describe('validate (generic method)', () => {
    const mathQuestion = { id: 1, question: "What is 15 × 8?", answer: "120" };
    const stroopStimulus = { id: 1, word: "RED", color: "blue", correctAnswer: "blue" };
    const captchaChallenge = { id: 1, type: "text", challenge: "5K8N", answer: "5K8N" };

    test('should route to math validation correctly', () => {
      expect(ValidationService.validate('math', mathQuestion, "120")).toBe(true);
      expect(ValidationService.validate('math', mathQuestion, "121")).toBe(false);
    });

    test('should route to stroop validation correctly', () => {
      expect(ValidationService.validate('stroop', stroopStimulus, "blue")).toBe(true);
      expect(ValidationService.validate('stroop', stroopStimulus, "red")).toBe(false);
    });

    test('should route to captcha validation correctly', () => {
      expect(ValidationService.validate('captcha', captchaChallenge, "5K8N")).toBe(true);
      expect(ValidationService.validate('captcha', captchaChallenge, "5k8n")).toBe(false);
    });

    test('should return false for unknown task type', () => {
      expect(ValidationService.validate('unknown', mathQuestion, "120")).toBe(false);
    });
  });
});