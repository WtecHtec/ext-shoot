/* eslint-disable no-unused-vars */
/* eslint-disable */
import { DomFinder } from './dom-finder';

interface TaskOptions {
    delay?: number;
    continueOnError?: boolean;
    args?: any[];
    retry?: number;
}

interface Task {
    fn: (...args: any[]) => Promise<any>;
    delay: number;
    args: any[];
    continueOnError: boolean;
    execute: (ctx: any) => Promise<void>;
}

abstract class BaseTask implements Task {
    fn: (...args: any[]) => Promise<any>;
    delay: number;
    args: any[];
    continueOnError: boolean;

    protected constructor(fn: (...args: any[]) => Promise<any>, options: TaskOptions = {}) {
        this.fn = fn;
        this.delay = options.delay ?? 300;
        this.args = options.args ?? [];
        this.continueOnError = options.continueOnError ?? false;
    }

    abstract execute(ctx: any): Promise<void>;
}

class DefaultTask extends BaseTask {
    constructor(fn: (...args: any[]) => Promise<any>, options: TaskOptions = {}) {
        super(fn, options);
    }

    async execute(ctx: any): Promise<void> {
        console.log('即将执行任务:', { fn: this.fn, delay: this.delay, args: this.args });
        return new Promise<void>((resolve, reject) => {
            setTimeout(async () => {
                try {
                    const result = await this.fn(ctx, ...this.args);
                    console.log('任务执行成功，结果为:', result);
                    resolve();
                } catch (err) {
                    console.error('任务执行失败，错误信息:', err);
                    if (this.continueOnError) {
                        resolve();
                    } else {
                        reject(err);
                    }
                }
            }, this.delay);
        });
    }
}

class RetryTask extends BaseTask {
    retry: number;

    constructor(fn: (...args: any[]) => Promise<any>, retry: number, options: TaskOptions = {}) {
        super(fn, options);
        this.retry = retry;
    }

    async execute(ctx: any): Promise<void> {
        const executeWithRetry = async (attemptsLeft: number): Promise<any> => {
            try {
                const result = await this.fn(ctx, ...this.args);
                console.log('任务执行成功，结果为:', result);
                return result;
            } catch (err) {
                console.error('任务执行失败，错误信息:', err);
                if (attemptsLeft > 0) {
                    console.log(`重试剩余次数: ${attemptsLeft - 1}`);
                    return executeWithRetry(attemptsLeft - 1);
                } else {
                    throw err;
                }
            }
        };

        return new Promise<void>((resolve, reject) => {
            setTimeout(async () => {
                try {
                    await executeWithRetry(this.retry);
                    resolve();
                } catch (err) {
                    if (this.continueOnError) {
                        resolve();
                    } else {
                        reject(err);
                    }
                }
            }, this.delay);
        });
    }
}

class WaitTask extends BaseTask {
    constructor(delay: number) {
        super(async () => { }, { delay });
    }

    async execute(ctx: any): Promise<void> {
        console.log(`等待 ${this.delay} 毫秒后继续执行下一任务`);
        return new Promise<void>(resolve => {
            setTimeout(resolve, this.delay);
        });
    }
}

class ConditionalTask extends BaseTask {
    condition: (ctx: any, ...args: any[]) => Promise<boolean>;

    constructor(condition: (ctx: any, ...args: any[]) => Promise<boolean>, fn: (...args: any[]) => Promise<any>, options: TaskOptions = {}) {
        super(fn, options);
        this.condition = condition;
    }

    async execute(ctx: any): Promise<void> {
        console.log('即将执行条件任务:', { fn: this.fn, delay: this.delay, args: this.args });
        return new Promise<void>((resolve, reject) => {
            setTimeout(async () => {
                try {
                    const proceed = await this.condition(ctx, ...this.args);
                    if (proceed) {
                        const result = await this.fn(ctx, ...this.args);
                        console.log('条件任务执行成功，结果为:', result);
                        resolve();
                    } else {
                        console.log('条件未满足，跳过执行');
                        resolve();
                    }
                } catch (err) {
                    console.error('条件任务执行失败，错误信息:', err);
                    if (this.continueOnError) {
                        resolve();
                    } else {
                        reject(err);
                    }
                }
            }, this.delay);
        });
    }
}

