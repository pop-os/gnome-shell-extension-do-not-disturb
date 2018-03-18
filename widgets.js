const Lang = imports.lang;
const Main = imports.ui.main;
const PopupMenu = imports.ui.popupMenu;
const St = imports.gi.St;
const Clutter = imports.gi.Clutter;

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
	},

	/**
	 * Shows the do not disturb toggle in the calendar/notification popup.
	 */
	show(){
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

	    this.disturbToggle.actor.set_x_align(Clutter.ActorAlign.START);
	    this.disturbToggle.actor.remove_child(this.disturbToggle.label);
	    this.disturbToggle.actor.add_child(this.disturbToggle.label);
	    this.disturbToggle.actor.remove_child(this.disturbToggle._ornamentLabel);

	    this.clearBox.add_actor(this.disturbToggle.actor);


	    this.clearButton.set_height(this.disturbToggle.actor.get_height());
	    this.clearButton.reparent(this.clearBox);
	    this.clearButton.add_style_class_name('clear-button');

	    this.calendarBox.add_actor(this.clearBox);
	},

	/**
	 * Destroys all UI elements of the toggle and returns the clear button to its proper location.
	 */
	destroy(){
		if(this.disturbToggle){
	      this.disturbToggle.destroy();
	      this.disturbToggle = 0;
    	}

    	if(this.clearButton){
		    this.clearButton.reparent(this.calendarBox);
		    this.clearButton.set_height(this.clearButtonHeight);
		    this.clearButton.remove_style_class_name('clear-button');
		}

	    if(this.clearBox){
	      this.clearBox.destroy();
	      this.clearBox = 0;
	    }
	},

	/**
	 * Sets the activation state of the toggle.
	 * 
	 * @param {boolean} state - The state of the toggle: true for on, false for off.
	 */
	setToggleState(state){
		if(this.disturbToggle){
			this.disturbToggle.setToggleState(state);
		}
	},

	/**
	 * Get the activation state of the toggle.
	 * 
	 * @returns {boolean} - True if the toggle is on, false otherwise.
	 */
	getToggleState(){
		if(this.disturbToggle){
			return this.disturbToggle._switch.state;
		}
		return false;
	},

	/**
	 * Calls a function when the toggle state changes.
	 * 
	 * @param {() => ()} fn - The function to call when the toggle state changes.
	 */
	onToggleStateChanged(fn){
		if(this.disturbToggle){
			this.disturbToggle.connect("toggled", (item, event) => fn());
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
		this.indicatorArea = Main.panel.statusArea.aggregateMenu._indicators;

	    this.enabledIcon = new St.Icon({
	            icon_name: 'notification-disabled-symbolic',
	            style_class: 'popup-menu-icon'
	    });
	},

	/**
	 * Shows the status icon.
	 */
	show(){
		this.indicatorArea.insert_child_at_index(this.enabledIcon, 0);
	},

	/**
	 * Hides the status icon.
	 */
	hide(){
		this.indicatorArea.remove_child(this.enabledIcon);
	},

	/**
	 * Destroys the status icon and removes it from the system status area.
	 */
	destroy(){
		if(this.enabledIcon){
	      this.indicatorArea.remove_child(this.enabledIcon);
	      this.enabledIcon.destroy();
	      this.enabledIcon = 0;
	    }
	},
});