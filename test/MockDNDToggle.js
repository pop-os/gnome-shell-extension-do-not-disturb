/**
 * A class which handles the UI of the do not disturb toggle.
 */
class MockDNDToggle {
  /**
   * Represents a do not disturb toggle in the calendar/notification popup.
   * @constructor
   */
  constructor() {
    this.listeners = [];
    this.shown = false;
    this.state = false;
  }

  /**
   * Shows the do not disturb toggle in the calendar/notification popup.
   */
  show() {
    this.shown = true;
  }

  /**
   * Destroys all UI elements of the toggle and returns the clear button to its proper location.
   */
  destroy() {
    this.shown = false;
    this.listeners = [];
  }

  /**
   * Sets the activation state of the toggle.
   *
   * @param {boolean} state - The state of the toggle: true for on, false for off.
   */
  setToggleState(state) {
    this.state = state;
    this.listeners.forEach((listener) => {
      listener(this.state);
    });
  }

  /**
   * Get the activation state of the toggle.
   *
   * @returns {boolean} - True if the toggle is on, false otherwise.
   */
  getToggleState() {
    return this.state;
  }

  /**
   * Calls a function when the toggle state changes.
   *
   * @param {() => ()} fn - The function to call when the toggle state changes.
   */
  onToggleStateChanged(fn) {
    return this.listeners.push(fn) - 1;
  }
}
