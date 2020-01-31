# Do Not Disturb Gnome Shell Extension
Enable or disable do not disturb mode.

## Installation

### Dependencies

Required dependencies to build on debian platforms are

```
libglib2.0-bin gjs gettext
```

To install, clone this repo and use make to install

```sh
git clone https://github.com/pop-os/gnome-shell-extension-do-not-disturb
cd gnome-shell-extension-do-not-disturb
make
make install
```

The extension then must be enabled using Gnome Tweak Tool or https://extensions.gnome.org/local/

## Add Translation

Extract translations into messages.pot:

```
cd src
xgettext -k -kN -o messages.pot *.js
```

Create a new locale. For example sv_SE:

```
cp -R locale/fr locale/sv_SE
```

Update the messages in the locale:

```
msgmerge -U locale/sv_SE/LC_MESSAGES/gnome-shell-extension-do-not-disturb.po messages.pot
```

Edit the messages in the locale:

```
xdg-open locale/sv_SE/LC_MESSAGES/gnome-shell-extension-do-not-disturb.po
```
