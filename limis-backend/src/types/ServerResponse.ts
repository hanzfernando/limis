export interface ServerResponse<T = null> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
