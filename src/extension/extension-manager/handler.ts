import {footerTip} from '~component/cmdk/tip/tip-ui';
import extensionManage from '~lib/atoms/browser-extension-manager';

const ExtensionAction = extensionManage.action;
/**
 * 禁用其他插件
 * @returns
 */
export const handleDisableAllExtension = () => {
		ExtensionAction.handleDisableAllExtensions();
};
/**
 * 启用其他插件
 * @returns
 */
export const handleEnableAllExtension = () => {
	ExtensionAction.handleEnableAllExtensions();
};
/**
 * 打开插件设置页面
 * @returns
 */
export const handleOpenExtensionPage = () => {
		ExtensionAction.handleOpenExtensionPage();
};
// 打开插件快捷键页面
export const handleOpenExtensionShortcutsPage = () => {
		ExtensionAction.handleOpenExtensionShortcutsPage();
};
export const HandleIconUpdate = () => {
    footerTip('loading', 'Update Extension Info ...', 5000);
    ExtensionAction.handleUpdateExtIcon();
};
