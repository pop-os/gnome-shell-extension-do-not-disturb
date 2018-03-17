const Gio = imports.gi.Gio;
const Lang = imports.lang;
const GLib = imports.gi.GLib;
const Me = imports.misc.extensionUtils.getCurrentExtension();


var SettingsManager = new Lang.Class({
	Name: 'SettingsManager',

	_init(){
		this._appSettings = _getSettings();
		this._notificationSettings = new Gio.Settings({ schema_id: 'org.gnome.desktop.notifications'});
	},

	setDoNotDisturb(enabled){
		this._notificationSettings.set_boolean('show-banners', !enabled);
	},

	isDoNotDisturb(){
		return !this._notificationSettings.get_boolean('show-banners');
	},

	onDoNotDisturbChanged(fn){
		this._notificationSettings.connect('changed::show-banners', fn);
	},

	setShowIcon(showIcon){
		this._appSettings.set_boolean('show-icon', showIcon);
	},

	shouldShowIcon(){
		return this._appSettings.get_boolean('show-icon');
	},

	onShowIconChanged(fn){
		this._appSettings.connect('changed::show-icon', fn);
	},
});


function _getSettings() {
    let schemaName = 'org.gnome.shell.extensions.kylecorry31-do-not-disturb';
    let schemaDir = Me.dir.get_child('schemas').get_path();

    // Extension installed in .local
    if (GLib.file_test(schemaDir + '/gschemas.compiled', GLib.FileTest.EXISTS)) {
        let schemaSource = Gio.SettingsSchemaSource.new_from_directory(schemaDir,
                                  Gio.SettingsSchemaSource.get_default(),
                                  false);
        let schema = schemaSource.lookup(schemaName, false);

        return new Gio.Settings({ settings_schema: schema });
    }
    // Extension installed system-wide
    else {
        if (Gio.Settings.list_schemas().indexOf(schemaName) == -1)
            throw "Schema \"%s\" not found.".format(schemaName);
        return new Gio.Settings({ schema: schemaName });
    }
}