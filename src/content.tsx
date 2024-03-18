import componentStyles from 'data-text:~style.all.scss';
import cssText from 'data-text:~style.css';
import type { PlasmoCSConfig } from 'plasmo';
import React, { useEffect, useRef } from 'react';

import { RaycastCMDK } from '~component/cmdk/menu';
import { CMDKWrapper } from '~component/common';
import injectToaster from "~toaster";




export const config: PlasmoCSConfig = {
	matches: ['<all_urls>'],
	exclude_matches: ['https://gemini.google.com/*'],
};

export const getStyle = () => {
	const style = document.createElement('style');
	style.textContent = cssText + componentStyles;
	return style;
};

const PlasmoOverlay = () => {
	// for dev
	const [open, setOpen] = React.useState(true);
	const focusRef = useRef(null);

	React.useEffect(() => {

		// <Toaster/>
		injectToaster();
		function listener(e: KeyboardEvent) {
			if (e.key === "Escape") {
			  e.preventDefault()
			  setOpen(false)
			}
			// 改为 cmd + / 打开
			if (e.key === '/' && e.metaKey) {
				e.preventDefault();
				setOpen((o) => !o);
			}
		}

		document.addEventListener('keydown', listener);

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
        ref={focusRef}
        // style={ { display: open ? 'block' : 'none' } }
        className="fixed z-50 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
        {open ? (
          <CMDKWrapper>
            <RaycastCMDK />
          </CMDKWrapper>
        ) : null}
      </div>
		</>
	);
};

export default PlasmoOverlay;
