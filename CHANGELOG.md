# Changelog - Do not disturb extension

## v2.0.5 - April 3, 2019

**Bug Fixes:**
- Do not disable DND when the screen goes blank

**Other Changes:**
- Added support for testing, which should make this more robust to changes

## v2.0.4 - March 30, 2019

**Bug Fixes:**
- Fixed errors removing the icon

## v2.0.3 - January 31, 2019

**Changed:**
- Minor reorganizing

## v2.0.2 - January 27, 2019

**Bug Fixes:**
- Do not disturb stays enabled after suspend

## v2.0.1 - December 24, 2018

**Bug Fixes:**
- Notification count now reflects all notifications, even from the same source

## v2.0.0 - December 21, 2018

**Added:**
- Notification count or notification dot display

**Changed:**
- Switched to Gnome Session Presence rather than show notification banners for DND
- Default notification dot no longer shows up

## v1.2.1 - December 7, 2018

**Bug Fixes:**
- Error dialog no longer shows up on settings page

## v1.2.0 - October 18, 2018

**Added:**
- gsettings API to set DND from the terminal

**Bug Fixes:**
- Disabling DND with the mute sounds setting on will unmute the sound

## v1.1.1 - October 15, 2018

**Added:**
- Support for localization on prefs page (no translations yet)

**Bug Fixes:**
- Icon now falls back to an pre-packaged version if the icon set does not support the default icon.

## v1.1.0 - October 15, 2018

**Added:**
- Support for localization
  - English, French, Spanish, and Portuguese

**Bug Fixes:**
- Disconnect all listeners when disabled
- Adjust margin on clear button

## v1.0.0 - April 16, 2018

Initial release.

**Added:**
- Do not disturb mode
  - Add toggle to notification pane
  - Block notification banners
  - Setting to mute sound
  - Setting to hide notification dot
