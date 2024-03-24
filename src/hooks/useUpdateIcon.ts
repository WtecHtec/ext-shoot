import React from "react";
import { getIcon, getBase64FromIconUrl } from "~utils/util";
import { setExtendedInfo, setStorageByIcon } from "~utils/local.storage";
export default function useUpdateIcon() {
	const [status, setStatus] = React.useState(false);
	React.useEffect(() => {

		chrome.management.getAll().then(async (extensions) => {
			const cacheDatas = {};
			for (let i = 0; i < extensions.length; i++) {
				const { id, icons } = extensions[i];
				const icon = getIcon(icons);
				try {
					const base64 = await getBase64FromIconUrl(icon);
					cacheDatas[id] = base64;
				} catch (error) {
					console.error('useUpdateIcon---->', error);
				}
				setExtendedInfo(id, 'loadedicon', 1);
			}
			await setStorageByIcon(cacheDatas);
			setStatus(true);
		});
	}, []);
	return [status];
}