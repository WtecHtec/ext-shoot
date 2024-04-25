import React, { useEffect, useState } from 'react';
import { ErrorIcon, LineSpinnerIcon, ShootIcon, SuccessIcon } from '~component/icons';
import { GITHUB_URL } from '~utils/constant';
import { AnimatePresence, motion } from 'framer-motion';

interface StatusMessage {
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
        return () => this.subscribers = this.subscribers.filter(sub => sub !== callback);
    }

    private notify(statusData: StatusMessage, duration?: number): void {
        this.currentStatus = statusData;
        this.subscribers.forEach(callback => callback(this.currentStatus));
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

export const footerTip = (type: 'success' | 'error' | 'loading' | 'tip', message: string, duration?: number): void => {
    statusManager.updateStatus(type, message, duration);
};

interface TipProps {
    msg: string;
}

const LoadingTip: React.FC<TipProps> = ({ msg },
) => {
    return (
        <div className="flex px-1">
            <LineSpinnerIcon />
            <span className="pl-2 text-[14px] font-[400]">{msg}</span>
        </div>
    );
};

const DefaultTip: React.FC<TipProps> = () => {
    function handleOpenGithub(): void {
        window.open(GITHUB_URL, '_blank');
    }

    return (
        <ShootIcon
            className="hover:bg-[var(--gray4)] hover:rounded-[10%] hover:cursor-pointer"
						style={{ width: '18px', height: '18px'}}
            onClick={handleOpenGithub} />
    );
};
const SuccessTip: React.FC<TipProps> = ({ msg }) => {
    return (
        <div className="flex px-1">
            <SuccessIcon />
            <span className="pl-2 text-[14px] font-[400]">{msg}</span>
        </div>
    );
};
const ErrorTip: React.FC<TipProps> = ({ msg }) => {
    return (
        <div className="flex px-1">
            <ErrorIcon />
            <span className="pl-2 text-[14px] font-[400]">{msg}</span>
        </div>
    );
};

const Tip: React.FC<TipProps> = ({ msg }) => {
    return (
        <div className="flex px-1">
            <ShootIcon />
            <span className="pl-2 text-[14px] font-[400]">{msg}</span>
        </div>
    );
};
// 假设这些组件已经在其他地方定义
const ComponentMap = {
    default: DefaultTip,
    success: SuccessTip,
    error: ErrorTip,
    loading: LoadingTip,
    tip: Tip, // 假设你有一个Tip组件用于处理 'tip' 类型的消息
};

const StatusNotifications: React.FC = () => {
    const [currentStatus, setCurrentStatus] = useState<StatusMessage>({ type: 'default', message: '' });

    useEffect(() => {
        const unsubscribe = statusManager.subscribe(setCurrentStatus);
        return unsubscribe;
    }, []);

    // useEffect(() => {
    //     console.log(currentStatus);
    // }, [currentStatus]);
    //
    const StatusComponent = ComponentMap[currentStatus.type] || ComponentMap.default;

    return (
        <div className={`status-notifications `}>
            <AnimatePresence>
                <motion.div
                    key={currentStatus.type}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }} // 控制淡入淡出的时间
                    className={`notification ${currentStatus.type}`}
                >
                    <StatusComponent msg={currentStatus.message} />
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default StatusNotifications;
