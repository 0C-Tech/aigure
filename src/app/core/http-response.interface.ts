export interface HttpResponseEntity {
  code: number | string;
  success?: boolean;
  message?: string;
  data?: any;
}
