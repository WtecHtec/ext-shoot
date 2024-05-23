import { eventBus } from "./event-bus";


export const initEscControl = () => {
    eventBus.initState({ dialogs: [] }, {
        openSnap: (state) => {
            state.dialogs.push('snap_dialog');
            return state;
        },
        closeSnap: (state) => {
            state.dialogs = state.dialogs.filter((item) => item !== 'snap_dialog');
            return state;
        },
        openSubCommand: (state) => {
            state.dialogs.push('sub_command');
            return state;
        },
        closeSubCommand: (state) => {
            state.dialogs = state.dialogs.filter((item) => item !== 'sub_command');
            return state;
        },
        openSnapCommand: (state) => {
            state.dialogs.push('snap_command');
            return state;
        },
        closeSnapCommand: (state) => {
            state.dialogs = state.dialogs.filter((item) => item !== 'snap_command');
            return state;
        },
        openLauncher: (state) => {
            if (!state.dialogs.includes('launcher')) {
                state.dialogs.push('launcher');
            }
            return state;
        },
        closeLauncher: (state) => {
            state.dialogs = state.dialogs.filter((item) => item !== 'launcher');
            return state;
        },
    });
};


export const exitPanel = () => {
    eventBus.emit('closeLauncher');
};
