const Main = imports.ui.main;
const PopupMenu = imports.ui.popupMenu;
const Ornament = imports.ui.popupMenu.Ornament;
const Util = imports.misc.util;
const St = imports.gi.St;
const Gio = imports.gi.Gio;
const Clutter = imports.gi.Clutter;

function init() {}

function enable() {
    this.clearButton = Main.panel.statusArea.dateMenu._messageList._clearButton;

    this.calendarBox = this.clearButton.get_parent();

    this.clearBox = new St.BoxLayout({ vertical: false,
                                       x_expand: true,
                                       y_expand: false });


    this.disturbToggle = new PopupMenu.PopupSwitchMenuItem("Do not disturb");

    this.disturbToggle.actor.add_style_class_name('do-not-disturb');
    this.disturbToggle.actor.set_x_expand(true);

    this.disturbToggle.connect("toggled", (item, event) => {
      this.set_do_not_disturb(event);
    });

    this.disturbToggle.actor.set_x_align(Clutter.ActorAlign.START);

    this.clearButton.set_height(this.disturbToggle.actor.get_height());
    this.clearBox.add_actor(this.disturbToggle.actor);
    this.clearButton.reparent(this.clearBox);
    this.clearButton.add_style_class_name('clear-button');

    this.calendarBox.add_actor(this.clearBox);

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