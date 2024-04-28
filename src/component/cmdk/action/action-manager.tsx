import React from "react";

import { StateManager } from "../core/manager.core";

// Define the Action state interface
interface ActionState {
  title: string
  placeholder: string
  actionPanel: React.ComponentType<any>
}

class ActionManager extends StateManager<ActionState> {
  private static instance: ActionManager | null = null;

  private constructor() {
    super({
      title: "action",
      placeholder: "Search for action...",
      actionPanel: () => <div />
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

  // Optionally, add a method to change the action panel if required
  public updateActionPanel(newActionPanel: React.ComponentType<any>): void {
    this.state.actionPanel = newActionPanel;
  }

  public get title() {
    return this.state.title;
  }

  public get placeholder() {
    return this.state.placeholder;
  }
}

// Export the singleton instance
export const actionManager = ActionManager.getInstance();
