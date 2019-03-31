class Extension {
  constructor(dnd, notificationCounter, toggle, indicator, remote){
    this.dnd = dnd;
    this.notificationCounter = notificationCounter;
    this.toggle = toggle;
    this.indicator = indicator;
    this.remote = remote;

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

    this.dndID = this.dnd.addStatusListener((dndEnabled) => this._setDND(dndEnabled));

    this.remoteID = this.remote.addRemoteListener((dndEnabled) => this._setDND(dndEnabled));

    this.indicator.updateCount(this.notificationCounter.notificationCount);
    this.notificationListenerID = this.notificationCounter.addNotificationCountListener((count) => {
      this.indicator.updateCount(count);
    });

    this._setDND(this.remote.getRemote());
  }

  _setDND(enabled){
    if (enabled){
      this.enable();
    } else {
      this.disable();
    }
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
    this.remote.setRemote(true);
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
    this.remote.setRemote(false);
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
    this.enabled = false;
    this.dnd.removeStatusListener(this.dndID);
    this.remote.removeRemoteListener(this.remoteID);
    this.notificationCounter.removeNotificationCountListener(this.notificationListenerID);
    this.toggle.destroy();
    this.indicator.destroy();
    this.dnd.disable();
  }
}
