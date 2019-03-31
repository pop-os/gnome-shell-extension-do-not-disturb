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
  var toggle = new Widget.DoNotDisturbToggle();
  var indicator = new Widget.DoNotDisturbIcon(new Settings.SettingsManager(), new System.NotificationManager());
  var remote = new Settings.RemoteAPI();
  var audio = new System.AudioManager(new Settings.SettingsManager());
  this.extension = new Extension(dnd, toggle, indicator, remote, audio);
}

/**
 * Disables the extension. Tears down all UI components.
 */
function disable() {
  this.extension.destroy();
}
