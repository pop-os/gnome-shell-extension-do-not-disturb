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

  /**
   * Sets whether to show the count of notifications or not.
   * @param  {Boolean} newShowCount True if the notification count should be shown.
   */
  set showCount(newShowCount){
    this._appSettings.set_boolean('show-count', newShowCount);
  }

  /**
   * Determines whether to show the notification count.
   * @return {Boolean} True if the notification count should be shown.
   */
  get showCount(){
    return this._appSettings.get_boolean('show-count');
  }

  /**
   * Calls a function when the status of the show count setting has changed.
   *
   * @param {() => ()} fn - The function to call when the show count setting is changed.
   */
  onShowCountChanged(fn){
    var id = this._appSettings.connect('changed::show-count', fn);
    this.connections.push(id);
  }

  /**
   * Sets whether to show an indicator of hidden notifications or not.
   * @param  {Boolean} newShowDot True if the notification dot should be shown.
   */
  set showDot(newShowDot){
    this._appSettings.set_boolean('show-dot', newShowDot);
  }

  /**
   * Determines whether to show the notification dot.
   * @return {Boolean} True if the notification dot should be shown.
   */
  get showDot(){
    return this._appSettings.get_boolean('show-dot');
  }

  /**
   * Calls a function when the status of the show dot setting has changed.
   *
   * @param {() => ()} fn - The function to call when the show dot setting is changed.
   */
  onShowDotChanged(fn){
    var id = this._appSettings.connect('changed::show-dot', fn);
    this.connections.push(id);
  }

  disconnectAll() {
    this.connections.forEach((id) => {
      this._appSettings.disconnect(id);
    });
    this.connections = [];
  }

}

class RemoteAPI {
  constructor() {
    this._appSettings = _getSettings();
    this.listeners = [];

    this.id = this._appSettings.connect('changed::do-not-disturb', () => {
      this.listeners.forEach((fn) => fn(this.getRemote()));
    });
  }

  /**
   * Calls a function when the status of the do not disturb setting has changed.
   *
   * @param {() => ()} listener - The function to call when the do not disturb setting is changed.
   */
  addRemoteListener(listener) {
    if (listener == null){
      return -1;
    }
    if (this.listeners.length == 0){
      this.id = this._appSettings.connect('changed::do-not-disturb', () => {
        this.listeners.forEach((fn) => fn(this.getRemote()));
      });
    }
    return this.listeners.push(listener) - 1;
  }

  removeRemoteListener(id) {
    if (id < 0 || id >= this.listeners.length){
      return;
    }
    this.listeners.splice(id, 1);
    if (this.listeners.length == 0) {
      this._appSettings.disconnect(this.id);
    }
  }

  /**
   * @return {Boolean} true if the external do not disturb is on, false otherwise
   */
  getRemote() {
    return this._appSettings.get_boolean('do-not-disturb');
  }

  /**
   * @param {Boolean} dnd true if the external do not disturb should be on, false otherwise
   */
  setRemote(dnd) {
    this._appSettings.set_boolean('do-not-disturb', dnd);
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
