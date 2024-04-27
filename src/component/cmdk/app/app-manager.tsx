import { StateManager } from "../core/manager.core";

// Define the App state interface
interface AppState {
    inAppMode: boolean;
    activeApp: string;
    registeredApps: string[];
}

class AppManager extends StateManager<AppState> {

    private static instance: AppManager | null = null;

    private constructor() {
        super({
            inAppMode: false,
            activeApp: '',
            registeredApps: []
        });
    }

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
