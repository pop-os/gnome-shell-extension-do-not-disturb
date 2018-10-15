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
var DoNotDisturbToggle = new Lang.Class({
	Name: 'DoNotDisturbToggle',

	/**
	 * Represents a do not disturb toggle in the calendar/notification popup.
	 * @constructor
	 */
	_init(){
		this._connections = [];
	},

	/**
	 * Shows the do not disturb toggle in the calendar/notification popup.
	 */
	show(){
		this._clearButton = Main.panel.statusArea.dateMenu._messageList._clearButton;
	    this._clearButtonHeight = this._clearButton.get_height();

	    this._calendarBox = this._clearButton.get_parent();

	    this._clearBox = new St.BoxLayout({ vertical: false,
	                                       x_expand: true,
	                                       y_expand: false });


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


	    this._clearButton.set_height(this._disturbToggle.actor.get_height());
	    this._clearButton.reparent(this._clearBox);
	    this._clearButton.add_style_class_name('clear-button');

	    this._calendarBox.add_actor(this._clearBox);
	},

	/**
	 * Destroys all UI elements of the toggle and returns the clear button to its proper location.
	 */
	destroy(){
		if(this._disturbToggle){
				this._connections.forEach((id) => {
					this._disturbToggle.disconnect(id);
				});
				this._connections = [];
	      this._disturbToggle.destroy();
	      this._disturbToggle = 0;
    	}

    	if(this._clearButton){
		    this._clearButton.reparent(this._calendarBox);
		    this._clearButton.set_height(this._clearButtonHeight);
		    this._clearButton.remove_style_class_name('clear-button');
		}

	    if(this._clearBox){
	      this._clearBox.destroy();
	      this._clearBox = 0;
	    }
	},

	/**
	 * Sets the activation state of the toggle.
	 *
	 * @param {boolean} state - The state of the toggle: true for on, false for off.
	 */
	setToggleState(state){
		if(this._disturbToggle){
			this._disturbToggle.setToggleState(state);
		}
	},

	/**
	 * Get the activation state of the toggle.
	 *
	 * @returns {boolean} - True if the toggle is on, false otherwise.
	 */
	getToggleState(){
		if(this._disturbToggle){
			return this._disturbToggle._switch.state;
		}
		return false;
	},

	/**
	 * Calls a function when the toggle state changes.
	 *
	 * @param {() => ()} fn - The function to call when the toggle state changes.
	 */
	onToggleStateChanged(fn){
		if(this._disturbToggle){
			var id = this._disturbToggle.connect("toggled", (item, event) => fn());
			this._connections.push(id);
		}
	},
});

/**
 * A class which handles the UI of the do not disturb status icon.
 */
var DoNotDisturbIcon = new Lang.Class({
	Name: 'DoNotDisturbIcon',

	/**
	 * Represents a do not disturb icon in the system status area of the panel.
	 * @constructor
	 */
	_init(){
			this._indicatorArea = Main.panel._centerBox;//statusArea.aggregateMenu._indicators;

			let icon = "notification-disabled-symbolic";
			let fallback = "user-offline-symbolic";

			let iconTheme = Gtk.IconTheme.get_default();
			if(!iconTheme.has_icon(icon)){
				icon = fallback;
			}

	    this._enabledIcon = new St.Icon({
	            icon_name: icon,
	            style_class: 'popup-menu-icon do-not-disturb-icon'
	    });
	},

	/**
	 * Shows the status icon.
	 */
	show(){
		this._indicatorArea.add_child(this._enabledIcon);
	},

	/**
	 * Hides the status icon.
	 */
	hide(){
		this._indicatorArea.remove_child(this._enabledIcon);
	},

	/**
	 * Destroys the status icon and removes it from the system status area.
	 */
	destroy(){
		if(this._enabledIcon){
	      this._indicatorArea.remove_child(this._enabledIcon);
	      this._enabledIcon.destroy();
	      this._enabledIcon = 0;
	    }
	},
});

var HideDotController = new Lang.Class({
	Name: 'HideDotController',

	_init(){
		this._dot = Main.panel._centerBox.get_child_at_index(0).get_child_at_index(0).get_first_child().get_child_at_index(2);
	},

	hideDot(){
		if(this._dot){
			this._dot.add_style_class_name("hide-dot");
		}
	},

	unhideDot(){
		if(this._dot){
			this._dot.remove_style_class_name("hide-dot");
		}
	},

});

Lib.initTranslations(Me);
