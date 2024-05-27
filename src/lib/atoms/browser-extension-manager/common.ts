/**
 * Open the extension settings page
 * @returns
 */
export const handleOpenExtensionPage = () => {
  const magUrl = `chrome://extensions/`;
  chrome.tabs.create({ url: magUrl });
};

/**
 * Open the extension shortcuts page
 * */
export const handleOpenExtensionShortcutsPage = () => {
  const magUrl = `chrome://extensions/shortcuts`;
  chrome.tabs.create({ url: magUrl });
};

/**
 * Refresh the extension icon
 * @param param0
 */
const handleUpdateExtIcon = () => {
  chrome.tabs.create({
    url: chrome.runtime.getURL('/tabs/update.html'),
    active: false
  });
};

/**
 * Enable all extensions
 * @param param0
 */
const handleEnableAllExtensions = () => {
  chrome.management.getAll().then((extensions) => {
    extensions.forEach((ext) => {
      if (!ext.enabled) {
        if (ext.id === chrome.runtime.id) return;
        chrome.management.setEnabled(ext.id, true);
      }
    });
  });
};

/**
 * Disable all extensions
 * @param param0
 */
const handleDisableAllExtensions = () => {
  chrome.management.getAll().then((extensions) => {
    extensions.forEach((ext) => {
      if (ext.enabled) {
        if (ext.id === chrome.runtime.id) return;
        chrome.management.setEnabled(ext.id, false);
      }
    });
  });
};

export const methods = {
  handleOpenExtensionPage,
  handleOpenExtensionShortcutsPage,
  handleUpdateExtIcon,
  handleEnableAllExtensions,
  handleDisableAllExtensions
};
