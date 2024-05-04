import { StateManager } from "../core/manager.core";
// Define the App state interface
interface CommandState {
    commands: string[];
    registeredCommandMaps: Map<string, React.ComponentType<any>>;
}


class CommandManager extends StateManager<CommandState> {

    private static instance: CommandManager | null = null;

    private constructor() {
        super({
            commands: [],
            registeredCommandMaps: new Map()
        });
    }

    public static getInstance(): CommandManager {
        if (!CommandManager.instance) {
            CommandManager.instance = new CommandManager();
        }
        return CommandManager.instance;
    }

    // Method to register a new command
    public registerCommand(commandName: string, command: React.ComponentType<any>): void {
        if (!this.state.registeredCommandMaps.has(commandName)) {
            this.state.registeredCommandMaps.set(commandName, command);
            this.state.commands.push(commandName);
        }
    }

    // Method to get a command
    public getCommand(commandName: string): any {
        return this.state.registeredCommandMaps.get(commandName);
    }

    // Method to get all commands
    get allCommands(): Map<string, React.ComponentType<any>> {
        return this.state.registeredCommandMaps;
    }

    get commandNames(): string[] {
        return this.state.commands;
    }

}


const commandManager = CommandManager.getInstance();
export {
    commandManager,
};
