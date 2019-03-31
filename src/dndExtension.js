class Extension {
  constructor(dnd, notificationCounter, toggle, indicator){
    this.dnd = dnd;
    this.notificationCounter = notificationCounter;
    this.toggle = toggle;
    this.indicator = indicator;

    this.enabled = false;

    this.toggle.setToggleState(this.dnd.isEnabled());
    this.toggle.show();
    this.toggle.onToggleStateChanged(() => {
      if (this.toggle.getToggleState()){
        this.enable();
      } else {
        this.disable();
      }
    });

    this.dndID = this.dnd.addStatusListener((dndEnabled) => {
      if (dndEnabled){
        this.enable();
      } else {
        this.disable();
      }
    });

    this.indicator.updateCount(this.notificationCounter.notificationCount);

    this.notificationListenerID = this.notificationCounter.addNotificationCountListener((count) => {
      this.indicator.updateCount(count);
    });
  }

  /**
   * Enable do not disturb mode
   */
  enable(){
    if (this.enabled){
      return;
    }
    this.enabled = true;
    this.dnd.enable();
    this.toggle.setToggleState(true);
    this.indicator.show();
  }

  /**
   * Disable do not disturb mode
   */
  disable(){
    if (!this.enabled){
      return;
    }
    this.enabled = false;
    this.dnd.disable();
    this.toggle.setToggleState(false);
    this.indicator.hide();
  }

  /**
   * @return {Boolean} true if it is enabled, otherwise false
   */
  isEnabled(){
    return this.enabled;
  }

  /**
   * Destroy the extension and its components
   */
  destroy(){
    this.dnd.removeStatusListener(this.dndID);
    this.notificationCounter.removeNotificationCountListener(this.notificationListenerID);
    this.toggle.destroy();
    this.indicator.destroy();
  }
}
