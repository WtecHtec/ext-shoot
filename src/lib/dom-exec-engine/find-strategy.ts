export interface FindStrategy {
    find(): JQuery<HTMLElement> | null;
}

export class XPathStrategy implements FindStrategy {
    constructor(private xpath: string) { }

    find(): JQuery<HTMLElement> | null {
        const element = document.evaluate(this.xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
            .singleNodeValue as HTMLElement | null;
        return element ? $(element) : null;
    }
}

export class QuerySelectorStrategy implements FindStrategy {
    constructor(private selector: string) { }

    find(): JQuery<HTMLElement> | null {
        const elements = $(this.selector);
        return elements.length > 0 ? elements : null;
    }
}

export class QuerySelectorWithContentStrategy implements FindStrategy {
    constructor(private selector: string, private content: string) { }

    find(): JQuery<HTMLElement> | null {
        const elements = $(this.selector);
        const matchedElement = elements.filter((_, el) => $(el).text() === this.content);
        return matchedElement.length > 0 ? matchedElement : null;
    }
}
