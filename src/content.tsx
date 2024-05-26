import componentStyles from 'data-text:~style.all.scss';
import cssText from 'data-text:~style.css';
import type { PlasmoCSConfig } from 'plasmo';
import React, { useEffect, useRef } from 'react';

import { MotionShotCMDK } from '~component/cmdk';
import { CMDKWrapper } from '~component/common';
import { eventBus } from '~component/cmdk/panel/event-bus';
import { getBrowser, getMutliLevelProperty, isArc } from '~utils/util';
import { handleSetBrowser } from '~utils/actions';
import { listerSnapSeekData } from '~extension/history-search/content';
import ToasterComponent from '~component/cmdk/toast/toast-ui';
import { functionManager } from '~lib/function-manager';
import { saveTextToFlomo } from '~extension/flomor/handle';
import { createJikePost } from '~extension/jiker/api';
import { isLoggedInFeishu, executeUseageTemp, executeExportFeishu } from '~extension/feishubase/handle';
import { topicManager } from '~component/cmdk/topic/topic-manager';
import { jikeTopic } from '~topics/social';
import { chatgptTopic, feishuTopic, flomoTopic } from '~topics';

// import FocusLock from 'react-focus-lock';
export const config: PlasmoCSConfig = {
    matches: ['<all_urls>'],
    exclude_matches: ['https://gemini.google.com/*'],
    css: [],
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

topicManager.registerTopics([jikeTopic, flomoTopic, feishuTopic, chatgptTopic]);
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
    console.log('detectFromNavigator', detectFromNavigator);
    handleSetBrowser(detectFromNavigator);

}, 3000);


listerSnapSeekData();

const PlasmoOverlay = () => {
    // for dev
    const [open, setOpen] = React.useState(false);
    const focusRef = useRef(null);

    const handelMsgBybg = (request, sender, sendResponse) => {
        const { action } = request;
        if (action === 'active_extention_launcher') {
            setOpen(!open);
            sendResponse({ result: 'Message processed in content.js' });
        }
        // 发送响应
        // 不要污染全局反馈
    };
    chrome.runtime.onMessage.addListener(handelMsgBybg);

    React.useEffect(() => {
        // 初始化组件或功能

        const updateLauncherState = () => {
            const state = eventBus.getState();
            console.log('state', state);
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
        // <Escape> to close
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