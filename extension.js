const Me = imports.misc.extensionUtils.getCurrentExtension();
const Settings = Me.imports.settings; 
const Widget = Me.imports.widgets;

/**
 * Called when the extension is loaded.
 */
function init() {

}

/**
 * Enable the do not disturb extension. Adds all UI elements and monitors the settings object.
 */
function enable() {
    this.disturbToggle = new Widget.DoNotDisturbToggle();
    this.disturbToggle.show();

    this.enabledIcon = new Widget.DoNotDisturbIcon();

    this.settings = new Settings.SettingsManager();

    this.disturbToggle.onToggleStateChanged(() => _toggle());

    this.settings.onDoNotDisturbChanged(() => _sync());
    this.settings.onShowIconChanged(() => _sync());

    this._sync();
}

/**
 * Disables the extension. Tears down all UI components.
 */
function disable() {
    this.disturbToggle.destroy();
    this.enabledIcon.destroy();
}

/**
 * Toggle the status of the do not disturb mode in settings.
 */
function _toggle(){
  let status = this.settings.isDoNotDisturb();
  this.settings.setDoNotDisturb(!status); // This will trigger a call to _sync
}

/**
 * Updates the UI based on the settings. Includes switching the toggle state and showing the status icon.
 */
function _sync(){
  let enabled = this.settings.isDoNotDisturb();
  let showIcon = this.settings.shouldShowIcon();
  if(enabled && showIcon){
      this.enabledIcon.hide();
      this.enabledIcon.show();
  } else {
    this.enabledIcon.hide();
  }

  this.disturbToggle.setToggleState(enabled);

}