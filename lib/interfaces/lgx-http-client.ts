import { ILgxHttpClientPromise } from "./lgx-http-client-promise";
import { AxiosInstance } from "axios";

export interface LgxHttpClient {
  setBaseUrl(baseUrl: string): void;
  setHeader(name: string, value: string): void;
  get(url: string): ILgxHttpClientPromise;
  delete(url: string): ILgxHttpClientPromise;
  head(url: string): ILgxHttpClientPromise;
  post(url: string, data?: any): ILgxHttpClientPromise;
  put(url: string, data?: any): ILgxHttpClientPromise;
  patch(url: string, data?: any): ILgxHttpClientPromise;
  getInstance(): AxiosInstance;
}
