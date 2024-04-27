class StateManager<T extends object>{
    protected subscribers: ((state: T) => void)[] = [];
    public state: T;

    constructor(initialState: T) {
        this.state = new Proxy(initialState, {
            set: (target, property, value) => {
                const oldValue = target[property];
                if (oldValue !== value) {
                    target[property] = value;
                    this.notify();
                    return true;
                }
            }
        });
    }

    public subscribe(callback: (state: T) => void): () => void {
        this.subscribers.push(callback);
        callback(this.state);  // Immediately call the callback with the current state
        return () => {
            this.subscribers = this.subscribers.filter(sub => sub !== callback);
        };
    }

    protected notify(): void {
        this.subscribers.forEach(callback => callback(this.state));
    }

}

export {
    StateManager,
};