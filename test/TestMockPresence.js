imports.searchPath.push('src');
imports.searchPath.push('test');

const MockPresence = imports.MockPresence.MockPresence;

function testSuite() {

	describe('MockPresence', function() {
		it('should set and get status', function() {
      var presence = new MockPresence();
      presence.status = presence.AVAILABLE;
			expect(presence.status).toEqual(presence.AVAILABLE);

      presence.status = presence.BUSY;
			expect(presence.status).toEqual(presence.BUSY);
		});

    it('should keep listeners up to date', function() {
      var presence = new MockPresence();
      var other = new MockPresence();
      var listener = (status) => {
        other.status = status;
      };

      var id = presence.addStatusListener(listener);
      presence.status = presence.BUSY;
      expect(other.status).toEqual(presence.BUSY);

      presence.status = presence.AVAILABLE;
      expect(other.status).toEqual(presence.AVAILABLE);

      presence.removeStatusListener(id);
      presence.status = presence.BUSY;
      expect(other.status).toEqual(presence.AVAILABLE);
    });
	});

}
