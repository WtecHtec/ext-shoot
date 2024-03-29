import componentStyles from 'data-text:~style.all.scss';
import cssText from 'data-text:~style.css';
import type {PlasmoCSConfig} from 'plasmo';
import React, {useEffect, useRef} from 'react';

import {RaycastCMDK} from '~component/cmdk/menu';
import {CMDKWrapper} from '~component/common';
import injectToaster from '~toaster';
import EventBus from '~utils/event-bus';
import { getMutliLevelProperty } from '~utils/util';

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

const eventBus = EventBus.getInstace();

eventBus.initState({ dialogs: [] }, {
  openSnap: (state) => {
    state.dialogs.push('snap_dialog');
    return state;
  },
  closeSnap: (state) => {
    state.dialogs = state.dialogs.filter( (item) => item !== 'snap_dialog');
    return  state;
  },
  openSubCommand: (state) => {
    state.dialogs.push('sub_command');
    return  state;
  },
  closeSubCommand: (state) => {
    state.dialogs = state.dialogs.filter( (item) => item !== 'sub_command');
    return state;
  },
});

const PlasmoOverlay = () => {
    // for dev
    const [open, setOpen] = React.useState(false);
    const focusRef = useRef(null);

    const handelMsgBybg = (request, sender, sendResponse) => {
        const { action } = request;
        if (action === 'active_extention_launcher') {
            setOpen(!open);
        }
        // 发送响应
        sendResponse({ result: 'Message processed in content.js' });
    };
    chrome.runtime.onMessage.addListener(handelMsgBybg);

    React.useEffect(() => {

        // <Toaster/>
        injectToaster();

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
				if (focusRef &&  focusRef.current) {
                    console.log('focusRef---', focusRef);
				}

        return () => {
            document.removeEventListener('keydown', listener);
        };
    }, []);
    useEffect(() => {
        if (open && focusRef.current) {
            focusRef.current.focus();
        }
    }, [open]);
    return (
        <>
            <div
                ref={ focusRef }
                // style={ { display: open ? 'block' : 'none' } }
                className="fixed z-50 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                { open ? (
                    <CMDKWrapper>
                        <RaycastCMDK/>
                    </CMDKWrapper>
                ) : null }
            </div>
        </>
    );
};

export default PlasmoOverlay;
