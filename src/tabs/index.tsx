import React from 'react';
import "~style.all.scss"
import "~style.css"
import { doCloseCrxWin } from '~utils/bg.util';
import { RaycastCMDK } from "~component/cmdk/menu"
import { updateWinSize } from '~utils/management';
import "~tabs/index.css"
import useThrottle from '~hooks/useThrottle';

function resizeWindowToContent(isInit = false) {
  // 获取内容的宽度和高度
  const contentWidth = document.documentElement.scrollWidth;
  const contentHeight = isInit ? document.documentElement.scrollHeight : document.body.scrollHeight;

  // 计算窗口的外部尺寸（包括边框、滚动条等）
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  // 计算调整后的窗口大小
  const newWindowWidth = window.outerWidth + (contentWidth - windowWidth);
  const newWindowHeight = window.outerHeight + (contentHeight - windowHeight);

  return [newWindowWidth, newWindowHeight]
}
export default function Index() {
  
  const timeRef = React.useRef({ timer: null, active: true})

  const observerListener = useThrottle(() =>{
    const [width, height] = resizeWindowToContent()
    updateWinSize(width, height)
  }, 100)

  React.useEffect(() => {
    const [width, height] = resizeWindowToContent(true)
    updateWinSize(width, height + 40, true)
    
    function listener(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault()
        doCloseCrxWin()
      }
      // 改为 cmd + / 打开
      if (e.key === "/" && e.metaKey) {
        e.preventDefault()
        doCloseCrxWin()
      }
    }

    function resizeListener(e) {
      if (timeRef.current.active === true) {
        timeRef.current.active = false
        return
      }
      if (timeRef.current.timer) {
        clearTimeout(timeRef.current.timer)
      }
      timeRef.current.timer = setTimeout(() => {
        const [width, height] = resizeWindowToContent()
        updateWinSize(width, height)
        timeRef.current.active = true
      }, 200)
    }

    const observer = new MutationObserver(observerListener);
    // 配置观察选项
    const observerConfig = {
      attributes: false,
      childList: true,
      subtree: true,
    };
    // 开始观察目标元素
    observer.observe(document.body, observerConfig);

    document.addEventListener("keydown", listener);
    window.addEventListener('resize', resizeListener );
    return () => {
      document.removeEventListener("keydown", listener);
      window.removeEventListener('resize', resizeListener);
      timeRef.current.timer && clearTimeout(timeRef.current.timer);
      observer && observer.disconnect();
    }
  }, [])

  return (
      <div>
        <RaycastCMDK />
      </div>
  );
}