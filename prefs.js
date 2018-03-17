// -*- mode: js2; indent-tabs-mode: nil; js2-basic-offset: 4 -*-
// Adapted from lockkeys@vaina.lt

const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;
const Lang = imports.lang;
const GObject = imports.gi.GObject;

const Me = imports.misc.extensionUtils.getCurrentExtension();
const Settings = Me.imports.settings;

function init() {
}

function buildPrefsWidget() {
    settings = new Settings.SettingsManager();
    let frame = new Gtk.Box({orientation: Gtk.Orientation.VERTICAL,
        border_width: 10, margin: 20});
    frame.add(createCheckBox(settings.shouldShowIcon(), (b) => settings.setShowIcon(b), ("Enabled Icon"), ("Show an indicator icon when do not disturb is enabled.")));
    
    frame.show_all();
    return frame;
}

function createCheckBox(active, set, text, tooltip) {
    let box = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL });
    let label = new Gtk.Label({ label: text, xalign: 0, tooltip_text:tooltip });
    let widget = new Gtk.Switch({ active: active });
    widget.connect('notify::active', function(switch_widget) {
        set(switch_widget.active);
    });

    box.pack_start(label, true, true, 0);
    box.add(widget);
    return box;
}

