import { nanoid } from 'nanoid';

export interface TriggerCondition {
  type:
    | 'hostEquals'
    | 'state'
    | 'hostContains'
    | 'hostEquals'
    | 'hostPrefix'
    | 'hostSuffix'
    | 'originAndPathMatches'
    | 'pathContains'
    | 'pathEquals'
    | 'pathPrefix'
    | 'pathSuffix'
    | 'urlMatches';
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
  language?: 'zh' | 'en';
}

export class Topic {
  id: string;
  name: string;
  appearance: TopicAppearance;
  conditions: TriggerCondition[];
  language?: string;

  constructor({ name, appearance, conditions, language }: TopicConfig) {
    this.id = nanoid();
    this.name = name;
    this.appearance = appearance;
    this.conditions = conditions;
    this.language = language || 'en';
  }

  /**
   * Checks if the topic matches a given condition.
   * @param condition The condition to check.
   * @returns True if the topic matches the condition, false otherwise.
   */
  public matchesCondition(condition: TriggerCondition): boolean {
    return this.conditions.some((c) => c.type === condition.type && c.value === condition.value);
  }

  get keyword(): string {
    return this.name;
  }
}
