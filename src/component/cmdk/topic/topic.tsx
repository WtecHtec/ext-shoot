import { nanoid } from "nanoid";

// topic.ts
export interface TriggerCondition {
    type: 'domain' | 'state';
    value: string;
}

export class Topic {
    name: string;
    color: string;
    textColor?: string;
    conditions: TriggerCondition[];
    id: string;

    constructor(name: string, color: string, textColor: string, conditions: TriggerCondition[]) {
        this.id = nanoid();
        this.name = name;
        this.color = color;
        this.textColor = textColor;
        this.conditions = conditions;
    }
}
