export type ServerResponse<T = undefined> = {
  success: boolean;
  message: string;
  status: number;
  data?: T;
  error?: string;
};
