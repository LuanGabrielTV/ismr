export class User {
    id: string;
    displayName: string;
    username: string;
    password: string;
    datetime: Date | null;

    constructor(id?: string, displayName?: string, username?: string, password?: string, datetime?: Date) {
        this.id = String(id || null);
        this.displayName = String(displayName || null);
        this.username = String(username || null);
        this.password = String(password || null);
        this.datetime = datetime || null;
    }
}

