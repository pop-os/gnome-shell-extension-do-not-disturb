imports.searchPath.push('src');
imports.searchPath.push('test');

const MockPresence = imports.MockPresence.MockPresence;
const DoNotDisturb = imports.doNotDisturb.DoNotDisturb;

function BooleanSetter(){
  this.value = false;

  this.setValue = function(v){
    this.value = v;
  }.bind(this);

  this.getValue = function(){
    return this.value;
  }.bind(this);
}

function testSuite() {

	describe('DoNotDisturbMode', function() {
		it('should enable and disable', function() {
      var presence = new MockPresence();
      var dnd = new DoNotDisturb(presence);

      dnd.enable();
      expect(dnd.isEnabled()).toEqual(true);
      expect(presence.status).toEqual(presence.BUSY);

      dnd.disable();
      expect(dnd.isEnabled()).toEqual(false);
      expect(presence.status).toEqual(presence.AVAILABLE);
		});

    it('should keep listeners up to date', function() {
      var presence = new MockPresence();
      var dnd = new DoNotDisturb(presence);
      var listener = new BooleanSetter();

      var id = dnd.addStatusListener(listener.setValue);
      dnd.enable();
      expect(listener.getValue()).toEqual(true);

      dnd.disable();
      expect(listener.getValue()).toEqual(false);

      dnd.removeStatusListener(id);
      dnd.enable();
      expect(listener.getValue()).toEqual(false);
		});
	});

}
