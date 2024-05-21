// ScriptInjector.ts

type ScriptLoadOptions = {
    async?: boolean;
    defer?: boolean;
    type?: string;
    onLoad?: () => void;
    onError?: (error: Error) => void;
}

class ScriptInjector {
    private static instances: Map<string, ScriptInjector> = new Map();
    private scriptSrc: string;
    private loaded: boolean = false;

    private constructor(scriptSrc: string) {
        this.scriptSrc = scriptSrc;
    }

    public static getInstance(scriptSrc: string): ScriptInjector {
        if (!ScriptInjector.instances.has(scriptSrc)) {
            ScriptInjector.instances.set(scriptSrc, new ScriptInjector(scriptSrc));
        }
        return ScriptInjector.instances.get(scriptSrc)!;
    }

    public inject(options: ScriptLoadOptions = {}): void {
        if (!this.loaded) {
            const script = document.createElement('script');
            script.type = options.type || 'text/javascript';
            if (options.async) script.async = true;
            if (options.defer) script.defer = true;
            script.src = this.scriptSrc;

            script.onload = () => {
                this.loaded = true;
                if (options.onLoad) options.onLoad();
            };

            script.onerror = () => {
                if (options.onError) options.onError(new Error(`Failed to load script: ${this.scriptSrc}`));
            };

            document.body.appendChild(script);
        } else {
            if (options.onLoad) options.onLoad();  // Trigger onLoad even if the script is already loaded
            console.log('Script already loaded:', this.scriptSrc);
        }
    }
}

export default ScriptInjector;
