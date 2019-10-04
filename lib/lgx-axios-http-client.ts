import { AxiosInstance } from "axios";
import axios from "axios";
import { LgxHttpClient } from "./interfaces/lgx-http-client";
import { ILgxHttpClientPromise } from "./interfaces/lgx-http-client-promise";
import { LgxAxiosHttpClientPromise } from "./axios/lgx-axios-http-client-promise";

export class AxiosHttpClient implements LgxHttpClient {
  private axiosInstance: AxiosInstance;
  constructor(axiosInstance?: AxiosInstance) {
    if (!axiosInstance) axiosInstance = axios.create();
    this.axiosInstance = axiosInstance;
  }

  public setBaseUrl(baseUrl: string): void {
    this.axiosInstance.defaults.baseURL = baseUrl;
  }

  public setHeader(name: string, value: string): void {
    this.axiosInstance.defaults.headers[name] = value;
  }

  public get(url: string): ILgxHttpClientPromise {
    return new LgxAxiosHttpClientPromise(this.axiosInstance.get(url));
  }

  public delete(url: string): ILgxHttpClientPromise {
    return new LgxAxiosHttpClientPromise(this.axiosInstance.delete(url));
  }

  public head(url: string): ILgxHttpClientPromise {
    return new LgxAxiosHttpClientPromise(this.axiosInstance.head(url));
  }

  public post(url: string, data?: any): ILgxHttpClientPromise {
    return new LgxAxiosHttpClientPromise(this.axiosInstance.post(url, data));
  }

  public put(url: string, data?: any): ILgxHttpClientPromise {
    return new LgxAxiosHttpClientPromise(this.axiosInstance.put(url, data));
  }

  public patch(url: string, data?: any): ILgxHttpClientPromise {
    return new LgxAxiosHttpClientPromise(this.axiosInstance.patch(url, data));
  }

  public getInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}
