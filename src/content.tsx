import componentStyles from 'data-text:~style.all.scss';
import cssText from 'data-text:~style.css';
import $ from 'jquery';
import type { PlasmoCSConfig } from 'plasmo';
import React, { useEffect, useRef } from 'react';

import { MotionShotCMDK } from '~component/cmdk';
import { eventBus } from '~component/cmdk/panel/event-bus';
import ToasterComponent from '~component/cmdk/toast/toast-ui';
import { topicManager } from '~component/cmdk/topic/topic-manager';
import { CMDKWrapper } from '~component/common';
import { executeExportFeishu, executeUseageTemp, isLoggedInFeishu } from '~extension/feishubase/handle';
import { saveTextToFlomo } from '~extension/flomor/handle';
import { listerSnapSeekData } from '~extension/history-search/content';
import { createJikePost } from '~extension/jiker/api';
import { execSignIn } from '~extension/juejin/executes';
import { searchMetasoKeyword } from '~extension/metaso-quick/handle';
// import SuperInput from '~extension/super-input';
import { SuperInputTest } from '~extension/super-input-test';
import { execV2exSignIn } from '~extension/v2ex/executes';
import { functionManager } from '~lib/function-manager';
import { serialize } from '~lib/motion-serialize';
import { chatgptTopic, feishuTopic, flomoTopic, GoogleSearchTopic, MetasoTopic } from '~topics';
import { duoZhuaYuTopic } from '~topics/shopping';
import { jikeTopic, juejinTopic, V2exTopic } from '~topics/social';
import { handleSetBrowser } from '~utils/actions';
import { getBrowser, getElementXPath, getMutliLevelProperty, isArc } from '~utils/util';

// import FocusLock from 'react-focus-lock';
export const config: PlasmoCSConfig = {
  matches: ['<all_urls>'],
  exclude_matches: ['https://gemini.google.com/*'],
  css: []
};

export const getStyle = () => {
  const style = document.createElement('style');
  style.textContent = cssText + componentStyles;
  return style;
};

functionManager.registerFunction('saveTextToFlomo', saveTextToFlomo);
functionManager.registerFunction('createJikePost', createJikePost);
functionManager.registerFunction('isLoggedInFeishu', isLoggedInFeishu);
functionManager.registerFunction('executeUseageTemp', executeUseageTemp);
functionManager.registerFunction('executeExportFeishu', executeExportFeishu);
functionManager.registerFunction('execSignIn', execSignIn);
functionManager.registerFunction('execV2exSignIn', execV2exSignIn);
functionManager.registerFunction('searchKeywordInMetaso', searchMetasoKeyword);

topicManager.registerTopics([
  jikeTopic,
  flomoTopic,
  feishuTopic,
  chatgptTopic,
  duoZhuaYuTopic,
  juejinTopic,
  V2exTopic,
  GoogleSearchTopic,
  MetasoTopic
]);
topicManager.checkAndActivateTopics();

setTimeout(() => {
  // 先检测是否是arc环境
  const isArcEnv = isArc();
  // 如果是 就设置为arc,return
  // console.log('isArcEnv', isArcEnv);
  if (isArcEnv) {
    handleSetBrowser('arc');
    return;
  }

  // 如果不是arc环境，就从navigator.userAgent中获取浏览器类型
  const detectFromNavigator = getBrowser();
  handleSetBrowser(detectFromNavigator);
}, 3000);

listerSnapSeekData();

const PlasmoOverlay = () => {
  // for dev
  const [open, setOpen] = React.useState(false);
  const focusRef = useRef(null);

  /** 设置上一次 active_input xptah */
  const setActiveInputElXpath = () => {
    try {
      const activeEl = $(document.activeElement);
      if (!activeEl || (!activeEl.is('input') && !activeEl.is('textarea'))) {
        window.sessionStorage.setItem('active_input_xpath', '');
        return;
      }
      const xpath = getElementXPath(document.activeElement);
      window.sessionStorage.setItem('active_input_xpath', xpath);
    } catch (error) {
      console.error('active_input_xpath set value  err:', error);
    }
  };

  const handelMsgBybg = (request, sender, sendResponse) => {
    const { action } = request;
    if (action === 'active_extention_launcher') {
      setActiveInputElXpath();
      setOpen(!open);
      sendResponse({ result: 'Message processed in content.js' });
    }
  };
  chrome.runtime.onMessage.addListener(handelMsgBybg);

  React.useEffect(() => {
    const updateLauncherState = () => {
      const state = eventBus.getState();
      setOpen(state.dialogs.includes('launcher'));
    };

    // 监听可能影响 dialogs 数组的事件
    eventBus.on('openLauncher', updateLauncherState);
    eventBus.on('closeLauncher', updateLauncherState);

    return () => {
      eventBus.off('openLauncher', updateLauncherState);
      eventBus.off('closeLauncher', updateLauncherState);
    };
  }, []);

  React.useEffect(() => {
    function listener(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        const state = eventBus.getState();
        console.log('state---', state);
        if (getMutliLevelProperty(state, 'dialogs', []).length === 0) {
          setOpen(false);
        } else {
          eventBus.emit('close');
        }
      }
    }

    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  }, []);

  useEffect(() => {
    const fetchSerializedData = async () => {
      const serialized = await serialize(<SuperInputTest />);
      console.log('21321', 21321);
      console.log('serialized', serialized);
    };

    fetchSerializedData();
  }, []);

  useEffect(() => {
    if (open && focusRef.current) {
      focusRef.current.focus();
    }
  }, [open]);
  return (
    <>
      <div
        ref={focusRef}
        // style={ { display: open ? 'block' : 'none' } }
        className="fixed z-50 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
        {open ? (
          <CMDKWrapper>
            <MotionShotCMDK />
          </CMDKWrapper>
        ) : null}
        <ToasterComponent />
      </div>
    </>
  );
};

export default PlasmoOverlay;
