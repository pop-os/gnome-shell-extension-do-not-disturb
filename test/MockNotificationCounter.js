class MockNotificationCounter {

  constructor() {
    this.count = 0;
    this.listeners = [];
  }

  /**
   * Get the current number of notifications in the system tray.
   * @return {number} The number of notifications.
   */
  get notificationCount(){
    return this.count;
  }

  /**
   * @param  {number} cnt the notification count
   */
  set notificationCount(cnt){
    this.count = cnt;
    this.listeners.forEach((listener) => {
      listener(this.notificationCount);
    });
  }

  /**
   * Determines if there are any notifications.
   * @return {Boolean} True if there are notifications, false otherwise
   */
  get hasNotifications(){
    return notificationCount() > 0;
  }

  /**
   * Add a listener for when the notification count changes.
   * @param {Function} fn The function to call when the notification count changes (passed the current notification count).
   * @return {number} The ID of the listeners.
   */
  addNotificationCountListener(fn){
    return this.listeners.push(fn) - 1;
  }

  /**
   * Remove a notification count listener.
   * @param  {number} id The ID of the listener to remove.
   */
  removeNotificationCountListener(id){
    if (id < -1 || id >= this.listeners.length){
      return;
    }
    this.listeners.splice(id, 1);
  }
}
