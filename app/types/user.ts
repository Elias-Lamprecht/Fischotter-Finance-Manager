export interface User {
     id: string;
     username: string;
     email?: string;
     displayname?: string;
     role: 'user' | 'admin';
     status: 'active' | 'disabled';
     created_at: string;
}
