

class ActionManager {
    private static instance: ActionManager;

    private constructor() {
    }

    static getInstance() {
        if (!ActionManager.instance) {
            ActionManager.instance = new ActionManager();
        }
        return ActionManager.instance;
    }

}

export const actonManager = ActionManager.getInstance();
