const Lang = imports.lang;
const Main = imports.ui.main;
const PopupMenu = imports.ui.popupMenu;
const St = imports.gi.St;
const Clutter = imports.gi.Clutter;
const Gtk = imports.gi.Gtk;
const Gettext = imports.gettext.domain('gnome-shell-extension-do-not-disturb');
const _ = Gettext.gettext;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const Lib = Me.imports.lib;


/**
 * A class which handles the UI of the do not disturb toggle.
 */
class DoNotDisturbToggle {
  /**
   * Represents a do not disturb toggle in the calendar/notification popup.
   * @constructor
   */
  constructor() {
    this._connections = [];
  }

  /**
   * Shows the do not disturb toggle in the calendar/notification popup.
   */
  show() {
    this._clearButton = Main.panel.statusArea.dateMenu._messageList._clearButton;

    this._calendarBox = this._clearButton.get_parent();

    this._clearBox = new St.BoxLayout({
      vertical: false,
      x_expand: true,
      y_expand: false
    });


    this._disturbToggle = new PopupMenu.PopupSwitchMenuItem(_("Do not disturb"));

    this._disturbToggle.actor.add_style_class_name('do-not-disturb');
    this._disturbToggle.actor.set_x_expand(true);
    this._disturbToggle.actor.track_hover = false;

    this._disturbToggle.actor.set_x_align(Clutter.ActorAlign.START);
    this._disturbToggle.actor.remove_child(this._disturbToggle.label);
    this._disturbToggle.actor.add_child(this._disturbToggle.label);
    this._disturbToggle.label.set_y_align(Clutter.ActorAlign.CENTER);
    this._disturbToggle.actor.remove_child(this._disturbToggle._ornamentLabel);

    this._clearBox.add_actor(this._disturbToggle.actor);

    this._clearButton.reparent(this._clearBox);
    this._clearButton.add_style_class_name('clear-button');

    this._calendarBox.add_actor(this._clearBox);
  }

  /**
   * Destroys all UI elements of the toggle and returns the clear button to its proper location.
   */
  destroy() {
    if (this._disturbToggle) {
      this._connections.forEach((id) => {
        this._disturbToggle.disconnect(id);
      });
      this._connections = [];
      this._disturbToggle.destroy();
      this._disturbToggle = 0;
    }

    if (this._clearButton) {
      this._clearButton.reparent(this._calendarBox);
      this._clearButton.remove_style_class_name('clear-button');
    }

    if (this._clearBox) {
      this._clearBox.destroy();
      this._clearBox = 0;
    }
  }

  /**
   * Sets the activation state of the toggle.
   *
   * @param {boolean} state - The state of the toggle: true for on, false for off.
   */
  setToggleState(state) {
    if (this._disturbToggle) {
      this._disturbToggle.setToggleState(state);
    }
  }

  /**
   * Get the activation state of the toggle.
   *
   * @returns {boolean} - True if the toggle is on, false otherwise.
   */
  getToggleState() {
    if (this._disturbToggle) {
      return this._disturbToggle._switch.state;
    }
    return false;
  }

  /**
   * Calls a function when the toggle state changes.
   *
   * @param {() => ()} fn - The function to call when the toggle state changes.
   */
  onToggleStateChanged(fn) {
    if (this._disturbToggle) {
      var id = this._disturbToggle.connect("toggled", (item, event) => fn());
      this._connections.push(id);
    }
  }
}

/**
 * A class which handles the UI of the do not disturb status icon.
 */
class DoNotDisturbIcon {
  /**
   * Represents a do not disturb icon in the system status area of the panel.
   * @constructor
   */
  constructor(settingsManager, notificationCounter) {
    this._settings = settingsManager;
    this.notificationCounter = notificationCounter;
    this._indicatorArea = Main.panel._centerBox; //statusArea.aggregateMenu._indicators;

    let icon = "notification-disabled-symbolic";
    let fallback = "user-busy-symbolic";

    this._enabledIcon = new St.Icon({
      icon_name: icon,
      fallback_icon_name: fallback,
      style_class: 'popup-menu-icon do-not-disturb-icon'
    });

    this._countLbl = new St.Label();
    this.updateCount(0);
    this._countLbl.add_style_class_name("notification-count");

    this._iconBox = new St.BoxLayout();
    this._iconBox.add_actor(this._enabledIcon);
    this._iconBox.add_actor(this._countLbl);
    this.showDot = this._settings.showDot;
    this.showCount = this._settings.showCount;
    this.showIcon = this._settings.shouldShowIcon();
    this.shown = false;
    this.count = this.notificationCounter.notificationCount;
    this.updateCount(this.count);

    this._settings.onShowIconChanged(() => {
      this.showIcon = this._settings.shouldShowIcon();
      if (this.shown){
        this.hide();
        this.show();
      }
    });
    this._settings.onShowCountChanged(() => {
      this.showCount = this._settings.showCount;
      this.updateCount(this.count);
    });
    this._settings.onShowDotChanged(() => {
      this.showDot = this._settings.showDot;
      this.updateCount(this.count);
    });
    this.notificationListenerID = this.notificationCounter.addNotificationCountListener((count) => {
      this.updateCount(count);
    });
  }

  updateCount(newCount){
    this.count = newCount;
    if (newCount == 0){
      this._countLbl.add_style_class_name("hide-dot");
    } else {
      if (this.showCount){
        this._countLbl.set_text("" + newCount);
        this._countLbl.remove_style_class_name("hide-dot");
      } else if(this.showDot){
        this._countLbl.set_text("\u25CF");
        this._countLbl.remove_style_class_name("hide-dot");
      } else {
        this._countLbl.add_style_class_name("hide-dot");
      }

    }
  }

  /**
   * Shows the status icon.
   */
  show() {
    if (this.showIcon){
      this._indicatorArea.add_child(this._iconBox);
      Main.panel.statusArea.dateMenu._indicator.actor.add_style_class_name("hide-dot");
    }
    this.shown = true;
  }

  /**
   * Hides the status icon.
   */
  hide() {
    Main.panel.statusArea.dateMenu._indicator.actor.remove_style_class_name("hide-dot");
    if (this._iconBox.get_parent()) {
      this._indicatorArea.remove_child(this._iconBox);
    }
    this.shown = false;
  }

  /**
   * Destroys the status icon and removes it from the system status area.
   */
  destroy() {
    if (this._enabledIcon) {
      if (this._iconBox.get_parent()) {
        this._indicatorArea.remove_child(this._iconBox);
      }
      this._countLbl.destroy();
      this._countLbl = 0;
      this._enabledIcon.destroy();
      this._enabledIcon = 0;
      this._iconBox.destroy();
      this._iconBox = 0;
    }
    this._settings.disconnectAll();
    this.notificationCounter.removeNotificationCountListener(this.notificationListenerID);
  }
}

Lib.initTranslations(Me);