class AlwaysTask extends BaseTask {
    constructor(fn: (...args: any[]) => Promise<any>, options: TaskOptions = {}) {
        super(fn, options);
    }

    async execute(ctx: any): Promise<void> {
        console.log('无论成功还是失败，都会执行的任务:', { fn: this.fn, delay: this.delay, args: this.args });
        return new Promise<void>((resolve) => {
            setTimeout(async () => {
                try {
                    await this.fn(ctx, ...this.args);
                } catch (err) {
                    console.error('always任务执行失败:', err);
                } finally {
                    resolve();
                }
            }, this.delay);
        });
    }
}

export class Job {
    private tasks: Task[];
    private domFinder: DomFinder;
    private errorHandler?: (ctx: any, error: any) => Promise<void>;
    private successHandler?: (ctx: any) => Promise<void>;
    private finishHandler?: (ctx: any) => Promise<void>;
    private ctx: any;

    constructor() {
        this.tasks = [];
        this.domFinder = new DomFinder();
        this.ctx = {};  // 初始化 ctx 对象
    }

    start(fn: (...args: any[]) => Promise<any>, options: TaskOptions = {}): this {
        return this.addTaskInstance(new DefaultTask(fn, options));
    }

    next(fn: (...args: any[]) => Promise<any>, options: TaskOptions = {}): this {
        return this.addTaskInstance(new DefaultTask(fn, options));
    }

    pause(delay: number): this {
        return this.addTaskInstance(new WaitTask(delay));
    }

    retry(fn: (...args: any[]) => Promise<any>, retry: number, options: TaskOptions = {}): this {
        return this.addTaskInstance(new RetryTask(fn, retry, options));
    }

    expect(condition: (ctx: any, ...args: any[]) => Promise<boolean>, fn: (...args: any[]) => Promise<any>, options: TaskOptions = {}): this {
        return this.addTaskInstance(new ConditionalTask(condition, fn, options));
    }

    parallel(tasks: Array<(...args: any[]) => Promise<any>>, options: TaskOptions = {}): this {
        const parallelTask = async (ctx: any): Promise<void> => {
            await Promise.all(tasks.map(task => task(ctx)));
        };
        return this.addTaskInstance(new DefaultTask(parallelTask, options));
    }

    error(fn: (ctx: any, error: any) => Promise<void>): this {
        this.errorHandler = fn;
        return this;
    }

    success(fn: (ctx: any) => Promise<void>): this {
        this.successHandler = fn;
        return this;
    }

    always(fn: (...args: any[]) => Promise<any>, options: TaskOptions = {}): this {
        return this.addTaskInstance(new AlwaysTask(fn, options));
    }

    finish(fn?: (ctx: any) => Promise<void>): this {
        if (fn) {
            this.finishHandler = fn;
        }
        return this;
    }

    private addTaskInstance(task: Task): this {
        this.tasks.push(task);
        return this;
    }

    private cleanup(): void {
        this.tasks = [];
        this.ctx = {};  // 重置 ctx 对象
        console.log('清理任务完成，释放资源');
    }

    private async runTask(): Promise<void> {
        if (this.tasks.length === 0) {
            if (this.successHandler) {
                await this.successHandler(this.ctx);
            }
            if (this.finishHandler) {
                await this.finishHandler(this.ctx);
            }
            this.cleanup();
            return;
        }

        const currentTask = this.tasks.shift()!;
        try {
            await currentTask.execute(this.ctx);
            await this.runTask();
        } catch (err) {
            console.error('任务执行失败，错误信息:', err);
            if (this.errorHandler) {
                await this.errorHandler(this.ctx, err);
            }
        }
    }

    do(): Promise<void> {
        return this.runTask();
    }

    get finder(): DomFinder {
        return this.domFinder;
    }
}

