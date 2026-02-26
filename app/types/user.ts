export interface User {
     id: string;
     username: string;
     email?: string;
     displayname?: string;
     role: 'user' | 'admin';
     status: boolean;
     created_at: string;
}
