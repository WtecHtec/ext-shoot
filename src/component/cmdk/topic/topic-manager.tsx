// topicManager.ts
import { StateManager } from '../core/manager.core';
import { Topic } from './topic';

interface TopicState {
    topics: Topic[];
    activeTopics: Topic[];
}

class TopicManager extends StateManager<TopicState> {
    private static instance: TopicManager | null = null;

    private constructor() {
        super({
            topics: [],
            activeTopics: []
        });
    }

    public static getInstance(): TopicManager {
        if (!TopicManager.instance) {
            TopicManager.instance = new TopicManager();
        }
        return TopicManager.instance;
    }

    // 添加新的 topic
    public addTopic(topic: Topic): void {
        this.state.topics.push(topic);
    }

    // alias
    public registerTopics(topics: Topic[]): void {
        topics.forEach(topic => this.addTopic(topic));
    }
    // 通用的激活 topic 方法
    private activateTopic(condition: (topic: Topic) => boolean): void {
        const activatedTopics = this.state.topics.filter(condition);
        activatedTopics.forEach(topic => {
            if (!this.state.activeTopics.includes(topic)) {
                this.state.activeTopics.push(topic);
            }
        });
    }

    // 根据域名触发 topic 激活状态
    private activateByDomain(domain: string): void {
        this.activateTopic(topic =>
            topic.conditions.some(condition => condition.type === 'domain' && condition.value === domain)
        );
    }

    // 根据状态触发 topic 激活状态
    private activateByState(state: string): void {
        this.activateTopic(topic =>
            topic.conditions.some(condition => condition.type === 'state' && condition.value === state)
        );
    }


    // 检测并激活符合条件的 topics
    public checkAndActivateTopics(): void {
        const currentDomain = window.location.hostname;
        this.activateByDomain(currentDomain);
    }

    // 获取当前激活的 topics
    public get activeTopicsList(): Topic[] {
        return this.state.activeTopics;
    }

    // 取消激活特定 topic
    public deactivateTopic(topicName: string): void {
        this.state.activeTopics = this.state.activeTopics.filter(topic => topic.name !== topicName);
    }

    public clearActiveTopics(): void {
        this.state.activeTopics = [];
    }

    public ifHasTopicActive(): boolean {
        return this.state.activeTopics.length > 0;
    }

    public get activeTopics(): Topic[] {
        return this.state.activeTopics;
    }
}

// 实例化并导出 TopicManager
export const topicManager = TopicManager.getInstance();
