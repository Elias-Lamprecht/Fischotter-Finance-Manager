export interface ApiResponse<T = any> {
     state: 'success' | 'error' | 'denied';
     data?: T;
     message?: string;
}

export type PaginationApiResponse<T> =
     | {
            state: 'success';
            data: T;
            pagination: {
                 total: number;
                 page: number;
                 limit: number;
                 lastPage: number;
                 hasNext: boolean;
                 hasPrev: boolean;
            };
       }
     | {
            state: 'denied' | 'error';
            message: string;
       };
