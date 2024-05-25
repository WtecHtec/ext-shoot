import { nanoid } from "nanoid";

export interface TriggerCondition {
    type: 'domain' | 'state';
    value: string;
}

export interface TopicAppearance {
    backgroundColor: string;
    textColor?: string;
}

export interface TopicConfig {
    name: string;
    appearance: TopicAppearance;
    conditions: TriggerCondition[];
}

export class Topic {
    id: string;
    name: string;
    appearance: TopicAppearance;
    conditions: TriggerCondition[];

    constructor({ name, appearance, conditions }: TopicConfig) {
        this.id = nanoid();
        this.name = name;
        this.appearance = appearance;
        this.conditions = conditions;
    }

    /**
     * Checks if the topic matches a given condition.
     * @param condition The condition to check.
     * @returns True if the topic matches the condition, false otherwise.
     */
    public matchesCondition(condition: TriggerCondition): boolean {
        return this.conditions.some(c => c.type === condition.type && c.value === condition.value);
    }
}
