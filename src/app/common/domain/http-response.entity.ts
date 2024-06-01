export interface HttpResponseEntity<T = Record<string, unknown>> {
  message: string;
  data?: T;
}
