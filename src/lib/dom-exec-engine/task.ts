/* eslint-disable no-unused-vars */
/* eslint-disable */
export interface TaskOptions {
  delay?: number;
  continueOnError?: boolean;
  args?: any[];
  retry?: number;
  errorHandler?: (ctx: any, error: any) => Promise<void>;
}

export interface Task {
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
  errorHandler?: (ctx: any, error: any) => Promise<void>;

  /**
   * 构造函数接收一个函数和可选的配置选项，并设置默认值。
   * @param fn 要执行的任务函数。
   * @param options 任务的配置选项。
   */
  protected constructor(fn: (...args: any[]) => Promise<any>, options: TaskOptions = {}) {
    // 显式处理默认参数
    const defaultOptions: TaskOptions = {
      delay: 10,
      continueOnError: false,
      args: []
    };

    const mergedOptions = { ...defaultOptions, ...options };

    this.fn = fn;
    this.delay = mergedOptions.delay!;
    this.args = mergedOptions.args!;
    this.continueOnError = mergedOptions.continueOnError!;
    this.errorHandler = mergedOptions.errorHandler;
  }

  /**
   * execute 方法是一个抽象方法，具体的任务执行逻辑需要在子类中实现。
   * @param ctx 执行任务时的上下文。
   */
  abstract execute(ctx: any): Promise<void>;
}

export class DefaultTask extends BaseTask {
  constructor(fn: (...args: any[]) => Promise<any>, options: TaskOptions = {}) {
    super(fn, options);
  }

  async execute(ctx: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      setTimeout(async () => {
        try {
          const result = await this.fn(ctx, ...this.args);
          console.log('任务执行成功，结果为:', result);
          resolve();
        } catch (err) {
          console.error('任务执行失败，错误信息:', err);
          if (this.errorHandler) {
            await this.errorHandler(ctx, err);
          }
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

export class RetryTask extends BaseTask {
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
          if (this.errorHandler) {
            await this.errorHandler(ctx, err);
          }
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

export class WaitTask extends BaseTask {
  constructor(delay: number) {
    super(async () => {}, { delay });
  }

  async execute(ctx: any): Promise<void> {
    console.log(`等待 ${this.delay} 毫秒后继续执行下一任务`);
    return new Promise<void>((resolve) => {
      setTimeout(resolve, this.delay);
    });
  }
}

export class ConditionalTask extends BaseTask {
  condition: (ctx: any, ...args: any[]) => Promise<boolean>;

  constructor(
    condition: (ctx: any, ...args: any[]) => Promise<boolean>,
    fn: (...args: any[]) => Promise<any>,
    options: TaskOptions = {}
  ) {
    super(fn, options);
    this.condition = condition;
  }

  async execute(ctx: any): Promise<void> {
    console.log('即将执行条件任务:', {
      fn: this.fn,
      delay: this.delay,
      args: this.args
    });
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
          if (this.errorHandler) {
            await this.errorHandler(ctx, err);
          }
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

export class AlwaysTask extends BaseTask {
  constructor(fn: (...args: any[]) => Promise<any>, options: TaskOptions = {}) {
    super(fn, options);
  }

  async execute(ctx: any): Promise<void> {
    console.log('无论成功还是失败，都会执行的任务:', {
      fn: this.fn,
      delay: this.delay,
      args: this.args
    });
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
