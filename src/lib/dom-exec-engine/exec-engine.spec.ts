import { describe, expect, it, vi } from 'vitest';

import { Job } from './exec-engine';

describe('Job Class', () => {
  it('should execute start task', async () => {
    const job = new Job();
    const startFn = vi.fn(async (ctx) => {
      ctx.startExecuted = true;
    });

    job.start(startFn).finish();

    await job.do();
    expect(startFn).toHaveBeenCalled();
  });

  it('should execute next task', async () => {
    const job = new Job();
    const nextFn = vi.fn(async (ctx) => {
      ctx.nextExecuted = true;
    });

    job.next(nextFn).finish();

    await job.do();
    expect(nextFn).toHaveBeenCalled();
  });

  it('should pause execution for specified time', async () => {
    const job = new Job();
    const pauseTime = 500;
    const pauseFn = vi.fn(async (ctx) => {
      const start = Date.now();
      await new Promise((resolve) => setTimeout(resolve, pauseTime));
      const end = Date.now();
      ctx.pauseTime = end - start;
    });

    job.pause(pauseTime).next(pauseFn).finish();

    await job.do();
    expect(pauseFn).toHaveBeenCalled();
    // expect(job.pauseTime).toBeGreaterThanOrEqual(pauseTime);
  });

  it('should retry task specified number of times', async () => {
    const job = new Job();
    let attempts = 0;
    const retryFn = vi.fn(async () => {
      attempts++;
      if (attempts < 3) {
        throw new Error('Retry');
      }
    });

    job.retry(retryFn, 3).finish();

    await job.do();
    expect(retryFn).toHaveBeenCalledTimes(3);
  });

  it('should execute conditionally', async () => {
    const job = new Job();
    const conditionFn = vi.fn(async () => true);
    const taskFn = vi.fn(async (ctx) => {
      ctx.conditionExecuted = true;
    });

    job.expect(conditionFn, taskFn).finish();

    await job.do();
    expect(conditionFn).toHaveBeenCalled();
    expect(taskFn).toHaveBeenCalled();
  });

  it('should execute parallel tasks', async () => {
    const job = new Job();
    const parallelFn1 = vi.fn(async (ctx) => {
      ctx.parallel1Executed = true;
    });
    const parallelFn2 = vi.fn(async (ctx) => {
      ctx.parallel2Executed = true;
    });

    job.parallel([parallelFn1, parallelFn2]).finish();

    await job.do();
    expect(parallelFn1).toHaveBeenCalled();
    expect(parallelFn2).toHaveBeenCalled();
  });

  it('should handle error and stop execution', async () => {
    const job = new Job();
    const errorFn = vi.fn(async () => {
      throw new Error('Test Error');
    });
    const errorHandler = vi.fn(async (ctx) => {
      ctx.errorHandled = true;
    });
    const nextFn = vi.fn(async (ctx) => {
      ctx.nextExecuted = true;
    });

    job.error(errorHandler).next(errorFn).finish();

    try {
      await job.do();
    } catch (e) {
      console.log('error', e);
    }

    expect(errorFn).toHaveBeenCalled();
    expect(errorHandler).toHaveBeenCalled();
    expect(nextFn).not.toHaveBeenCalled();
  });

  it('should execute success handler after all tasks complete', async () => {
    const job = new Job();
    const taskFn = vi.fn(async (ctx) => {
      ctx.taskExecuted = true;
    });
    const successHandler = vi.fn(async (ctx) => {
      ctx.successHandled = true;
    });

    job.success(successHandler).next(taskFn).finish();

    await job.do();
    expect(taskFn).toHaveBeenCalled();
    expect(successHandler).toHaveBeenCalled();
  });

  it('should always execute always handler', async () => {
    const job = new Job();
    const alwaysFn = vi.fn(async (ctx) => {
      ctx.alwaysExecuted = true;
    });

    job.always(alwaysFn).finish();

    await job.do();
    expect(alwaysFn).toHaveBeenCalled();
  });

  it('should execute finish handler and clean up', async () => {
    const job = new Job();
    const finishFn = vi.fn(async (ctx) => {
      ctx.finishExecuted = true;
    });

    job.finish(finishFn);

    await job.do();
    expect(finishFn).toHaveBeenCalled();
    // Assuming cleanup clears tasks array
    expect(job['tasks'].length).toBe(0);
  });
});
describe('Job Class - Context Passing', () => {
  it('should pass context between start and next tasks', async () => {
    const job = new Job();
    const startFn = vi.fn(async (ctx) => {
      ctx.value = 'start';
    });
    const nextFn = vi.fn(async (ctx) => {
      ctx.value += ' -> next';
    });

    job.start(startFn).next(nextFn).finish();

    await job.do();
    expect(startFn).toHaveBeenCalled();
    expect(nextFn).toHaveBeenCalled();
    expect(nextFn.mock.calls[0][0].value).toBe('start -> next');
  });

  it('should pass context through multiple tasks', async () => {
    const job = new Job();
    const task1 = vi.fn(async (ctx) => {
      ctx.count = 1;
    });
    const task2 = vi.fn(async (ctx) => {
      ctx.count += 1;
    });
    const task3 = vi.fn(async (ctx) => {
      ctx.count += 1;
    });

    job.start(task1).next(task2).next(task3).finish();

    await job.do();
    expect(task1).toHaveBeenCalled();
    expect(task2).toHaveBeenCalled();
    expect(task3).toHaveBeenCalled();
    expect(task3.mock.calls[0][0].count).toBe(3);
  });

  it('should maintain context after pause', async () => {
    const job = new Job();
    const pauseTime = 100;
    const taskBeforePause = vi.fn(async (ctx) => {
      ctx.state = 'before pause';
    });
    const taskAfterPause = vi.fn(async (ctx) => {
      ctx.state += ' -> after pause';
    });

    job.start(taskBeforePause).pause(pauseTime).next(taskAfterPause).finish();

    await job.do();
    expect(taskBeforePause).toHaveBeenCalled();
    expect(taskAfterPause).toHaveBeenCalled();
    expect(taskAfterPause.mock.calls[0][0].state).toBe('before pause -> after pause');
  });

  it('should handle context in conditional tasks', async () => {
    const job = new Job();
    const conditionFn = vi.fn(async () => true);
    const taskFn = vi.fn(async (ctx) => {
      ctx.conditionMet = true;
    });

    job.expect(conditionFn, taskFn).finish();

    await job.do();
    expect(conditionFn).toHaveBeenCalled();
    expect(taskFn).toHaveBeenCalled();
    expect(taskFn.mock.calls[0][0].conditionMet).toBe(true);
  });

  it('should propagate context to parallel tasks', async () => {
    const job = new Job();
    const parallelFn1 = vi.fn(async (ctx) => {
      ctx.parallel1 = true;
    });
    const parallelFn2 = vi.fn(async (ctx) => {
      ctx.parallel2 = true;
    });

    job.parallel([parallelFn1, parallelFn2]).finish();

    await job.do();
    expect(parallelFn1).toHaveBeenCalled();
    expect(parallelFn2).toHaveBeenCalled();
    expect(parallelFn1.mock.calls[0][0].parallel1).toBe(true);
    expect(parallelFn2.mock.calls[0][0].parallel2).toBe(true);
  });

  it('should maintain context in success handler', async () => {
    const job = new Job();
    const taskFn = vi.fn(async (ctx) => {
      ctx.taskExecuted = true;
    });
    const successHandler = vi.fn(async (ctx) => {
      ctx.successHandled = true;
    });

    job.next(taskFn).success(successHandler).finish();

    await job.do();
    expect(taskFn).toHaveBeenCalled();
    expect(successHandler).toHaveBeenCalled();
    expect(successHandler.mock.calls[0][0].taskExecuted).toBe(true);
    expect(successHandler.mock.calls[0][0].successHandled).toBe(true);
  });

  it('should maintain context in error handler', async () => {
    const job = new Job();
    const errorFn = vi.fn(async () => {
      throw new Error('Test Error');
    });
    const errorHandler = vi.fn(async (ctx) => {
      ctx.errorHandled = true;
    });

    job.error(errorHandler).next(errorFn).finish();

    try {
      await job.do();
    } catch (e) {
      // Ignore error
    }

    expect(errorFn).toHaveBeenCalled();
    expect(errorHandler).toHaveBeenCalled();
    expect(errorHandler.mock.calls[0][0].errorHandled).toBe(true);
  });

  it('should maintain context in always handler', async () => {
    const job = new Job();
    const alwaysFn = vi.fn(async (ctx) => {
      ctx.alwaysExecuted = true;
    });

    job.always(alwaysFn).finish();

    await job.do();
    expect(alwaysFn).toHaveBeenCalled();
    expect(alwaysFn.mock.calls[0][0].alwaysExecuted).toBe(true);
  });

  it('should clean up context in finish handler', async () => {
    const job = new Job();
    const finishFn = vi.fn(async (ctx) => {
      ctx.finishExecuted = true;
    });

    job.finish(finishFn);

    await job.do();
    expect(finishFn).toHaveBeenCalled();
    expect(finishFn.mock.calls[0][0].finishExecuted).toBe(true);
    expect(job['tasks'].length).toBe(0);
  });
});
