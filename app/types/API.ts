export interface ApiResponse<T = any> {
     state: 'success' | 'error' | 'denied';
     data?: T;
     message?: string;
}
