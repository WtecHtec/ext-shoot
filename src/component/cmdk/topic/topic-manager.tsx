// topicManager.ts
import { StateManager } from '../core/manager.core';
import { Topic } from './topic';

interface TopicState {
  topics: Topic[];
  activeTopics: Topic[];
}

class TopicManager extends StateManager<TopicState> {
  private static instance: TopicManager = new TopicManager();

  private constructor() {
    super({
      topics: [],
      activeTopics: []
    });
  }

  public static getInstance(): TopicManager {
    return TopicManager.instance;
  }

  // 添加新的 topic
  public addTopic(topic: Topic): void {
    this.state.topics.push(topic);
  }

  // alias
  public registerTopics(topics: Topic[]): void {
    topics.forEach((topic) => this.addTopic(topic));
  }

  // 通用的激活 topic 方法
  private activateTopic(condition: (topic: Topic) => boolean): void {
    const activatedTopics = this.state.topics.filter(condition);
    activatedTopics.forEach((topic) => {
      if (!this.state.activeTopics.includes(topic)) {
        this.state.activeTopics.push(topic);
      }
    });
  }

  private matchCondition(condition: { type: string; value: string }, url: URL): boolean {
    const matchers: { [key: string]: () => boolean } = {
      hostContains: () => url.hostname.includes(condition.value),
      hostEquals: () => url.hostname === condition.value,
      hostPrefix: () => url.hostname.startsWith(condition.value),
      hostSuffix: () => url.hostname.endsWith(condition.value),
      originAndPathMatches: () => new RegExp(condition.value).test(`${url.origin}${url.pathname}`),
      pathContains: () => url.pathname.includes(condition.value),
      pathEquals: () => url.pathname === condition.value,
      pathPrefix: () => url.pathname.startsWith(condition.value),
      pathSuffix: () => url.pathname.endsWith(condition.value),
      urlMatches: () => new RegExp(condition.value).test(url.href.split('#')[0]),
      default: () => false
    };

    return (matchers[condition.type] || matchers.default)();
  }

  private activateByDomain(url: URL): void {
    this.activateTopic((topic) => topic.conditions.some((condition) => this.matchCondition(condition, url)));
  }

  // 根据状态触发 topic 激活状态
  private activateByState(state: string): void {
    this.activateTopic((topic) =>
      topic.conditions.some((condition) => condition.type === 'state' && condition.value === state)
    );
  }

  // 检测并激活符合条件的 topics
  public checkAndActivateTopics(): void {
    const currentUrl = new URL(window.location.href);
    this.activateByDomain(currentUrl);
  }

  // 获取当前激活的 topics
  public get activeTopics(): ReadonlyArray<Topic> {
    return this.state.activeTopics;
  }

  // 取消激活特定 topic
  public deactivateTopic(topicName: string): void {
    this.state.activeTopics = this.state.activeTopics.filter((topic) => topic.name !== topicName);
  }

  public clearActiveTopics(): void {
    this.state.activeTopics = [];
  }

  public hasActiveTopic(): boolean {
    return this.state.activeTopics.length > 0;
  }

  public get activeKeywords(): string[] {
    return this.state.activeTopics.map((topic) => topic.keyword).flat();
  }
}

// 实例化并导出 TopicManager
export const topicManager = TopicManager.getInstance();
