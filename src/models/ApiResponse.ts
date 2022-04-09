export type ApiResponse<T = unknown> = {
  user_id: string;
  app_id: string;
  data: T;
  created_at: string;
  updated_at: string;
};
