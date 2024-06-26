const MessageFrom = {
    Content: 0,
    Web: 1
};

window.addEventListener('message', function (ev) {
    if (ev.data.from === MessageFrom.Content) {
        const task = ev.data.payload?.task;
        if (task) {
            try {
                const result = eval(task.expression);
                const messageData = {
                    from: MessageFrom.Web,
                    payload: { task: { id: task.id, result: result, success: true } },
                };
                window.postMessage(messageData, '*');
            } catch (error) {
                const messageData = {
                    from: MessageFrom.Web,
                    payload: { task: { id: task.id, error: error.message, success: false } },
                };
                window.postMessage(messageData, '*');
                console.error('Execution error:', error);
            }
        }
    }
});

window.postMessage({ from: MessageFrom.Web, payload: { status: 'ready' } }, '*');
