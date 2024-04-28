import { StateManager } from "../core/manager.core";
import React from 'react';

// Define the Action state interface
interface ActionState {
    title: string;
    placeholder: string;
    actionPanel: React.ComponentType<any>;
    actionsMap: Map<string, React.ReactNode>;
}

class ActionManager extends StateManager<ActionState> {

    private static instance: ActionManager | null = null;

    private constructor() {
        super({
            title: 'action',
            placeholder: 'Search for action...',
            actionPanel: () => <div />,
            actionsMap: new Map(),
        });
    }

    public static getInstance(): ActionManager {
        if (!ActionManager.instance) {
            ActionManager.instance = new ActionManager();
        }
        return ActionManager.instance;
    }

    // Method to update the title
    public updateTitle(newTitle: string): void {
        this.state.title = newTitle;
    }

    // Method to update the placeholder
    public updatePlaceholder(newPlaceholder: string): void {
        this.state.placeholder = newPlaceholder;
    }

    // Method to register actions
    public registerAction(id: string, action: React.ReactNode): void {
        console.log('id',id);
        this.state.actionsMap.set(id, action);
    }

    public getAction(id: string): React.ReactNode | undefined {
        return this.state.actionsMap.get(id);
    }

    public logAllActions() {
        console.log(this.state.actionsMap);
    }

    // Optionally, add a method to change the action panel if required
    public updateActionPanel(newActionPanel: React.ComponentType<any>): void {
        this.state.actionPanel = newActionPanel;
    }

    public get title(){
        return this.state.title;
    }

    public get placeholder(){
        return this.state.placeholder;
    }
}

// Export the singleton instance
export const actionManager = ActionManager.getInstance();

