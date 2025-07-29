import { UserInteractionBlocker } from '../userInteractionBlocker';

// Mock DOM methods
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();
const mockPreventDefault = jest.fn();
const mockStopPropagation = jest.fn();

// Mock document and element
const mockElement = {
  addEventListener: mockAddEventListener,
  removeEventListener: mockRemoveEventListener,
  classList: {
    add: jest.fn(),
    remove: jest.fn()
  }
};

const mockDocument = {
  addEventListener: mockAddEventListener,
  removeEventListener: mockRemoveEventListener,
  body: {
    classList: {
      add: jest.fn(),
      remove: jest.fn()
    }
  },
  head: {
    appendChild: jest.fn()
  },
  createElement: jest.fn(() => ({
    id: '',
    textContent: ''
  })),
  getElementById: jest.fn(),
  querySelectorAll: jest.fn(() => [])
};

// Mock event object
const mockEvent = {
  preventDefault: mockPreventDefault,
  stopPropagation: mockStopPropagation,
  ctrlKey: false,
  metaKey: false,
  shiftKey: false,
  key: ''
};

describe('UserInteractionBlocker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    UserInteractionBlocker.isBlocked = false;
    UserInteractionBlocker.listeners = [];
    
    // Mock global document
    global.document = mockDocument;
  });

  describe('preventContextMenu', () => {
    test('should prevent default and stop propagation', () => {
      const result = UserInteractionBlocker.preventContextMenu(mockEvent);
      
      expect(mockPreventDefault).toHaveBeenCalled();
      expect(mockStopPropagation).toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });

  describe('preventSelection', () => {
    test('should prevent default and stop propagation', () => {
      const result = UserInteractionBlocker.preventSelection(mockEvent);
      
      expect(mockPreventDefault).toHaveBeenCalled();
      expect(mockStopPropagation).toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });

  describe('preventDrag', () => {
    test('should prevent default and stop propagation', () => {
      const result = UserInteractionBlocker.preventDrag(mockEvent);
      
      expect(mockPreventDefault).toHaveBeenCalled();
      expect(mockStopPropagation).toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });

  describe('preventKeyboardShortcuts', () => {
    test('should prevent Ctrl+C', () => {
      const event = { ...mockEvent, ctrlKey: true, key: 'c' };
      const result = UserInteractionBlocker.preventKeyboardShortcuts(event);
      
      expect(mockPreventDefault).toHaveBeenCalled();
      expect(mockStopPropagation).toHaveBeenCalled();
      expect(result).toBe(false);
    });

    test('should prevent Ctrl+V', () => {
      const event = { ...mockEvent, ctrlKey: true, key: 'v' };
      const result = UserInteractionBlocker.preventKeyboardShortcuts(event);
      
      expect(mockPreventDefault).toHaveBeenCalled();
      expect(result).toBe(false);
    });

    test('should prevent F12', () => {
      const event = { ...mockEvent, key: 'F12' };
      const result = UserInteractionBlocker.preventKeyboardShortcuts(event);
      
      expect(mockPreventDefault).toHaveBeenCalled();
      expect(result).toBe(false);
    });

    test('should allow non-blocked keys', () => {
      const event = { ...mockEvent, key: 'Enter' };
      const result = UserInteractionBlocker.preventKeyboardShortcuts(event);
      
      expect(mockPreventDefault).not.toHaveBeenCalled();
      expect(result).toBe(true);
    });

    test('should prevent Ctrl+Shift+I (Developer Tools)', () => {
      const event = { ...mockEvent, ctrlKey: true, shiftKey: true, key: 'i' };
      const result = UserInteractionBlocker.preventKeyboardShortcuts(event);
      
      expect(mockPreventDefault).toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });

  describe('enableBlocking', () => {
    test('should enable blocking on document by default', () => {
      UserInteractionBlocker.enableBlocking();
      
      expect(UserInteractionBlocker.isBlocked).toBe(true);
      expect(mockAddEventListener).toHaveBeenCalledTimes(5); // 5 event types
      expect(mockDocument.body.classList.add).toHaveBeenCalledWith('no-select');
    });

    test('should enable blocking on specific element', () => {
      UserInteractionBlocker.enableBlocking(mockElement);
      
      expect(UserInteractionBlocker.isBlocked).toBe(true);
      expect(mockElement.addEventListener).toHaveBeenCalledTimes(5);
      expect(mockElement.classList.add).toHaveBeenCalledWith('no-select');
    });

    test('should not enable blocking if already blocked', () => {
      UserInteractionBlocker.isBlocked = true;
      UserInteractionBlocker.enableBlocking();
      
      expect(mockAddEventListener).not.toHaveBeenCalled();
    });
  });

  describe('disableBlocking', () => {
    test('should disable blocking and clean up', () => {
      // First enable blocking
      UserInteractionBlocker.enableBlocking(mockElement);
      jest.clearAllMocks();
      
      // Then disable
      UserInteractionBlocker.disableBlocking();
      
      expect(UserInteractionBlocker.isBlocked).toBe(false);
      expect(UserInteractionBlocker.listeners).toEqual([]);
      expect(mockDocument.body.classList.remove).toHaveBeenCalledWith('no-select');
    });

    test('should not disable if not blocked', () => {
      UserInteractionBlocker.disableBlocking();
      
      expect(mockRemoveEventListener).not.toHaveBeenCalled();
    });
  });

  describe('isBlockingEnabled', () => {
    test('should return current blocking status', () => {
      expect(UserInteractionBlocker.isBlockingEnabled()).toBe(false);
      
      UserInteractionBlocker.isBlocked = true;
      expect(UserInteractionBlocker.isBlockingEnabled()).toBe(true);
    });
  });

  describe('temporaryDisable', () => {
    test('should temporarily disable blocking', (done) => {
      UserInteractionBlocker.enableBlocking();
      expect(UserInteractionBlocker.isBlocked).toBe(true);
      
      UserInteractionBlocker.temporaryDisable(100);
      expect(UserInteractionBlocker.isBlocked).toBe(false);
      
      setTimeout(() => {
        expect(UserInteractionBlocker.isBlocked).toBe(true);
        done();
      }, 150);
    });

    test('should not affect non-blocked state', () => {
      UserInteractionBlocker.temporaryDisable(100);
      expect(UserInteractionBlocker.isBlocked).toBe(false);
    });
  });

  describe('useInteractionBlocking', () => {
    test('should return control methods', () => {
      const controls = UserInteractionBlocker.useInteractionBlocking(true);
      
      expect(controls).toHaveProperty('enable');
      expect(controls).toHaveProperty('disable');
      expect(controls).toHaveProperty('isEnabled');
      expect(typeof controls.enable).toBe('function');
      expect(typeof controls.disable).toBe('function');
      expect(typeof controls.isEnabled).toBe('function');
    });
  });
});