const Gio = imports.gi.Gio;
const Lang = imports.lang;
const GLib = imports.gi.GLib;
const Me = imports.misc.extensionUtils.getCurrentExtension();

/**
 * A class which handles all interactions with the settings.
 */
class SettingsManager {
  /**
   * Represents a settings repository, where settings can be modified and read.
   * @constructor
   */
  constructor() {
    this.connections = [];
    this._appSettings = _getSettings();
  }


  /**
   * Enable or disable the icon in the system panel when do not disturb mode is enabled.
   *
   * @param  {boolean} showIcon - True if the icon should be shown, false otherwise.
   */
  setShowIcon(showIcon) {
    this._appSettings.set_boolean('show-icon', showIcon);
  }

  /**
   * Determines if the icon should be shown or not.
   *
   * @returns {boolean} - True if the icon should be shown when do not disturb is enabled, false otherwise.
   */
  shouldShowIcon() {
    return this._appSettings.get_boolean('show-icon');
  }

  /**
   * Calls a function when the status of the show icon setting has changed.
   *
   * @param {() => ()} fn - The function to call when the show icon setting is changed.
   */
  onShowIconChanged(fn) {
    var id = this._appSettings.connect('changed::show-icon', fn);
    this.connections.push(id);
  }

  /**
   * Determines if the sound should be muted when do not disturb is enabled.
   *
   * @returns {boolean} - True if the sound should be muted when do not disturb is enabled, false otherwise.
   */
  shouldMuteSound() {
    return this._appSettings.get_boolean('mute-sounds');
  }

  /**
   * Enable or disable the muting of sound when do not disturb mode is enabled.
   *
   * @param  {boolean} muteSound - True if the sound should be muted when do not disturb is enabled, false otherwise.
   */
  setShouldMuteSound(muteSound) {
    this._appSettings.set_boolean('mute-sounds', muteSound);
  }

  /**
   * Calls a function when the status of the mute sounds setting has changed.
   *
   * @param {() => ()} fn - The function to call when the mute sounds setting is changed.
   */
  onMuteSoundChanged(fn) {
    var id = this._appSettings.connect('changed::mute-sounds', fn);
    this.connections.push(id);
  }

  disconnectAll() {
    this.connections.forEach((id) => {
      this._appSettings.disconnect(id);
    });
    this.connections = [];
  }

}


/**
 * A helper function to get the application specific settings. Adapted
 * from the System76 Pop Suspend Button extension: https://github.com/pop-os/gnome-shell-extension-pop-suspend-button
 *
 * @returns {Gio.Settings} - The application specific settings object.
 */
function _getSettings() {
  let schemaName = 'org.gnome.shell.extensions.kylecorry31-do-not-disturb';
  let schemaDir = Me.dir.get_child('schemas').get_path();

  // Extension installed in .local
  if (GLib.file_test(schemaDir + '/gschemas.compiled', GLib.FileTest.EXISTS)) {
    let schemaSource = Gio.SettingsSchemaSource.new_from_directory(schemaDir,
      Gio.SettingsSchemaSource.get_default(),
      false);
    let schema = schemaSource.lookup(schemaName, false);

    return new Gio.Settings({
      settings_schema: schema
    });
  }
  // Extension installed system-wide
  else {
    if (Gio.Settings.list_schemas().indexOf(schemaName) == -1)
      throw "Schema \"%s\" not found.".format(schemaName);
    return new Gio.Settings({
      schema: schemaName
    });
  }
}
