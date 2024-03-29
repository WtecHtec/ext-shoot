import { Toaster } from 'sonner/dist';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';

function injectToaster() {
    let div = document.getElementById("bjf-toaster");
    if (div == null) {
        div = document.createElement('div');
        div.id = "bjf-toaster";
        document.body.appendChild(div);
    }
    const root = createRoot(div);
    root.render(createElement(Toaster, { richColors: true, position: 'bottom-center' }));
}

export default injectToaster;
