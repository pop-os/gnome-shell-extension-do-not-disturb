# Basic Makefile
# From https://github.com/pop-os/gnome-shell-extension-system76-power

# Retrieve the UUID from ``metadata.json``
UUID = donotdisturb@kylecorry31.github.io
MSGSRC = $(wildcard src/locale/*/*/*.po)

ifeq ($(strip $(DESTDIR)),)
INSTALLBASE = $(HOME)/.local/share/gnome-shell/extensions
else
INSTALLBASE = $(DESTDIR)/usr/share/gnome-shell/extensions
endif
INSTALLNAME = $(UUID)

$(info UUID is "$(UUID)")

.PHONY: all clean install zip-file

all: extension
	rm -rf _build
	mkdir -p _build
	cp -r src/* _build

extension: ./src/schemas/gschemas.compiled $(MSGSRC:.po=.mo)

clean:
	rm -f ./src/schemas/gschemas.compiled
	rm -f ./src/locale/*/*/*.mo
	rm -rf _build

./src/schemas/gschemas.compiled: ./src/schemas/org.gnome.shell.extensions.kylecorry31-do-not-disturb.gschema.xml
	glib-compile-schemas ./src/schemas/

./src/locale/%.mo: ./src/locale/%.po
	msgfmt -c $< -o $@

install: all
	rm -rf $(INSTALLBASE)/$(INSTALLNAME)
	mkdir -p $(INSTALLBASE)/$(INSTALLNAME)
	cp -r _build/* $(INSTALLBASE)/$(INSTALLNAME)/

test: all
	gjs lib/gjsunit.js

zip-file: all
	cd _build && zip -qr "../$(UUID)$(VSTRING).zip" .
