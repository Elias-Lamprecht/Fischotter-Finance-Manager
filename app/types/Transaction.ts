export interface Transaction {
     id: string;
     owner_id: string;
     account_id: string;
     subscription_id?: string;
     title: string;
     description?: string;
     type: string;
     price: number;
     created_at: Date;
}
