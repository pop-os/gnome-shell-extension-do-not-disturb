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
    this._disturbToggle = new Widget.DoNotDisturbToggle();
    this._disturbToggle.show();

    this._enabledIcon = new Widget.DoNotDisturbIcon();

    this._settings = new Settings.SettingsManager();

    this._disturbToggle.onToggleStateChanged(() => _toggle());

    this._settings.onDoNotDisturbChanged(() => _sync());
    this._settings.onShowIconChanged(() => _sync());

    this._sync();
}

/**
 * Disables the extension. Tears down all UI components.
 */
function disable() {
    this._disturbToggle.destroy();
    this._enabledIcon.destroy();
}

/**
 * Toggle the status of the do not disturb mode in _settings.
 */
function _toggle(){
  let status = this._settings.isDoNotDisturb();
  this._settings.setDoNotDisturb(!status); // This will trigger a call to _sync
}

/**
 * Updates the UI based on the _settings. Includes switching the toggle state and showing the status icon.
 */
function _sync(){
  let enabled = this._settings.isDoNotDisturb();
  let showIcon = this._settings.shouldShowIcon();
  if(enabled && showIcon){
      this._enabledIcon.hide();
      this._enabledIcon.show();
  } else {
    this._enabledIcon.hide();
  }

  this._disturbToggle.setToggleState(enabled);

}