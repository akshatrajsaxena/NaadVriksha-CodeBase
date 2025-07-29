/**
 * Utility functions to prevent user interactions during cognitive tasks
 * Prevents right-click, text selection, copy/paste, and other interactions
 */

export class UserInteractionBlocker {
  static isBlocked = false;
  static listeners = [];

  /**
   * Prevents right-click context menu
   * @param {Event} event - The context menu event
   */
  static preventContextMenu = (event) => {
    event.preventDefault();
    event.stopPropagation();
    return false;
  };

  /**
   * Prevents text selection via mouse
   * @param {Event} event - The selectstart event
   */
  static preventSelection = (event) => {
    event.preventDefault();
    event.stopPropagation();
    return false;
  };

  /**
   * Prevents drag operations
   * @param {Event} event - The dragstart event
   */
  static preventDrag = (event) => {
    event.preventDefault();
    event.stopPropagation();
    return false;
  };

  /**
   * Prevents copy/paste keyboard shortcuts
   * @param {Event} event - The keydown event
   */
  static preventKeyboardShortcuts = (event) => {
    // Prevent Ctrl+C, Ctrl+V, Ctrl+A, Ctrl+X, Ctrl+S, F12, etc.
    if (event.ctrlKey || event.metaKey) {
      const blockedKeys = ['c', 'v', 'a', 'x', 's', 'p', 'f', 'u', 'i'];
      if (blockedKeys.includes(event.key.toLowerCase())) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    }

    // Prevent F12 (Developer Tools)
    if (event.key === 'F12') {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }

    // Prevent Ctrl+Shift+I (Developer Tools)
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'i') {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }

    // Prevent Ctrl+U (View Source)
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'u') {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }

    return true;
  };

  /**
   * Prevents print functionality
   * @param {Event} event - The beforeprint event
   */
  static preventPrint = (event) => {
    event.preventDefault();
    event.stopPropagation();
    return false;
  };

  /**
   * Enables interaction blocking on the specified element or document
   * @param {HTMLElement} element - Target element (defaults to document)
   */
  static enableBlocking(element = document) {
    if (this.isBlocked) {
      return; // Already blocked
    }

    this.isBlocked = true;

    // Store event listeners for cleanup
    const listeners = [
      { event: 'contextmenu', handler: this.preventContextMenu },
      { event: 'selectstart', handler: this.preventSelection },
      { event: 'dragstart', handler: this.preventDrag },
      { event: 'keydown', handler: this.preventKeyboardShortcuts },
      { event: 'beforeprint', handler: this.preventPrint }
    ];

    // Add event listeners
    listeners.forEach(({ event, handler }) => {
      element.addEventListener(event, handler, { passive: false, capture: true });
    });

    // Store listeners for cleanup
    this.listeners = listeners.map(({ event, handler }) => ({ element, event, handler }));

    // Add CSS classes to prevent selection
    if (element === document) {
      document.body.classList.add('no-select');
    } else {
      element.classList.add('no-select');
    }

    // Disable text selection via CSS
    const style = document.createElement('style');
    style.id = 'interaction-blocker-styles';
    style.textContent = `
      .no-select {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
        -webkit-tap-highlight-color: transparent !important;
      }
      
      .no-select * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
        -webkit-tap-highlight-color: transparent !important;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Disables interaction blocking
   */
  static disableBlocking() {
    if (!this.isBlocked) {
      return; // Not blocked
    }

    this.isBlocked = false;

    // Remove event listeners
    this.listeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler, { capture: true });
    });

    // Clear listeners array
    this.listeners = [];

    // Remove CSS classes
    document.body.classList.remove('no-select');
    const elements = document.querySelectorAll('.no-select');
    elements.forEach(el => el.classList.remove('no-select'));

    // Remove injected styles
    const style = document.getElementById('interaction-blocker-styles');
    if (style) {
      style.remove();
    }
  }

  /**
   * Temporarily disables blocking for a specific duration
   * @param {number} duration - Duration in milliseconds
   */
  static temporaryDisable(duration = 1000) {
    if (!this.isBlocked) return;

    this.disableBlocking();
    setTimeout(() => {
      this.enableBlocking();
    }, duration);
  }

  /**
   * Checks if blocking is currently enabled
   * @returns {boolean} - True if blocking is enabled
   */
  static isBlockingEnabled() {
    return this.isBlocked;
  }

  /**
   * React hook for managing interaction blocking in components
   * @param {boolean} shouldBlock - Whether blocking should be enabled
   * @param {HTMLElement} targetElement - Target element (optional)
   */
  static useInteractionBlocking(shouldBlock, targetElement = null) {
    // This would be used in a React hook, but we'll implement the hook separately
    return {
      enable: () => this.enableBlocking(targetElement),
      disable: () => this.disableBlocking(),
      isEnabled: () => this.isBlockingEnabled()
    };
  }
}

/**
 * React hook for managing user interaction blocking
 * @param {boolean} shouldBlock - Whether to enable blocking
 * @param {HTMLElement} targetElement - Optional target element
 */
export const useInteractionBlocking = (shouldBlock = true, targetElement = null) => {
  const { useEffect } = require('react');

  useEffect(() => {
    if (shouldBlock) {
      UserInteractionBlocker.enableBlocking(targetElement);
    } else {
      UserInteractionBlocker.disableBlocking();
    }

    // Cleanup on unmount
    return () => {
      UserInteractionBlocker.disableBlocking();
    };
  }, [shouldBlock, targetElement]);

  return {
    enable: () => UserInteractionBlocker.enableBlocking(targetElement),
    disable: () => UserInteractionBlocker.disableBlocking(),
    isEnabled: () => UserInteractionBlocker.isBlockingEnabled()
  };
};

/**
 * Higher-order component that wraps a component with interaction blocking
 * @param {React.Component} WrappedComponent - Component to wrap
 * @param {Object} options - Blocking options
 */
export const withInteractionBlocking = (WrappedComponent, options = {}) => {
  const React = require('react');
  const { forwardRef } = React;
  
  return forwardRef((props, ref) => {
    const { shouldBlock = true, ...restProps } = props;
    
    useInteractionBlocking(shouldBlock && !options.disabled);
    
    return React.createElement(WrappedComponent, { ...restProps, ref });
  });
};

export default UserInteractionBlocker;