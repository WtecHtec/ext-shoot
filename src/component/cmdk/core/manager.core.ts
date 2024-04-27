import debounce from "lodash.debounce";

type SubscriberConfig<T> = {
    debounce?: number;
    target?: Array<keyof T>;
}

class StateManager<T extends object>{
    // protected subscribers: ((state: T) => void)[] = [];
    protected subscribers: { callback: (state: T) => void, config: SubscriberConfig<T> }[] = [];

    public state: T;

    constructor(initialState: T) {
        this.state = new Proxy(initialState, {
            set: (target, property, value) => {
                const key = property as keyof T; // Type assertion
                const oldValue = target[property];
                if (oldValue !== value) {
                    target[property] = value;
                    this.notify(key);
                    return true;
                }
                return false;
            }
        });
    }

    public subscribe(callback: (state: T) => void, config?: SubscriberConfig<T>): () => void {
        const subscriberConfig = { ...config };
        const subscriber = {
            callback: subscriberConfig.debounce ? debounce(callback, subscriberConfig.debounce) : callback,
            config: subscriberConfig
        };
        this.subscribers.push(subscriber);
        callback(this.state);  // Immediately call the callback with the current state
        return () => {
            this.subscribers = this.subscribers.filter(sub => sub.callback !== callback);
        };
    }

    protected notify(changedProperty: keyof T): void {
        this.subscribers.forEach(({ callback, config }) => {
            if (!config.target || config.target.includes(changedProperty)) {
                callback(this.state);
            }
        });
    }

    private debounce(func: (state: T) => void, wait: number): (state: T) => void {
        let timeout: NodeJS.Timeout | null = null;
        return (state: T) => {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => func(state), wait);
        };
    }

}

export {
    StateManager,

};


// // 订阅 username 和 email 的变化，不使用防抖
// const unsubscribe = uiStateManager.subscribe((state) => {
//     console.log('The username or email has changed:', state.username, state.email);
// }, {
//     target: ['username', 'email']
// });

// // 订阅 isLoggedIn 的变化，并使用 500 毫秒的防抖
// const unsubscribeLogin = uiStateManager.subscribe((state) => {
//     console.log('Login status changed:', state.isLoggedIn);
// }, {
//     debounce: 500,
//     target: ['isLoggedIn']
// });