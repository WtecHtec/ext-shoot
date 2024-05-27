export interface StatusMessage {
  type: 'success' | 'error' | 'loading' | 'default' | 'tip';
  message: string;
}
class StatusObserver {
  private subscribers: Array<(status: StatusMessage) => void> = [];
  private currentStatus: StatusMessage = { type: 'default', message: 'Ready' };
  private timeoutId: NodeJS.Timeout | null = null; // 用于跟踪当前的计时器

  public subscribe(callback: (status: StatusMessage) => void): () => void {
    this.subscribers.push(callback);
    callback(this.currentStatus); // 立即调用回调以显示当前状态
    return () => (this.subscribers = this.subscribers.filter((sub) => sub !== callback));
  }

  private notify(statusData: StatusMessage, duration?: number): void {
    this.currentStatus = statusData;
    this.subscribers.forEach((callback) => callback(this.currentStatus));
    if (this.timeoutId) {
      clearTimeout(this.timeoutId); // 清除之前的计时器
      this.timeoutId = null;
    }
    if (duration !== undefined && statusData.type !== 'default' && statusData.type !== 'tip') {
      this.timeoutId = setTimeout(() => {
        this.notify({ type: 'default', message: '' });
        this.timeoutId = null;
      }, duration);
    }
  }

  public success(message: string, duration?: number): void {
    this.notify({ type: 'success', message }, duration);
  }

  public error(message: string, duration?: number): void {
    this.notify({ type: 'error', message }, duration);
  }

  public loading(message: string, duration?: number): void {
    this.notify({ type: 'loading', message }, duration);
  }

  public tip(message: string, duration?: number): void {
    this.notify({ type: 'tip', message }, duration);
  }

  public updateStatus(type: 'success' | 'error' | 'loading' | 'tip', message: string, duration?: number): void {
    this.notify({ type, message }, duration);
  }
}

export const statusManager = new StatusObserver();
