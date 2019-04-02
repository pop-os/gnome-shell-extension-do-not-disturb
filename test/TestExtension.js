imports.searchPath.push('src');
imports.searchPath.push('test');

const MockPresence = imports.MockPresence.MockPresence;
const DoNotDisturb = imports.doNotDisturb.DoNotDisturb;
const MockDNDToggle = imports.MockDNDToggle.MockDNDToggle;
const MockDNDIndicator = imports.MockDNDIndicator.MockDNDIndicator;
const MockRemoteAPI = imports.MockRemoteAPI.MockRemoteAPI;
const MockAudio = imports.MockAudio.MockAudio;
const Extension = imports.dndExtension.Extension;

function testSuite() {

	describe('Extension', function() {

    it('should enable and disable do not disturb', function(){
      var dnd = new DoNotDisturb(new MockPresence());
			var toggle = new MockDNDToggle();
			var indicator = new MockDNDIndicator();
			var remote = new MockRemoteAPI();
			var audio = new MockAudio();

      var extension = new Extension(dnd, toggle, indicator, remote, audio);

      extension.enable();
      expect(dnd.isEnabled()).toEqual(true);
      expect(extension.isEnabled()).toEqual(true);

      extension.disable();
      expect(dnd.isEnabled()).toEqual(false);
      expect(extension.isEnabled()).toEqual(false);
    });

    it('should enable when DND enables', function(){
      var dnd = new DoNotDisturb(new MockPresence());
			var toggle = new MockDNDToggle();
			var indicator = new MockDNDIndicator();
			var remote = new MockRemoteAPI();
			var audio = new MockAudio();

			var extension = new Extension(dnd, toggle, indicator, remote, audio);

      dnd.enable();
      expect(extension.isEnabled()).toEqual(true);

      dnd.disable();
      expect(extension.isEnabled()).toEqual(false);
    });

		it('should be affected by a toggle', function(){
			var dnd = new DoNotDisturb(new MockPresence());
			var toggle = new MockDNDToggle();
			var indicator = new MockDNDIndicator();
			var remote = new MockRemoteAPI();
			var audio = new MockAudio();

			var extension = new Extension(dnd, toggle, indicator, remote, audio);

			expect(toggle.shown).toEqual(true);

			toggle.setToggleState(true);
			expect(extension.isEnabled()).toEqual(true);

			toggle.setToggleState(false);
			expect(extension.isEnabled()).toEqual(false);
		});

		it('should destory components when destroyed', function(){
			var dnd = new DoNotDisturb(new MockPresence());
			var toggle = new MockDNDToggle();
			var indicator = new MockDNDIndicator();
			var remote = new MockRemoteAPI();
			var audio = new MockAudio();

			var extension = new Extension(dnd, toggle, indicator, remote, audio);

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

			remote.setRemote(true);
			expect(extension.isEnabled()).toEqual(false);
		});

		it('should not change remote when destroyed', function(){
			var dnd = new DoNotDisturb(new MockPresence());
			var toggle = new MockDNDToggle();
			var indicator = new MockDNDIndicator();
			var remote = new MockRemoteAPI();
			var audio = new MockAudio();

			var extension = new Extension(dnd, toggle, indicator, remote, audio);
			extension.enable();
			extension.destroy();
			expect(remote.getRemote()).toEqual(true);
		});

		it('should reflect the initial state of the remote', function(){
			var dnd = new DoNotDisturb(new MockPresence());
			var toggle = new MockDNDToggle();
			var indicator = new MockDNDIndicator();
			var remote = new MockRemoteAPI();
			var audio = new MockAudio();

			remote.setRemote(true);

			var extension = new Extension(dnd, toggle, indicator, remote, audio);

			expect(toggle.getToggleState()).toEqual(true);
			expect(extension.isEnabled()).toEqual(true);
		});

		it('should show an indicator when on', function(){
			var dnd = new DoNotDisturb(new MockPresence());
			var toggle = new MockDNDToggle();
			var indicator = new MockDNDIndicator();
			var remote = new MockRemoteAPI();
			var audio = new MockAudio();

			var extension = new Extension(dnd, toggle, indicator, remote, audio);

			expect(indicator.shown).toEqual(false);

			extension.enable();
			expect(indicator.shown).toEqual(true);

			extension.disable();
			expect(indicator.shown).toEqual(false);
		});

		it('should toggle through the remote', function(){
			var dnd = new DoNotDisturb(new MockPresence());
			var toggle = new MockDNDToggle();
			var indicator = new MockDNDIndicator();
			var remote = new MockRemoteAPI();
			var audio = new MockAudio();

			var extension = new Extension(dnd, toggle, indicator, remote, audio);

			remote.setRemote(true);
			expect(extension.isEnabled()).toEqual(true);

			remote.setRemote(false);
			expect(extension.isEnabled()).toEqual(false);
		});

		it('should keep the remote in sync', function(){
			var dnd = new DoNotDisturb(new MockPresence());
			var toggle = new MockDNDToggle();
			var indicator = new MockDNDIndicator();
			var remote = new MockRemoteAPI();
			var audio = new MockAudio();

			var extension = new Extension(dnd, toggle, indicator, remote, audio);

			extension.enable();
			expect(remote.getRemote()).toEqual(true);

			extension.disable();
			expect(remote.getRemote()).toEqual(false);
		});

		it('should mute audio when enabled', function(){
			var dnd = new DoNotDisturb(new MockPresence());
			var toggle = new MockDNDToggle();
			var indicator = new MockDNDIndicator();
			var remote = new MockRemoteAPI();
			var audio = new MockAudio();

			var extension = new Extension(dnd, toggle, indicator, remote, audio);

			extension.enable();
			expect(audio.isMuted).toEqual(true);

			extension.disable();
			expect(audio.isMuted).toEqual(false);
		});

	});

}
