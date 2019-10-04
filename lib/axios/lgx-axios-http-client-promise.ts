import { ILgxHttpClientResponse } from "../interfaces/lgx-http-client-response";
import { AxiosPromise } from "axios";
import { ILgxHttpClientPromise } from "../interfaces/lgx-http-client-promise";
import { LgxAxiosHttpClientResponse } from "./lgx-axios-http-client-response";
import { ILgxThenable } from "../interfaces/lgx-thenable";

export class LgxAxiosHttpClientPromise implements ILgxHttpClientPromise {
  private axiosPromise: AxiosPromise;

  constructor(axiosPromise: AxiosPromise) {
    this.axiosPromise = axiosPromise;
  }

  then<U>(
    onFulfilled?: (value: ILgxHttpClientResponse) => ILgxThenable<U> | U,
    onRejected?: (error: any) => ILgxThenable<U> | U
  ): Promise<U>;
  then<U>(
    onFulfilled?: (value: ILgxHttpClientResponse) => ILgxThenable<U> | U,
    onRejected?: (error: any) => void
  ): Promise<U> {
    const wrappedOnFulfilled =
      onFulfilled !== undefined
        ? (axiosResponse: any) =>
            onFulfilled(new LgxAxiosHttpClientResponse(axiosResponse))
        : undefined;
    return <Promise<U>>this.axiosPromise.then(wrappedOnFulfilled, onRejected);
  }

  catch<U>(onRejected?: (error: any) => ILgxThenable<U> | U): Promise<U> {
    return <Promise<U>>this.axiosPromise.catch(onRejected);
  }
}
