import toast from '~component/cmdk/toast';

export const testIt = async () => {
  toast('Test it');
};

export function toggleEyeComfortMode() {
  const isDarkMode = document.body.classList.contains('dark-mode');

  if (isDarkMode) {
    document.body.classList.remove('dark-mode');
    document.body.style.filter = '';
    const styleElements = document.head.querySelectorAll('.dark-mode-style');
    styleElements.forEach((elem) => document.head.removeChild(elem));
    toast('切换回亮色模式');
  } else {
    document.body.classList.add('dark-mode');
    document.body.style.filter = 'invert(1) hue-rotate(180deg)';
    const newStyleElement = document.createElement('style');
    newStyleElement.classList.add('dark-mode-style');
    newStyleElement.type = 'text/css';
    newStyleElement.innerHTML = `
      html {
        background-color: #333 !important;
      }
      body img, body video {
        filter: invert(1) hue-rotate(180deg) !important;
      }
    `;
    document.head.appendChild(newStyleElement);
    toast('已切换到护眼模式');
  }
}
