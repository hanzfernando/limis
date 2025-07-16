export interface ServerResponse<T = null> {
  success: boolean;
  message: string;
  status: number;
  data?: T;
  error?: string;
}
