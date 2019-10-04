import { AxiosResponse } from "axios";
import { ILgxHttpClientResponse } from "../interfaces/lgx-http-client-response";

export class LgxAxiosHttpClientResponse implements ILgxHttpClientResponse {
  private axiosResponse: AxiosResponse;
  constructor(axiosResponse: AxiosResponse) {
    this.axiosResponse = axiosResponse;
  }

  getData(): any {
    return this.axiosResponse.data;
  }
}
