
// Define the App state interface
interface AppState {
    inAppMode: boolean;
    activeApp: string;
    registeredApps: string[];
}

// Define the subscriber function type, which accepts a parameter of type AppState
interface AppSubscriber {
    (state: AppState): void;
}

// Define the AppManager class using the Singleton pattern
class AppManager {
    private static instance: AppManager;
    private subscribers: AppSubscriber[] = [];
    public state: AppState;

    // Private constructor to enforce singleton
    private constructor() {
        this.state = new Proxy({
            inAppMode: false,
            activeApp: '',
            registeredApps: []
        }, {
            set: (target, property, value) => {
                target[property] = value;
                this.notify();
                return true;
            }
        });
    }

    // Method to allow components to subscribe to state changes
    public subscribe(callback: AppSubscriber): () => void {
        this.subscribers.push(callback);
        callback(this.state); // Immediately call the callback with the current state
        return () => {
            this.subscribers = this.subscribers.filter(sub => sub !== callback);
        };
    }

    // Notify all subscribers of the state change
    private notify(): void {
        this.subscribers.forEach(callback => callback(this.state));
    }

    // Static method to get the singleton instance
    public static getInstance(): AppManager {
        if (!AppManager.instance) {
            AppManager.instance = new AppManager();
        }
        return AppManager.instance;
    }

    // Method to register a new app
    public registerApp(appName: string): void {
        if (!this.state.registeredApps.includes(appName)) {
            this.state.registeredApps.push(appName);
        }
    }
    
    // Method to start an app
    public startApp(appName: string): void {
        console.log('this.state.registeredApps',this.state.registeredApps);
        if (this.state.registeredApps.includes(appName)) {
            this.state.activeApp = appName;
            this.state.inAppMode = true;
        }
    }

    // Method to exit the current app
    public exitApp(): void {
        this.state.activeApp = '';
        this.state.inAppMode = false;
    }

    public get ifInApp(): boolean {
        return this.state.inAppMode;
    }

    public get activeApp(): string {
        return this.state.activeApp;
    }
}

// Export the singleton instance
export const appManager = AppManager.getInstance();
