import {
  FindStrategy,
  FunctionFindStrategy,
  QueryContentFindStrategy,
  QueryFirstFindStrategy,
  XPathFindStrategy
} from './find-strategy';

interface FindDomOptions {
  delay?: number;
  maxAttempts?: number;
}

interface DomResult {
  element: JQuery<HTMLElement> | null;
  toDom(): HTMLElement | null;
}

const DEFAULT_OPTIONS: FindDomOptions = { delay: 10, maxAttempts: 3 };

export class DomFinder {
  async find(strategy: FindStrategy, options: FindDomOptions = DEFAULT_OPTIONS): Promise<DomResult> {
    const element = await this.getDom(strategy, { ...DEFAULT_OPTIONS, ...options });
    return {
      element,
      toDom: () => this.toElement(element)
    };
  }

  async xpath(xpath: string, options: FindDomOptions = DEFAULT_OPTIONS): Promise<DomResult> {
    return this.find(new XPathFindStrategy(xpath), options);
  }

  async query(selector: string, options: FindDomOptions = DEFAULT_OPTIONS): Promise<DomResult> {
    return this.find(new QueryFirstFindStrategy(selector), options);
  }

  async queryWithContent(
    selector: string,
    content: string,
    options: FindDomOptions = DEFAULT_OPTIONS
  ): Promise<DomResult> {
    return this.find(new QueryContentFindStrategy(selector, content), options);
  }

  async withFunc(
    findFunction: () => JQuery<HTMLElement> | null,
    options: FindDomOptions = DEFAULT_OPTIONS
  ): Promise<DomResult> {
    return this.find(new FunctionFindStrategy(findFunction), options);
  }

  private async getDom(strategy: FindStrategy, options: FindDomOptions): Promise<JQuery<HTMLElement> | null> {
    for (let attempt = 0; attempt < options.maxAttempts; attempt++) {
      const element = strategy.find();
      if (element) {
        return element;
      }
      await new Promise((resolve) => setTimeout(resolve, options.delay));
    }
    return null;
  }

  private toElement(element: JQuery<HTMLElement> | null): HTMLElement | null {
    return element?.get(0) || null;
  }
}
