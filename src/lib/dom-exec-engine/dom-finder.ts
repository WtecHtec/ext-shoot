// import $ from 'jquery';

import { FindStrategy, QuerySelectorStrategy, QuerySelectorWithContentStrategy, XPathStrategy } from "./find-strategy";

interface FindDomOptions {
    delay?: number;
    maxAttempts?: number;
}

export class DomFinder {
    async getDomByXPath(
        xpath: string,
        options: FindDomOptions = { delay: 300, maxAttempts: 10 }
    ): Promise<JQuery<HTMLElement> | null> {
        return this.getDom(new XPathStrategy(xpath), options);
    }

    async getDomByQuery(
        selector: string,
        options: FindDomOptions = { delay: 500, maxAttempts: 20 }
    ): Promise<JQuery<HTMLElement> | null> {
        return this.getDom(new QuerySelectorStrategy(selector), options);
    }

    async getDomByQueryWithContent(
        selector: string,
        content: string,
        options: FindDomOptions = { delay: 500, maxAttempts: 20 }
    ): Promise<JQuery<HTMLElement> | null> {
        return this.getDom(new QuerySelectorWithContentStrategy(selector, content), options);
    }

    private async getDom(
        strategy: FindStrategy,
        options: FindDomOptions = { delay: 300, maxAttempts: 10 }
    ): Promise<JQuery<HTMLElement> | null> {
        return this.findDom(strategy, options);
    }

    private findDom(
        strategy: FindStrategy,
        { delay = 300, maxAttempts = 10 }: FindDomOptions
    ): Promise<JQuery<HTMLElement> | null> {
        return new Promise((resolve, reject) => {
            const attempt = (currentAttempt: number) => {
                const element = strategy.find();
                if (element) {
                    resolve(element);
                } else if (currentAttempt < maxAttempts) {
                    setTimeout(() => attempt(currentAttempt + 1), delay);
                } else {
                    reject(new Error('DOM element not found'));
                }
            };
            attempt(0);
        });
    }
}
