/* eslint-disable no-unused-vars */
/* eslint-disable */
import {
  AlwaysTask,
  ConditionalTask,
  DefaultTask,
  RetryTask,
  Task,
  TaskOptions,
  WaitTask
} from '~lib/dom-exec-engine/task';

import { DomFinder } from './dom-finder';

interface ExecutionContext {
  finder: DomFinder;
  [key: string]: any; // 允许包含其他属性
}

export class Job {
  private tasks: Task[];
  private domFinder: DomFinder;
  private errorHandler?: (ctx: ExecutionContext, error: any) => Promise<void>;
  private successHandler?: (ctx: ExecutionContext) => Promise<void>;
  private finishHandler?: (ctx: ExecutionContext) => Promise<void>;
  private ctx: ExecutionContext;

  constructor() {
    this.tasks = [];
    this.domFinder = new DomFinder();
    this.ctx = { finder: this.domFinder }; // 初始化 ctx 对象并包含 finder
  }

  start(fn: (ctx: ExecutionContext, ...args: any[]) => Promise<any>, options: TaskOptions = {}): this {
    return this.addTaskInstance(new DefaultTask(fn, options));
  }

  next(fn: (ctx: ExecutionContext, ...args: any[]) => Promise<any>, options: TaskOptions = {}): this {
    return this.addTaskInstance(new DefaultTask(fn, options));
  }

  pause(delay: number): this {
    return this.addTaskInstance(new WaitTask(delay));
  }

  retry(fn: (ctx: ExecutionContext, ...args: any[]) => Promise<any>, retry: number, options: TaskOptions = {}): this {
    return this.addTaskInstance(new RetryTask(fn, retry, options));
  }

  expect(
    condition: (ctx: ExecutionContext, ...args: any[]) => Promise<boolean>,
    fn: (ctx: ExecutionContext, ...args: any[]) => Promise<any>,
    options: TaskOptions = {}
  ): this {
    return this.addTaskInstance(new ConditionalTask(condition, fn, options));
  }

  parallel(tasks: Array<(ctx: ExecutionContext, ...args: any[]) => Promise<any>>, options: TaskOptions = {}): this {
    const parallelTask = async (ctx: ExecutionContext): Promise<void> => {
      await Promise.all(tasks.map((task) => task(ctx)));
    };
    return this.addTaskInstance(new DefaultTask(parallelTask, options));
  }

  error(fn: (ctx: ExecutionContext, error: any) => Promise<void>): this {
    this.errorHandler = fn;
    return this;
  }

  success(fn: (ctx: ExecutionContext) => Promise<void>): this {
    this.successHandler = fn;
    return this;
  }

  always(fn: (ctx: ExecutionContext, ...args: any[]) => Promise<any>, options: TaskOptions = {}): this {
    return this.addTaskInstance(new AlwaysTask(fn, options));
  }

  finish(fn?: (ctx: ExecutionContext) => Promise<void>): this {
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
    this.ctx = { finder: this.domFinder }; // 重置 ctx 对象但保留 finder
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

  static create(): Job {
    return new Job();
  }
}

export const newJob = () => {
  return new Job();
};
