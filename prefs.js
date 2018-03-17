// -*- mode: js2; indent-tabs-mode: nil; js2-basic-offset: 4 -*-
// Adapted from lockkeys@vaina.lt

const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;
const Lang = imports.lang;
const GObject = imports.gi.GObject;
const Config = imports.misc.config;

const Gettext = imports.gettext.domain('org-gnome-shell-extension-kylecorry31-do-not-disturb');
const _ = Gettext.gettext;

const Me = imports.misc.extensionUtils.getCurrentExtension();
const Lib = Me.imports.lib;

const SHOW_ICON = 'show-icon';

let _settings;

function init() {
    _settings = Lib.getSettings(Me);
}

function buildPrefsWidget() {
    let frame = new Gtk.Box({orientation: Gtk.Orientation.VERTICAL,
        border_width: 10, margin: 20});
    frame.add(_createCheckBox(SHOW_ICON, _("Enabled Icon"), _("Show an indicator icon when do not disturb is enabled.")));
    
    frame.show_all();
    return frame;
}

function _createCheckBox(key, text, tooltip) {
    let box = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL });
    let label = new Gtk.Label({ label: text, xalign: 0, tooltip_text:tooltip });
    let widget = new Gtk.Switch({ active: _settings.get_boolean(key) });
    widget.connect('notify::active', function(switch_widget) {
        _settings.set_boolean(key, switch_widget.active);
    });

    box.pack_start(label, true, true, 0);
    box.add(widget);
    return box;
}

