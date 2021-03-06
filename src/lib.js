/* From https://github.com/pop-os/gnome-shell-extension-pop-suspend-button */

/* -*- mode: js2; js2-basic-offset: 4; indent-tabs-mode: nil -*- */
/**
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 2 of the License, or
    (at your option) any later version.
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
**/

const GLib = imports.gi.GLib;
const Gettext = imports.gettext;
const Config = imports.misc.config;

function initTranslations(extension) {
  let localeDir = extension.dir.get_child('locale').get_path();

  // Extension installed in .local
  if (GLib.file_test(localeDir, GLib.FileTest.EXISTS)) {
    Gettext.bindtextdomain('gnome-shell-extension-do-not-disturb', localeDir);
  }
  // Extension installed system-wide
  else {
    Gettext.bindtextdomain('gnome-shell-extension-do-not-disturb',
      Config.LOCALEDIR);
  }
}
