class MockRemoteAPI {
  constructor(){
    this.listeners = [];
    this.value = false;
  }

  addRemoteListener(listener){
    return this.listeners.push(listener) - 1;
  }

  removeRemoteListener(id){
    if (id < 0 || id >= this.listeners.length){
      return;
    }
    this.listeners.splice(id, 1);
  }

  getRemote(){
    return this.value;
  }

  setRemote(value){
    this.value = value;
    this.listeners.forEach((fn) => fn(value));
  }

}
