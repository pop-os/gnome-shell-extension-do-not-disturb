const Main = imports.ui.main;
const PopupMenu = imports.ui.popupMenu;
const Ornament = imports.ui.popupMenu.Ornament;
const Util = imports.misc.util;
const St = imports.gi.St;
const Gio = imports.gi.Gio;
const Clutter = imports.gi.Clutter;

const Gettext = imports.gettext.domain('org-gnome-shell-extension-kylecorry31-do-not-disturb');
const _ = Gettext.gettext;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const Lib = Me.imports.lib;

let _settings;

function init() {
  _settings = Lib.getSettings(Me);
}

function enable() {
    this.indicatorArea = Main.panel.statusArea.aggregateMenu._indicators;

    this.enabledIcon = new St.Icon({
            icon_name: 'notification-disabled-symbolic',
            style_class: 'popup-menu-icon'
    });

    this.clearButton = Main.panel.statusArea.dateMenu._messageList._clearButton;
    this.clearButtonHeight = this.clearButton.get_height();

    this.calendarBox = this.clearButton.get_parent();

    this.clearBox = new St.BoxLayout({ vertical: false,
                                       x_expand: true,
                                       y_expand: false });


    this.disturbToggle = new PopupMenu.PopupSwitchMenuItem("Do not disturb");

    this.disturbToggle.actor.add_style_class_name('do-not-disturb');
    this.disturbToggle.actor.set_x_expand(true);

    this.disturbToggle.connect("toggled", (item, event) => _toggle());

    this.disturbToggle.actor.set_x_align(Clutter.ActorAlign.START);
    this.disturbToggle.actor.remove_child(this.disturbToggle.label);
    this.disturbToggle.actor.add_child(this.disturbToggle.label);
    this.disturbToggle.actor.remove_child(this.disturbToggle._ornamentLabel);

    this.clearBox.add_actor(this.disturbToggle.actor);


    this.clearButton.set_height(this.disturbToggle.actor.get_height());
    this.clearButton.reparent(this.clearBox);
    this.clearButton.add_style_class_name('clear-button');

    this.calendarBox.add_actor(this.clearBox);

    this.settings = new Gio.Settings({ schema_id: 'org.gnome.desktop.notifications'});
    this.settings.connect('changed::show-banners', () => _sync());

    _settings.connect('changed::show-icon', () => _sync());

    this._sync();
}

function set_do_not_disturb(enabled) {
    this.settings.set_boolean('show-banners', !enabled);
    this._sync();
}

function is_do_not_disturb() {
  return !this.settings.get_boolean('show-banners');
}

function disable() {
    if(this.disturbToggle){
      this.disturbToggle.destroy();
      this.disturbToggle = 0;
    }
    this.clearButton.reparent(this.calendarBox);
    this.clearButton.set_height(this.clearButtonHeight);
    this.clearButton.remove_style_class_name('clear-button');

    if(this.clearBox){
      this.clearBox.destroy();
      this.clearBox = 0;
    }

    if(this.enabledIcon){
      this.indicatorArea.remove_child(this.enabledIcon);
      this.enabledIcon.destroy();
      this.enabledIcon = 0;
    }
}

function _toggle(){
  let status = is_do_not_disturb();
  this.settings.set_boolean('show-banners', status);
  this._sync();
}

function _sync(){
  let enabled = is_do_not_disturb();
  let showIcon = _settings.get_boolean("show-icon");
  if(enabled && showIcon){
        this.indicatorArea.insert_child_at_index(this.enabledIcon, 0);
  } else {
    this.indicatorArea.remove_child(this.enabledIcon);
  }

  this.disturbToggle.setToggleState(enabled);
}