const Gio = imports.gi.Gio;
const Gettext = imports.gettext.domain('org-gnome-shell-extension-kylecorry31-do-not-disturb');
const _ = Gettext.gettext;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const Lib = Me.imports.lib; // TODO: Replace this

var SettingsManager = new Lang.Class({
	Name: 'SettingsManager',

	_init(){
		this._appSettings = Lib.getSettings(Me);
		this._notificationSettings = new Gio.Settings({ schema_id: 'org.gnome.desktop.notifications'});
	},

	setDoNotDisturb(enabled){
		this._notificationSettings.set_boolean('show-banners', !enabled);
	},

	isDoNotDisturb(){
		return !this._notificationSettings.get_boolean('show-banners');
	},

	onDoNotDisturbChanged(fn){
		this._notificationSettings.connect('changed::show-banners', () => fn(isDoNotDisturb()));
	},

	setShowIcon(showIcon){
		this._appSettings.set_boolean('show-icon', showIcon);
	},

	shouldShowIcon(){
		return this._appSettings.get_boolean('show-icon', showIcon);
	},

	onShowIconChanged(fn){
		this._appSettings.connect('changed::show-icon', () => fn(shouldShowIcon()));
	}


});