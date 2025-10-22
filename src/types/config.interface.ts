export interface ConfigProps {
  port: number;
  option: string[];
  api: string;
  token_secret: string;
  control_token_secret: string;
  admin_token_secret: string;
  time_token: number;
  time_live_cancel_order: number;
  time_live_order: number;
  time_live_mail: number;
}
