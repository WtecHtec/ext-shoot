class EventBus {
  static instace: any;
  state: any;
  listener: any;
  reducer: any;
  static getInstace() {
    if (!this.instace) {
      this.instace = new EventBus();
    }
    return this.instace;
  }
  constructor() {
    this.state = {};
    this.listener = {};
    this.reducer = {};
  }
  initState(initState, reducer) {
    this.state = { ...initState };
    this.reducer = { ...reducer };
  }
  on(eventName, fn) {
    if (!eventName || typeof fn !== 'function') return;
    if (this.listener[eventName]) {
      this.listener[eventName].push(fn);
    } else {
      this.listener[eventName] = [fn];
    }
  }
  off(eventName, fn) {
    const fns = this.listener[eventName];
    if (Array.isArray(fns)) {
      this.listener[eventName] = fns.filter((item) => item !== fn);
    }
  }
  emit(eventName, ...arg) {
    const fns = this.listener[eventName];
    if (Array.isArray(fns)) {
      fns.forEach((fn) => {
        fn(this.state, ...arg);
      });
    }
  }
  dispath(eventName, ...arg) {
    if (typeof this.reducer[eventName] === 'function') {
      const nwstate = this.reducer[eventName](this.state, ...arg);
      if (nwstate && typeof nwstate === 'object') {
        this.state = {
          ...this.state,
          ...nwstate
        };
      }
    }
  }
  getState() {
    return this.state;
  }
}

const eventBus = EventBus.getInstace();

export { eventBus };
