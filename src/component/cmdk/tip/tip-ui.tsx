import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

import { HOME_PAGE } from '~component/cmdk/core/constant';
import { ErrorIcon, LineSpinnerIcon, ShootIcon, SuccessIcon } from '~component/icons';

import { statusManager, StatusMessage } from './tip-manager';

export const footerTip = (type: 'success' | 'error' | 'loading' | 'tip', message: string, duration?: number): void => {
  statusManager.updateStatus(type, message, duration);
};

interface TipProps {
  msg: string;
}

const LoadingTip: React.FC<TipProps> = ({ msg }) => {
  return (
    <div className="flex px-1">
      <LineSpinnerIcon />
      <span className="pl-2 text-[14px] font-[400]">{msg}</span>
    </div>
  );
};

const DefaultTip: React.FC<TipProps> = () => {
  function handleOpenGithub(): void {
    window.open(HOME_PAGE, '_blank');
  }

  return (
    <ShootIcon
      className="hover:bg-[var(--gray4)] hover:rounded-[10%] hover:cursor-pointer ml-1"
      style={{ width: '18px', height: '18px' }}
      onClick={handleOpenGithub}
    />
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
    <div className="flex px-1 ml-1">
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
  tip: Tip // 假设你有一个Tip组件用于处理 'tip' 类型的消息
};

const StatusNotifications: React.FC = () => {
  const [currentStatus, setCurrentStatus] = useState<StatusMessage>({
    type: 'default',
    message: ''
  });

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
          className={`notification ${currentStatus.type}`}>
          <StatusComponent msg={currentStatus.message} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default StatusNotifications;
