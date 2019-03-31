imports.searchPath.push('src');
imports.searchPath.push('test');

const MockPresence = imports.MockPresence.MockPresence;
const DoNotDisturb = imports.doNotDisturb.DoNotDisturb;
const MockNotificationCounter = imports.MockNotificationCounter.MockNotificationCounter;
const MockDNDToggle = imports.MockDNDToggle.MockDNDToggle;
const MockDNDIndicator = imports.MockDNDIndicator.MockDNDIndicator;
const Extension = imports.dndExtension.Extension;

function testSuite() {

	describe('Extension', function() {

    it('should enable and disable do not disturb', function(){
      var notificationCounter = new MockNotificationCounter();
      var dnd = new DoNotDisturb(new MockPresence());
			var toggle = new MockDNDToggle();
			var indicator = new MockDNDIndicator();

      var extension = new Extension(dnd, notificationCounter, toggle, indicator);

      extension.enable();
      expect(dnd.isEnabled()).toEqual(true);
      expect(extension.isEnabled()).toEqual(true);

      extension.disable();
      expect(dnd.isEnabled()).toEqual(false);
      expect(extension.isEnabled()).toEqual(false);
    });

    it('should enable when DND enables', function(){
      var notificationCounter = new MockNotificationCounter();
      var dnd = new DoNotDisturb(new MockPresence());
			var toggle = new MockDNDToggle();
			var indicator = new MockDNDIndicator();

			var extension = new Extension(dnd, notificationCounter, toggle, indicator);

      dnd.enable();
      expect(extension.isEnabled()).toEqual(true);

      dnd.disable();
      expect(extension.isEnabled()).toEqual(false);
    });

		it('should be affected by a toggle', function(){
			var notificationCounter = new MockNotificationCounter();
			var dnd = new DoNotDisturb(new MockPresence());
			var toggle = new MockDNDToggle();
			var indicator = new MockDNDIndicator();

			var extension = new Extension(dnd, notificationCounter, toggle, indicator);

			expect(toggle.shown).toEqual(true);

			toggle.setToggleState(true);
			expect(extension.isEnabled()).toEqual(true);

			toggle.setToggleState(false);
			expect(extension.isEnabled()).toEqual(false);
		});

		it('should destory components when destroyed', function(){
			var notificationCounter = new MockNotificationCounter();
			var dnd = new DoNotDisturb(new MockPresence());
			var toggle = new MockDNDToggle();
			var indicator = new MockDNDIndicator();

			var extension = new Extension(dnd, notificationCounter, toggle, indicator);

			extension.enable();

			extension.destroy();
			expect(toggle.shown).toEqual(false);
			expect(indicator.shown).toEqual(false);
			expect(dnd.isEnabled()).toEqual(false);

			toggle.setToggleState(true);
			expect(extension.isEnabled()).toEqual(false);

			dnd.enable();
			expect(toggle.shown).toEqual(false);
			expect(indicator.shown).toEqual(false);
			expect(extension.isEnabled()).toEqual(false);

			notificationCounter.notificationCount = 10;
			expect(indicator.count).toEqual(0);
		});

		it('should reflect the initial state of DND', function(){
			var notificationCounter = new MockNotificationCounter();
			var dnd = new DoNotDisturb(new MockPresence());
			var toggle = new MockDNDToggle();
			var indicator = new MockDNDIndicator();

			dnd.enable();

			var extension = new Extension(dnd, notificationCounter, toggle, indicator);

			expect(toggle.getToggleState()).toEqual(true);
			expect(extension.isEnabled()).toEqual(true);
		});

		it('should show an indicator when on', function(){
			var notificationCounter = new MockNotificationCounter();
			var dnd = new DoNotDisturb(new MockPresence());
			var toggle = new MockDNDToggle();
			var indicator = new MockDNDIndicator();

			var extension = new Extension(dnd, notificationCounter, toggle, indicator);

			expect(indicator.shown).toEqual(false);

			extension.enable();
			expect(indicator.shown).toEqual(true);

			extension.disable();
			expect(indicator.shown).toEqual(false);
		});

		it('should keep notification count indication up to date', function(){
			var notificationCounter = new MockNotificationCounter();
			var dnd = new DoNotDisturb(new MockPresence());
			var toggle = new MockDNDToggle();
			var indicator = new MockDNDIndicator();

			notificationCounter.notificationCount = 1;

			var extension = new Extension(dnd, notificationCounter, toggle, indicator);

			expect(indicator.count).toEqual(1);

			notificationCounter.notificationCount = 10;

			expect(indicator.count).toEqual(10);
		});

	});

}
