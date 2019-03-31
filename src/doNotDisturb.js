
const BUSY = 2;
const AVAILABLE = 0;

class DoNotDisturb {

  /**
   * Constructor
   * @param {Presence} presence the interface to the Gnome Presence API
   */
  constructor(presence){
    this.presence = presence;
    this.listeners = [];
    this.presence.addStatusListener(() => {
      this.listeners.forEach((fn) => {
        fn(this.isEnabled());
      });
    });
  }

  /**
   * Enable do not disturb mode
   */
  enable(){
    this.presence.status = BUSY;
  }

  /**
   * Disable do not disturb mode
   */
  disable(){
    this.presence.status = AVAILABLE;
  }

  /**
   * @return {Boolean} true if do not disturb mode is on, otherwise false
   */
  isEnabled(){
    return this.presence.status == BUSY;
  }

  /**
   * Add a status listener for when the do not disturb mode is toggled
   * @param {[Boolean => ()]} listener the listener to add
   * @return {Integer} the ID of the listener
   */
  addStatusListener(listener){
    return this.listeners.push(listener) - 1;
  }

  /**
   * Remove the status listener with the ID
   * @param  {Integer} id the ID of the status listener
   */
  removeStatusListener(id){
    this.listeners.splice(id, 1);
  }
}
