const Main = imports.ui.main;
const PopupMenu = imports.ui.popupMenu;
const Ornament = imports.ui.popupMenu.Ornament;
const Util = imports.misc.util;
const St = imports.gi.St;
const Gio = imports.gi.Gio;
// const Gtk = imports.gi.Gtk;

function init() {}

function enable() {
    this.mainMenu = Main.panel.statusArea['dateMenu'].menu;

    this.calendarBox = Main.panel.statusArea.dateMenu._messageList._clearButton.get_parent();

    this.disturbToggle = new PopupMenu.PopupSwitchMenuItem("Do not disturb");


    this.disturbToggle.connect("toggled", (item, event) => {
      this.set_do_not_disturb(event);
    });

    // this.disturbToggle.actor.set_x_align(Clutter.ActorAlign.START);
    this.calendarBox.add_actor(this.disturbToggle.actor);

    // this.mainMenu.addMenuItem(this.disturbSwitch);
    this.disturbToggle.setToggleState(is_do_not_disturb());
}

function set_do_not_disturb(enabled) {
    let settings = new Gio.Settings({ schema_id: 'org.gnome.desktop.notifications' });
    settings.set_boolean('show-banners', !enabled);
}

function is_do_not_disturb() {
  let settings = new Gio.Settings({ schema_id: 'org.gnome.desktop.notifications' });
  return !settings.get_boolean('show-banners');
}

function disable() {
    if(this.disturbToggle){
      this.disturbToggle.destroy();
      this.disturbToggle = 0;
    }
}