/**
 * A mock class for interacting with the Gnome Presence API.
 */
class MockPresence {
  /**
   * Construct a mock presense object
   */
  constructor() {
    this.listeners = [];
    this.BUSY = 2;
    this.AVAILABLE = 0;
    this.internalStatus = this.AVAILABLE;
  }

  /**
   * Set the status of GnomePresence.
   * @param  {number} newStatus A GnomeSession.PresenceStatus status constant to switch to.
   */
  set status(newStatus) {
    this.internalStatus = newStatus;
    this.listeners.forEach((fn) => {
      fn(this.internalStatus);
    });
  }

  /**
   * Get the status of GnomePresence.
   * @return {number} The current GnomeSession.PresenceStatus status.
   */
  get status() {
    return this.internalStatus;
  }

  /**
   * Add a listener to the GnomePresence status.
   * @param {Function} fn The function to run when the status is changed (passed the current status).
   * @return {number} The ID of the listener, used by removeStatusListener.
   */
  addStatusListener(fn) {
    this.listeners.push(fn);
    return this.listeners.length - 1;
  }

  /**
   * Remove a status listener to the GnomePresence status.
   * @param  {number} listenerID The ID of the listener to remove.
   */
  removeStatusListener(listenerID) {
    this.listeners.splice(listenerID, 1);
  }
}
