class MockAudio {
  constructor(){
    this.isMuted = false;
  }

  mute(){
    this.isMuted = true;
  }

  unmute(){
    this.isMuted = false;
  }
}
