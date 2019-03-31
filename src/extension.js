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
  var icon = new Widget.DoNotDisturbIcon(new Settings.SettingsManager());
  var remote = new Settings.RemoteAPI();
  this.extension = new Extension(dnd, notificationCounter, toggle, icon, remote);

  // this._lastMuteState = false;
  // this._hasMutedSound = false;

  // this._soundManager = new System.AudioManager();
}

/**
 * Disables the extension. Tears down all UI components.
 */
function disable() {
  // let muteSounds = this._settings.shouldMuteSound();
  // if (muteSounds && this._hasMutedSound){
    // this._soundManager.unmute();
  // }
  this.extension.destroy();
}

/**
 * Updates the UI based on the _settings. Includes switching the toggle state and showing the status icon.
 */
function settingsChanged() {
  let muteSounds = this._settings.shouldMuteSound();

  if (enabled && muteSounds) {
    this._soundManager.mute();
    this._hasMutedSound = true;
  } else if ((muteSounds || this._lastMuteState) && this._hasMutedSound) {
    this._soundManager.unmute();
    this._hasMutedSound = false;
  }

  this._lastMuteState = muteSounds;

}
