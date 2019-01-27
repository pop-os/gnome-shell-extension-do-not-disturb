// -*- mode: js2; indent-tabs-mode: nil; js2-basic-offset: 4 -*-
// Adapted from lockkeys@vaina.lt and https://github.com/pop-os/gnome-shell-extension-pop-suspend-button

const Gtk = imports.gi.Gtk;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const Gettext = imports.gettext.domain('gnome-shell-extension-do-not-disturb');
const _ = Gettext.gettext;
const Settings = Me.imports.settings;
const Lib = Me.imports.lib;

function init() {}

/**
 * Builds the GTK widget which displays all of the application specific settings.
 *
 * @returns {Gtk.Box} - The frame to display.
 */
function buildPrefsWidget() {
  let settings = new Settings.SettingsManager();
  let frame = new Gtk.Box({
    orientation: Gtk.Orientation.VERTICAL,
    border_width: 10,
    margin: 20,
    spacing: 8
  });

  var box = new Gtk.Box({
    orientation: Gtk.Orientation.HORIZONTAL
  });

  frame.add(createSwitch(settings.shouldShowIcon(), (b) => {settings.setShowIcon(b); if (b) { box.show(); } else { box.hide(); } }, _("Enabled Icon"), _("Show an indicator icon when do not disturb is enabled.")));

  var indicatorLbl = new Gtk.Label({
    label: "Notification Indicator",
    xalign: 0
  });

  var showCountRadio = createRadioButton(settings.showCount, (b) => { settings.showCount = b }, _("Count"));
  var showDotRadio = createRadioButton(settings.showDot, (b) => { settings.showDot = b }, _("Dot"), showCountRadio);
  var showNothingRadio = createRadioButton(!(settings.showCount || settings.showDot), (b) => { }, _("Nothing"), showCountRadio);


  box.pack_start(indicatorLbl, true, true, 0);
  box.add(showCountRadio);
  box.add(showDotRadio);
  box.add(showNothingRadio);

  frame.add(box);

  frame.add(createSwitch(settings.shouldMuteSound(), (b) => settings.setShouldMuteSound(b), _("Mute Sounds"), _("Mutes all sound when do not disturb is enabled.")));

  frame.show_all();

  if (!settings.shouldShowIcon()){
    box.hide();
  }

  return frame;
}

function createRadioButton(active, set, text, group){
  var widget;
  if (group){
    widget = Gtk.RadioButton.new_with_label_from_widget(group, text);
    widget.set_active(active);
  } else {
    widget = new Gtk.RadioButton({
      active: active,
      label: text
    });
  }
  widget.connect('notify::active', function(switch_widget) {
    set(switch_widget.active);
  });

  return widget;
}

/**
 * Creates a switch setting.
 *
 * @param {boolean} active - The starting state of the switch.
 * @param {(boolean) => ()} set - The setter function which is passed the value of the switch on state change.
 * @param {string} text - The label of the widget.
 * @param {string} tooltip - The description text to display on hover.
 * @returns {Gtk.Box} - The widget containing the switch and label.
 */
function createSwitch(active, set, text, tooltip) {
  let box = new Gtk.Box({
    orientation: Gtk.Orientation.HORIZONTAL
  });
  let label = new Gtk.Label({
    label: text,
    xalign: 0,
    tooltip_text: tooltip
  });
  let widget = new Gtk.Switch({
    active: active
  });
  widget.connect('notify::active', function(switch_widget) {
    set(switch_widget.active);
  });

  box.pack_start(label, true, true, 0);
  box.add(widget);
  return box;
}

Lib.initTranslations(Me);
