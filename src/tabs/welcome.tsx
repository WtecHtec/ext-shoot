import React, { useState } from 'react';
import useUpdateIcon from '~hooks/useUpdateIcon';
import "~tabs/welcome.css";
import LogoWithUrl from 'react:~asset/logo-with-title.svg';
import PuzzleIcon from 'react:~asset/helper/puzzle.svg';
import PinIcon from 'react:~asset/helper/pin.svg';
import pinVideo from 'url:../asset/helper/pin.mp4';
import { ShootIcon } from '~component/icons';

// 设置 headeing 标签的样式

export default function WelcomeRender() {

	useUpdateIcon();

	const [setupComplete] = useState(false);

	// 修改 head 标签的内容
	document.title = "MotionShot - First Steps";

	return (

		<div className="setupBackground">
			{
				!setupComplete && PinTutior()
			}

			<div className="setupLogo" >
				<LogoWithUrl />
			</div>
		</div>


	);
}

const PinTutior = () => {
	return (
		<div className="setupContainer">
			<div className="setupImage">
				<video src={pinVideo} autoPlay loop muted />
			</div>
			<div className="setupText">
				<div className="setupEmoji">👋</div>
				<div className="setupTitle">
					Get started with MotionShot in three simple steps:
				</div>
				<div className="setupDescription">
					<div className="setupStep">
						1- Find the
						{" "}
						<span>
							<PuzzleIcon className='icon' />
						</span>
						{" "}
						extensions panel
					</div>
					<div className="setupStep">
						2- Press the
						{" "}
						<span>
							<PinIcon className='icon' />
						</span>{" "}
						pin icon
					</div>
					<div className="setupStep">
						3- Click on the
						{" "}
						<span>
							<ShootIcon className='w-2 icon' />
						</span>
						{" "}
						MotionShot to start
					</div>
					<div className="setupStep">
						4- Press shortcut
						{" "}
						<div className='shortcut'>
							<kbd>⌘</kbd>
							<kbd>I</kbd>
						</div>
						{" "}
						to launch qucikly
					</div>
				</div>
			</div>
		</div>
	);
};
