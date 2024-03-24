import React from 'react';
import { AC_ICON_UPDATED } from '~config/actions';
import useUpdateIcon from '~hooks/useUpdateIcon';
import "~tabs/update.css";
export default function UpdateRender() {

	const [status] = useUpdateIcon();
	const [updated, setUpdated] = React.useState(false);
	React.useEffect(() => {
		let timer = null;
		if (status) {
			timer = setTimeout(() => {
				setUpdated(true);
				chrome.runtime.sendMessage({ action: AC_ICON_UPDATED }, function (response) {
					// console.log(response);
					window.close();
				});
			}, 1000 * 2);
		}
		return () => {
			timer && clearTimeout(timer);
		};
	}, [status]);

	const UpdateIng = () => (<>
		<div className="spinner"></div>
		<h1 className="message">更新中，请稍候... </h1>
	</>);

	const Updated = () => (<>
		<div className="checkmark" >✔</div>
		<h1 className="message">更新成功</h1>
	</>);

	return (
		<div className="container">
			<div className="loading">
				{
					updated ? <Updated></Updated>
						: <UpdateIng></UpdateIng>
				}
			</div>
		</div>
	);
}
