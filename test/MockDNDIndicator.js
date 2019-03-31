/**
 * A class which handles the UI of the do not disturb status icon.
 */
class MockDNDIndicator {
  /**
   * Represents a do not disturb icon in the system status area of the panel.
   * @constructor
   */
  constructor() {
    this.shown = false;
    this.showDot = false;
    this.showCount = true;
    this.count = 0;
  }

  updateCount(newCount){
    this.count = newCount;
  }

  /**
   * Shows the status icon.
   */
  show() {
    this.shown = true;
  }

  /**
   * Hides the status icon.
   */
  hide() {
    this.shown = false;
  }

  /**
   * Destroys the status icon and removes it from the system status area.
   */
  destroy() {
    this.shown = false;
  }
}
