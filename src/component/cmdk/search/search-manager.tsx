import React from 'react';

// Define the interface of the search state
interface SearchState {
    search: string;
    inputRef: React.RefObject<HTMLInputElement>;
    placeholder: string;
    inApp: boolean;
}

// Define the interface of the subscriber function type, which accepts a parameter of type SearchState
interface SearchSubscriber {
    (data: SearchState): void;
}

// Define the SearchManager class
class SearchManager {
    private static instance: SearchManager;
    private subscribers: SearchSubscriber[] = [];
    public state: SearchState;
    public inputRef: React.RefObject<HTMLInputElement> = React.createRef();


    // Use a private constructor to ensure compliance with the singleton pattern
    private constructor() {
        this.state = new Proxy({
            search: "",
            placeholder: "Search...",
            inApp: false,
            inputRef: this.inputRef
        }, {
            set: (target, property, value) => {
                target[property] = value;
                this.notify();
                return true;
            }
        });
    }


    // Allow external functions to join the search change processing through subscription
    public subscribe(callback: SearchSubscriber): () => void {
        this.subscribers.push(callback);
        // Call the callback immediately with the current state to ensure that the initialization state is handled correctly
        callback(this.state);
        // Return a function to cancel the subscription later
        return () => {
            this.subscribers = this.subscribers.filter(sub => sub !== callback);
        };
    }

    // Notify all subscribers of the latest state
    private notify(): void {
        this.subscribers.forEach(callback => callback(this.state));
    }
    // Provide a static method to get an instance of the class
    public static getInstance(): SearchManager {
        if (!SearchManager.instance) {
            SearchManager.instance = new SearchManager();
        }
        return SearchManager.instance;
    }


    // Set the search content and notify the subscribers
    public setSearch(search: string): void {
        this.state.search = search;
    }

    // Set the placeholder and notify the subscribers
    public setPlaceholder(placeholder: string): void {
        this.state.placeholder = placeholder;
    }

    // Set whether to search in the app and notify the subscribers
    public setInApp(inApp: boolean): void {
        this.state.inApp = inApp;
        this.notify();
    }

    // Start the app mode
    public loadApp(): void {
        this.setInApp(true);
    }

    // Exit the app mode
    public exitApp(): void {
        this.setInApp(false);
    }

    // Get the current search content
    public get content(): string {
        return this.state.search;
    }

    // Set the search content
    public set content(search: string) {
        this.state.search = search;
    }

    public clearSearch(): void {
        this.state.search = '';
    }
    // Get the current placeholder
    public get placeholderText(): string {
        return this.state.placeholder;
    }

    // Get whether to search in the app
    public get ifInApp(): boolean {
        return this.state.inApp;
    }

}

// Create a globally available instance
export const searchManager = SearchManager.getInstance();
