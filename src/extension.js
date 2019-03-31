const Me = imports.misc.extensionUtils.getCurrentExtension();
const Settings = Me.imports.settings;
const System = Me.imports.system;
const Widget = Me.imports.widgets;
const DND = Me.imports.doNotDisturb;
const Extension = Me.imports.dndExtension.Extension;

/**
 * Called when the extension is loaded.
 */
function init() {}

/**
 * Enable the do not disturb extension. Adds all UI elements and monitors the settings object.
 */
function enable() {
  var dnd = new DND.DoNotDisturb(new System.GnomePresence());
  var notificationCounter = new System.NotificationManager();
  var toggle = new Widget.DoNotDisturbToggle();
  var icon = new Widget.DoNotDisturbIcon();
  this.extension = new Extension(dnd, notificationCounter, toggle, icon);

  // this._lastMuteState = false;
  // this._hasMutedSound = false;

  // this._settings = new Settings.SettingsManager();
  // this._soundManager = new System.AudioManager();
  // this._notificationManager = new System.NotificationManager();
  // this._enabledIcon.updateCount(this._notificationManager.notificationCount)

  // _addListeners();
}

function _addListeners(){
  // this.notificationListenerID = this._notificationManager.addNotificationCountListener((count) => {
    // this._enabledIcon.updateCount(count);
  // });
  // this.dndListener = this.dnd.addStatusListener((enabled) => _sync(enabled));
  // this._disturbToggle.onToggleStateChanged(() => _setDND(this._disturbToggle.getToggleState()));
  // _onUserSettingsChanged(() => _sync(this.dnd.isEnabled()));
  // this._settings.onExternalDoNotDisturbChanged(() => _setDND(this._settings.getExternalDoNotDisturb()));
}

/**
 * Disables the extension. Tears down all UI components.
 */
function disable() {
  // this._notificationManager.removeNotificationCountListener(this.notificationListenerID);
  // this._disturbToggle.destroy();
  // this._enabledIcon.destroy();
  // this.dnd.removeStatusListener(this.dndListener);
  // this._settings.disconnectAll();
  // this.dnd.disable();
  // let muteSounds = this._settings.shouldMuteSound();
  // if (muteSounds && this._hasMutedSound){
    // this._soundManager.unmute();
  // }
  this.extension.destroy();
}

/**
 * Updates the UI based on the _settings. Includes switching the toggle state and showing the status icon.
 */
function _sync(enabled) {
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
    this._hasMutedSound = true;
  } else if ((muteSounds || this._lastMuteState) && this._hasMutedSound) {
    this._soundManager.unmute();
    this._hasMutedSound = false;
  }

  this._lastMuteState = muteSounds;

  if (enabled != this._disturbToggle.getToggleState()){
    this._disturbToggle.setToggleState(enabled);
  }

  if (enabled != this._settings.getExternalDoNotDisturb()){
    this._settings.setExternalDoNotDisturb(enabled);
  }
}
