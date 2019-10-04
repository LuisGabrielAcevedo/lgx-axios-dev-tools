import { ILgxHttpClientResponse } from "./lgx-http-client-response";
import { ILgxThenable } from "./lgx-thenable";

export interface ILgxHttpClientPromise {
  then<U>(
    onFulfilled?: (value: ILgxHttpClientResponse) => U | ILgxThenable<U>,
    onRejected?: (error: any) => U | ILgxThenable<U>
  ): Promise<U>;
  then<U>(
    onFulfilled?: (value: ILgxHttpClientResponse) => U | ILgxThenable<U>,
    onRejected?: (error: any) => void
  ): Promise<U>;
  catch<U>(onRejected?: (error: any) => U | ILgxThenable<U>): Promise<U>;
}
