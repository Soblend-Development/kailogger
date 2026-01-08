import { KaiLogger } from './Logger';

export class ScopedLogger {
    private parent: KaiLogger;
    private scopeName: string;
    constructor(parent: KaiLogger, scopeName: string) {
        this.parent = parent;
        this.scopeName = scopeName;
    }
    private prefix(message: string): string {
        return `[${this.scopeName}] ${message}`;
    }
    success(message: string, ...args: any[]) {
        this.parent.success(this.prefix(message), ...args);
    }
    error(message: string | Error, ...args: any[]) {
        if (message instanceof Error) {
            this.parent.error(message);
        } else {
            this.parent.error(this.prefix(message), ...args);
        }
    }
    warning(message: string, ...args: any[]) {
        this.parent.warning(this.prefix(message), ...args);
    }
    info(message: string, ...args: any[]) {
        this.parent.info(this.prefix(message), ...args);
    }
    debug(message: string, ...args: any[]) {
        this.parent.debug(this.prefix(message), ...args);
    }
    log(message: string) {
        this.parent.log(this.prefix(message));
    }
}