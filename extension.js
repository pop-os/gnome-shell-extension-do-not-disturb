const Main = imports.ui.main;
const PopupMenu = imports.ui.popupMenu;
const Ornament = imports.ui.popupMenu.Ornament;
const Util = imports.misc.util;
const St = imports.gi.St;
const Gio = imports.gi.Gio;

function init() {}

function enable() {
    this.mainMenu = Main.panel.statusArea['dateMenu'].menu;


    this.disturbToggle = new PopupMenu.PopupSwitchMenuItem("Do not disturb");
    this.disturbToggle.connect("toggled", (item, event) => {
      this.set_do_not_disturb(event);
    });

    this.mainMenu.addMenuItem(this.disturbToggle);
    // Todo find if do not disturb already enabled

}

function set_do_not_disturb(enabled) {
    let settings = new Gio.Settings({ schema_id: 'org.gnome.desktop.notifications' });
    settings.set_boolean('show-banners', !enabled);
}

function disable() {
    // if (this.light) {
    //     this.light.destroy();
    //     this.light = 0;
    // }
    if(this.disturbToggle){
      this.disturbToggle.destroy();
      this.disturbToggle = 0;
    }
}