import React from 'react';

interface SearchSubscriber {
    (search: string, inputRef: React.RefObject<HTMLInputElement>, placeholder: string): void;
}

class SearchManager {
    private subscribers: SearchSubscriber[] = [];
    private search: string = "";
    private placeholder: string = "Search...";
    public inputRef: React.RefObject<HTMLInputElement> = React.createRef();

    public subscribe(callback: SearchSubscriber): () => void {
        this.subscribers.push(callback);
        // Immediately invoke callback to provide initial state
        callback(this.search, this.inputRef, this.placeholder);
        return () => {
            this.subscribers = this.subscribers.filter(sub => sub !== callback);
        };
    }

    public setSearch(search: string): void {
        this.search = search;
        this.notify();
    }

    public setPlaceholder(placeholder: string): void {
        this.placeholder = placeholder;
        this.notify();
    }

    public get content(): string {
        return this.search;
    }

    public set content(search: string) {
        this.search = search;
        this.notify();
    }

    public get placeholderText(): string {
        return this.placeholder;
    }

    private notify(): void {
        this.subscribers.forEach(callback => callback(this.search, this.inputRef, this.placeholder));
    }
}

// 创建一个全局可用的实例
export const searchManager = new SearchManager();
