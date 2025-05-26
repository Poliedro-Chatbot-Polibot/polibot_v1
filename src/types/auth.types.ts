export type User = {
    email: string;
    first_name: string;
    last_name: string;
    pk: number;
}

export interface Auth {
    access: string;
    refresh: string;
    user: User
}


