const Main = imports.ui.main;
const PopupMenu = imports.ui.popupMenu;
const Ornament = imports.ui.popupMenu.Ornament;
const Util = imports.misc.util;
const St = imports.gi.St;
const Gio = imports.gi.Gio;
const Clutter = imports.gi.Clutter;

const Me = imports.misc.extensionUtils.getCurrentExtension();
const Settings = Me.imports.settings_manager; 


function init() {
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
    this.disturbToggle.actor.track_hover = false;

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

    this.settings = new Settings.SettingsManager();

    this.settings.onDoNotDisturbChanged(this._sync);
    this.settings.onShowIconChanged(this._sync);

    this._sync();
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
  let status = isDoNotDisturb();
  this.settings.setDoNotDisturb(!status);
  this._sync();
}

function _sync(){
  let enabled = this.settings.isDoNotDisturb();
  let showIcon = this.settings.shouldShowIcon();
  if(enabled && showIcon){
        this.indicatorArea.insert_child_at_index(this.enabledIcon, 0);
  } else {
    this.indicatorArea.remove_child(this.enabledIcon);
  }

  this.disturbToggle.setToggleState(enabled);
}