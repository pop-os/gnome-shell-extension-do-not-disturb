const Main = imports.ui.main;
const PopupMenu = imports.ui.popupMenu;
const Ornament = imports.ui.popupMenu.Ornament;
const Util = imports.misc.util;
const St = imports.gi.St;

function init() {}

function enable() {
    this.mainMenu = Main.panel.statusArea['aggregateMenu'].menu;

    this.disturbToggle = new PopupMenu.PopupSwitchMenuItem("Do Not Disturb");
    this.disturbToggle.connect("toggled", (item, event) => {
      this.set_do_not_disturb(event);
    });

    this.mainMenu.addMenuItem(this.disturbToggle);
    // Todo find if do not disturb already enabled

}

function set_do_not_disturb(enabled) {
    Util.trySpawn(["gsettings", "set", "org.gnome.desktop.notifications", "show-banners", (!enabled).toString()]);
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