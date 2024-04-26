import React from 'react';

// 定义搜索状态的接口
interface SearchState {
    search: string;
    inputRef: React.RefObject<HTMLInputElement>;
    placeholder: string;
    inApp: boolean;
}

// 定义订阅者函数类型的接口，它接受一个 SearchState 类型的参数
interface SearchSubscriber {
    (data: SearchState): void;
}

// 定义 SearchManager 类
class SearchManager {
    private static instance: SearchManager;
    private subscribers: SearchSubscriber[] = [];
    private search: string = "";
    private placeholder: string = "Search...";
    private inApp: boolean = false;
    public inputRef: React.RefObject<HTMLInputElement> = React.createRef();

    // 使用私有构造函数确保遵循单例模式
    private constructor() {}

    // 提供一个静态方法获取类的实例
    public static getInstance(): SearchManager {
        if (!SearchManager.instance) {
            SearchManager.instance = new SearchManager();
        }
        return SearchManager.instance;
    }

    // 允许外部通过订阅方式加入处理搜索变化的函数
    public subscribe(callback: SearchSubscriber): () => void {
        this.subscribers.push(callback);
        // 立即使用当前状态调用回调，确保初始化状态被正确处理
        callback(this.getCurrentState());
        // 返回一个函数，用于之后取消订阅
        return () => {
            this.subscribers = this.subscribers.filter(sub => sub !== callback);
        };
    }

    // 设置搜索内容并通知订阅者
    public setSearch(search: string): void {
        this.search = search;
        this.notify();
    }

    // 设置占位符并通知订阅者
    public setPlaceholder(placeholder: string): void {
        this.placeholder = placeholder;
        this.notify();
    }

    // 设置是否在应用内搜索并通知订阅者
    public setInApp(inApp: boolean): void {
        this.inApp = inApp;
        this.notify();
    }

    // 启动应用模式
    public loadApp(): void {
        this.setInApp(true);
    }

    // 退出应用模式
    public exitApp(): void {
        this.setInApp(false);
    }

    // 获取当前搜索内容
    public get content(): string {
        return this.search;
    }

    // 设置搜索内容
    public set content(search: string) {
        this.search = search;
        this.notify();
    }

    // 获取当前占位符
    public get placeholderText(): string {
        return this.placeholder;
    }

    // 获取是否在应用内搜索
    public get ifInApp(): boolean {
        return this.inApp;
    }

    // 从当前状态生成一个对象，用于通知订阅者
    private getCurrentState(): SearchState {
        return { search: this.search, inputRef: this.inputRef, placeholder: this.placeholder, inApp: this.inApp };
    }

    // 通知所有订阅者最新的状态
    private notify(): void {
        const currentState = this.getCurrentState();
        this.subscribers.forEach(callback => callback(currentState));
    }
}

// 创建一个全局可用的实例
export const searchManager = SearchManager.getInstance();
