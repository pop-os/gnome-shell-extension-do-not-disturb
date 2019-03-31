const Gio = imports.gi.Gio;
const Lang = imports.lang;
const GLib = imports.gi.GLib;
const Main = imports.ui.main;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const GnomeSession = imports.misc.gnomeSession;
const Settings = Me.imports.settings;

/**
 * A class for interacting with the Gnome Presence API.
 */
class GnomePresence {
  /**
   * Construct a new GnomePresence proxy.
   */
  constructor() {
    this._presence = new GnomeSession.Presence();
  }

  /**
   * Set the status of GnomePresence.
   * @param  {number} newStatus A GnomeSession.PresenceStatus status constant to switch to.
   */
  set status(newStatus) {
    this._presence.SetStatusSync(newStatus);
  }

  /**
   * Get the status of GnomePresence.
   * @return {number} The current GnomeSession.PresenceStatus status.
   */
  get status() {
    return this._presence.status;
  }

  /**
   * Add a listener to the GnomePresence status.
   * @param {Function} fn The function to run when the status is changed (passed the current status).
   * @return {number} The ID of the listener, used by removeStatusListener.
   */
  addStatusListener(fn) {
    return this._presence.connectSignal('StatusChanged', (proxy, _sender, [status]) => {
      if (proxy.status != status) {
        fn(status);
      }
    });
  }

  /**
   * Remove a status listener to the GnomePresence status.
   * @param  {number} listenerID The ID of the listener to remove.
   */
  removeStatusListener(listenerID) {
    this._presence.disconnectSignal(listenerID);
  }
}

/**
 * A class for managing the audio on Gnome.
 */
class AudioManager {

  constructor(settingsManager){
    this._settings = settingsManager;
    this.shouldMute = this._settings.shouldMuteSound();
    this.muted = false;
    this._settings.onMuteSoundChanged(() => {
      var shouldMute = this._settings.shouldMuteSound();
      if (this.muted && shouldMute){
        this._internalMute();
      } else if (this.muted && !shouldMute){
        this._internalUnmute();
      }
      this.shouldMute = shouldMute;
    });
  }

  _internalMute(){
    _runCmd(["amixer", "-q", "-D", "pulse", "sset", "Master", "mute"]);
  }

  _internalUnmute(){
    _runCmd(["amixer", "-q", "-D", "pulse", "sset", "Master", "unmute"]);
  }

  /**
   * Mute the audio stream.
   */
  mute() {
    this.muted = true;
    if (this.shouldMute){
      this._internalMute();
    }
  }

  /**
   * Unmute the audio stream.
   */
  unmute() {
    this.muted = false;
    if (this.shouldMute){
      this._internalUnmute();
    }
  }
}

class NotificationManager {

  constructor() {
  }

  /**
   * Get the current number of notifications in the system tray.
   * @return {number} The number of notifications.
   */
  get notificationCount(){
    var count = 0;
    Main.messageTray.getSources().forEach(n => count += n.count);
    return count;
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
   * @return {number array} The IDs of the listeners.
   */
  addNotificationCountListener(fn){
    var id1 = Main.messageTray.connect('source-added', () => fn(this.notificationCount));
    var id2 = Main.messageTray.connect('source-removed', () => fn(this.notificationCount));
    var id3 = Main.messageTray.connect('queue-changed', () => fn(this.notificationCount));

    return [id1, id2, id3];
  }

  /**
   * Remove a notification count listener.
   * @param  {number array} ids The ID of the listener to remove.
   */
  removeNotificationCountListener(ids){
    ids.forEach((id) => {
      Main.messageTray.disconnect(id);
    })
  }
}

function _runCmd(cmd) {
  GLib.spawn_sync(null, cmd, null, GLib.SpawnFlags.SEARCH_PATH, null);
}
