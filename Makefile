# Basic Makefile
# From https://github.com/pop-os/gnome-shell-extension-system76-power

# Retrieve the UUID from ``metadata.json``
UUID = donotdisturb@kylecorry31.github.io

ifeq ($(strip $(DESTDIR)),)
INSTALLBASE = $(HOME)/.local/share/gnome-shell/extensions
else
INSTALLBASE = $(DESTDIR)/usr/share/gnome-shell/extensions
endif
INSTALLNAME = $(UUID)

$(info UUID is "$(UUID)")

.PHONY: all clean install zip-file

all: schemas extension.js settings.js prefs.js metadata.json stylesheet.css
	rm -rf _build
	mkdir -p _build
	cp -r $^ _build

clean:
	rm -rf _build

install: all
	rm -rf $(INSTALLBASE)/$(INSTALLNAME)
	mkdir -p $(INSTALLBASE)/$(INSTALLNAME)
	cp -r _build/* $(INSTALLBASE)/$(INSTALLNAME)/

zip-file: all
	cd _build && zip -qr "../$(UUID)$(VSTRING).zip" .
