import React from 'react';
import { StateManager } from '../core/manager.core';

// Define the interface of the search state
interface SearchState {
    search: string;
    inputRef: React.RefObject<HTMLInputElement>;
    placeholder: string;
    inApp: boolean;
}

class SearchManager extends StateManager<SearchState> {
    public inputRef: React.RefObject<HTMLInputElement> = React.createRef();
    private static instance: SearchManager | null = null;

    private constructor() {
        super({
            search: "",
            placeholder: "Search...",
            inApp: false,
            inputRef: React.createRef()
        });
    }

    public static getInstance(): SearchManager {
        if (!SearchManager.instance) {
            SearchManager.instance = new SearchManager();
        }
        return SearchManager.instance;
    }

    // 设置搜索内容并通知订阅者
    public setSearch(search: string): void {
        this.state.search = search;
    }

    // 设置占位符并通知订阅者
    public setPlaceholder(placeholder: string): void {
        this.state.placeholder = placeholder;
    }

    // 设置是否在应用程序内搜索并通知订阅者
    public setInApp(inApp: boolean): void {
        this.state.inApp = inApp;
    }

    // 清除搜索内容
    public clearSearch(): void {
        this.state.search = '';
    }

    // 获取当前搜索内容
    public get content(): string {
        return this.state.search;
    }

    // 设置搜索内容
    public set content(search: string) {
        this.setSearch(search);
    }

    // 获取当前占位符
    public get placeholderText(): string {
        return this.state.placeholder;
    }

    // 获取是否在应用程序内搜索
    public get ifInApp(): boolean {
        return this.state.inApp;
    }

}

export const searchManager = SearchManager.getInstance();