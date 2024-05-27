import { createElement, FC, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner/dist';

// 定义 Props 接口
interface ToasterComponentProps {
  richColors?: boolean;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}

const ToasterComponent: FC<ToasterComponentProps> = ({ richColors = false, position = 'bottom-center' }) => {
  useEffect(() => {
    let div = document.getElementById('bjf-toaster') as HTMLDivElement;
    if (!div) {
      div = document.createElement('div');
      div.id = 'bjf-toaster';
      document.body.appendChild(div);
    }
    const root = createRoot(div);
    root.render(createElement(Toaster, { richColors, position, closeButton: false }));

    // 组件卸载时，进行清理
    return () => {
      setTimeout(() => root.unmount(), 0);
    };
  }, []);

  return null;
};

export default ToasterComponent;
