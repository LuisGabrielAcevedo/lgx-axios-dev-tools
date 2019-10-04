export interface ILgxThenable<T> {
  then<U>(
    onFulfilled?: (value: T) => U | ILgxThenable<U>,
    onRejected?: (error: any) => U | ILgxThenable<U>
  ): ILgxThenable<U>;
  then<U>(
    onFulfilled?: (value: T) => U | ILgxThenable<U>,
    onRejected?: (error: any) => void
  ): ILgxThenable<U>;
}
