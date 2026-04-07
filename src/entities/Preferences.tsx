export class Preferences {
    default_language: string;
    default_voice: string;
    verbosity: string;
    delivery_frequency: string;

    constructor(default_language?: string, default_voice?: string, verbosity?: string, delivery_frequency?: string) {
        this.default_language = String(default_language || null);
        this.default_voice = String(default_voice || null);
        this.verbosity = String(verbosity || null);
        this.delivery_frequency = String(delivery_frequency || null);
    }
}

