const Me = imports.misc.extensionUtils.getCurrentExtension();
const Settings = Me.imports.settings;
const System = Me.imports.system;
const Widget = Me.imports.widgets;

/**
 * Called when the extension is loaded.
 */
function init() {}

/**
 * Enable the do not disturb extension. Adds all UI elements and monitors the settings object.
 */
function enable() {

  this._lastMuteState = false;

  this._disturbToggle = new Widget.DoNotDisturbToggle();
  this._disturbToggle.show();

  this._enabledIcon = new Widget.DoNotDisturbIcon();

  this._settings = new Settings.SettingsManager();
  this._soundManager = new System.AudioManager();
  this._notificationManager = new System.NotificationManager();
  this._enabledIcon.updateCount(this._notificationManager.notificationCount)

  this.notificationListenerID = this._notificationManager.addNotificationCountListener((count) => {
    this._enabledIcon.updateCount(count);
  });

  this._disturbToggle.onToggleStateChanged(() => _toggle());
  this._notificationManager.onDoNotDisturbChanged(() => _sync());
  this._settings.onShowIconChanged(() => _sync());
  this._settings.onMuteSoundChanged(() => _sync());
  this._settings.onShowCountChanged(() => _sync());
  this._settings.onShowDotChanged(() => _sync());

  _sync();

  if (this._notificationManager.getDoNotDisturb()){
    // Toggle DND to restart it
    this._notificationManager.setDoNotDisturb(false);
    this._notificationManager.setDoNotDisturb(true);
  }
}

/**
 * Disables the extension. Tears down all UI components.
 */
function disable() {
  this._notificationManager.removeNotificationCountListener(this.notificationListenerID);
  // this._notificationManager.setDoNotDisturb(false);
  this._disturbToggle.destroy();
  this._enabledIcon.destroy();
  this._notificationManager.disconnectAll();
  this._notificationManager.disable();
  let muteSounds = this._settings.shouldMuteSound();
  if (muteSounds){
    this._soundManager.unmute();
  }
}

/**
 * Toggle the status of the do not disturb mode in _settings.
 */
function _toggle() {
  this._notificationManager.setDoNotDisturb(this._disturbToggle.getToggleState()); // This will trigger a call to _sync
}

/**
 * Updates the UI based on the _settings. Includes switching the toggle state and showing the status icon.
 */
function _sync() {
  let enabled = this._notificationManager.getDoNotDisturb();
  let showIcon = this._settings.shouldShowIcon();
  let muteSounds = this._settings.shouldMuteSound();

  this._enabledIcon.showDot = this._settings.showDot;
  this._enabledIcon.showCount = this._settings.showCount;

  if (enabled && showIcon) {
    this._enabledIcon.hide();
    this._enabledIcon.show();
  } else {
    this._enabledIcon.hide();
  }

  this._enabledIcon.updateCount(this._notificationManager.notificationCount);

  if (enabled && muteSounds) {
    this._soundManager.mute();
  } else if (muteSounds || this._lastMuteState) {
    this._soundManager.unmute();
  }

  this._lastMuteState = muteSounds;

  this._disturbToggle.setToggleState(enabled);
}
