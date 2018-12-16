const Gio = imports.gi.Gio;
const Lang = imports.lang;
const GLib = imports.gi.GLib;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const GnomeSession = imports.misc.gnomeSession;
const Settings = Me.imports.settings;


var AudioManager = new Lang.Class({
	Name: 'AudioManager',

	mute(){
		_runCmd(["amixer", "-q", "-D", "pulse", "sset", "Master", "mute"]);
	},

	unmute(){
		_runCmd(["amixer", "-q", "-D", "pulse", "sset", "Master", "unmute"]);
	}
})


var NotificationManager = new Lang.Class({
	Name: 'NotificationManager',

	/**
	 *
	 * @constructor
	 */
	_init(){
		this._appConnections = [];
		this._appSettings = Settings._getSettings();
		this._presence = new GnomeSession.Presence((proxy, error) => {
    	this.setDoNotDisturb(proxy.status == GnomeSession.PresenceStatus.BUSY);
    });
		this._id = this._presence.connectSignal('StatusChanged', (proxy, sender, [status]) => {
    	this.setDoNotDisturb(status == GnomeSession.PresenceStatus.BUSY);
    });
		this.onDoNotDisturbChanged(() => {
			this.setDoNotDisturb(this.getDoNotDisturb());
		});
	},

  setDoNotDisturb(doNotDisturb){
		this._presence.SetStatusRemote(doNotDisturb ? GnomeSession.PresenceStatus.BUSY
                                             : GnomeSession.PresenceStatus.AVAILABLE);
		if (doNotDisturb != this.getDoNotDisturb()){
    	this._appSettings.set_boolean('do-not-disturb', doNotDisturb);
		}
  },

	getDoNotDisturb(){
		return this._appSettings.get_boolean('do-not-disturb');
	},

	onDoNotDisturbChanged(fn){
		var id = this._appSettings.connect('changed::do-not-disturb', fn);
		this._appConnections.push(id);
    return id;
	},

	disconnectAll(){
		this._appConnections.forEach((id) => {
			this._appSettings.disconnect(id);
		});
		this._appConnections = [];


	}
});

function _runCmd(cmd){
  var [res, stdout, stderr, status] = GLib.spawn_sync(
        null,
        cmd,
        null,
        GLib.SpawnFlags.SEARCH_PATH,
        null);
}
