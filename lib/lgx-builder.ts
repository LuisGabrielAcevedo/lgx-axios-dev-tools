import { Lgx } from "./interfaces/lgx";
import { Model } from "./lgx-model";
import { LgxQuery } from "./query/lgx-query";
import { LgxFilter } from "./filter/lgx-filter";
import { ELgxSortDirection } from "./enums/lgx-sort-directions";
import { LgxSort } from "./sort/lgx-sort";
import { LgxOption } from "./option/lgx-option";
import { LgxPagination } from "./pagination/lgx-pagination";
import { LgxHttpClient } from "./interfaces/lgx-http-client";
import { LgxUrl } from "./url/lgx-url";
import { LgxHeader } from "./header/lgx-header";
import { ILgxHttpClientResponse } from "./interfaces/lgx-http-client-response";
import { Observable, from } from "rxjs";
import { ILgxModel } from "./interfaces/lgx-model";
import lgxObjectToFormData from "./form-data/lgx-form-data";
import { ELgxUrlAction } from "./enums/lgx-url-actions";

export class Builder implements Lgx {
  protected headers: LgxHeader[];
  protected formDataActive: boolean = false;
  private httpClient: LgxHttpClient;
  private query: LgxQuery;

  constructor(model: typeof Model) {
    this.headers = [];
    const modelInstance: Model = new (<any>model)();
    this.query = new LgxQuery(
      modelInstance.getResource(),
      modelInstance.getQueryConfig()
    );
    this.httpClient = model.getHttpClient();
    this.initLgxPagination();
  }

  public async find(page?: number, perPage?: number): Promise<any> {
    try {
      this.setHeaders();
      if (page) this.query.getLgxPagination().setPage(page);
      if (perPage) this.query.getLgxPagination().setPerPage(perPage);
      const resp: ILgxHttpClientResponse = await this.getHttpClient().get(
        this.query.toString()
      );
      return resp.getData();
    } catch (e) {
      return Promise.reject(e.response.data);
    }
  }

  public findRx(page?: number, perPage?: number): Observable<any> {
    return from(this.find(page, perPage));
  }

  public async findById(id: string | number): Promise<any> {
    try {
      this.setHeaders();
      const resp: ILgxHttpClientResponse = await this.getHttpClient().get(
        this.query.toString(id)
      );
      return resp.getData();
    } catch (e) {
      return Promise.reject(e.response.data);
    }
  }

  public findByIdRx(id: string | number): Observable<any> {
    return from(this.findById(id));
  }

  public async save(model: ILgxModel): Promise<any> {
    try {
      if (this.formDataActive)
        model = lgxObjectToFormData(model, { indices: true });
      this.setHeaders();
      const resp: ILgxHttpClientResponse = await this.getHttpClient().post(
        this.query.toString(),
        model
      );
      return resp.getData();
    } catch (e) {
      return Promise.reject(e.response.data);
    }
  }

  public saveRx(model: ILgxModel): Observable<any> {
    return from(this.save(model));
  }

  public async update(id: string | number, model: ILgxModel): Promise<any> {
    try {
      if (this.formDataActive)
        model = lgxObjectToFormData(model, { indices: true });
      this.setHeaders();
      const resp: ILgxHttpClientResponse = await this.getHttpClient().put(
        this.query.toString(id),
        model
      );
      return resp.getData();
    } catch (e) {
      return Promise.reject(e.response.data);
    }
  }

  public updateRx(id: string | number, model: ILgxModel): Observable<any> {
    return from(this.update(id, model));
  }

  public async destroy(id: string | number): Promise<any> {
    try {
      this.setHeaders();
      const resp: ILgxHttpClientResponse = await this.getHttpClient().delete(
        this.query.toString(id)
      );
      return resp.getData();
    } catch (e) {
      return Promise.reject(e.response.data);
    }
  }

  public destroyRx(id: string | number): Observable<any> {
    return from(this.destroy(id));
  }

  public page(page: number): Builder {
    this.query.getLgxPagination().setPage(page);
    return this;
  }

  public perPage(perPage: number): Builder {
    this.query.getLgxPagination().setPerPage(perPage);
    return this;
  }

  public filter(attribute: string, value: string): Builder {
    this.query.addFilter(new LgxFilter(attribute, value));
    return this;
  }

  public where(attribute: string, value: string): Builder {
    this.query.addAndFilter(new LgxFilter(attribute, value));
    return this;
  }

  public orWhere(
    attribute: string | string[],
    value: string,
    type?: string
  ): Builder {
    let ats = "";
    if (typeof attribute === "string") {
      ats = attribute as string;
      if (type) ats += `_${type}`;
      this.query.addOrFilter(new LgxFilter(ats, value));
    } else if (Array.isArray(attribute)) {
      for (const a of attribute) {
        ats += !ats ? a : `_or_${a}`;
      }
      if (type) ats += `_${type}`;
      this.query.addOrFilter(new LgxFilter(ats, value));
    } else {
      throw new Error(
        "The argument for 'with' must be a string or an array of strings."
      );
    }
    return this;
  }

  public orderBy(attribute: string, direction?: ELgxSortDirection): Builder {
    if (typeof direction === "undefined" || !direction) {
      direction = ELgxSortDirection.ASC;
    } else if (typeof direction === "string") {
      if (direction === "asc") {
        direction = ELgxSortDirection.ASC;
      } else if (direction === "desc") {
        direction = ELgxSortDirection.DESC;
      } else {
        throw new Error(
          "The 'direction' parameter must be string of value 'asc' or 'desc', " +
            "value '" +
            direction +
            "' invalid."
        );
      }
    }
    this.query.addSort(
      new LgxSort(attribute, direction === ELgxSortDirection.ASC)
    );
    return this;
  }

  public with(value: string | string[]): Builder {
    if (typeof value === "string") {
      this.query.addInclude(value);
    } else if (Array.isArray(value)) {
      for (const v of value) {
        this.query.addInclude(v);
      }
    } else {
      throw new Error(
        "The argument for 'with' must be a string or an array of strings."
      );
    }
    return this;
  }

  public option(queryParameter: string, value: string): Builder {
    this.query.addOption(new LgxOption(queryParameter, value));
    return this;
  }

  public url(url: string): Builder {
    this.query.setUrl(new LgxUrl(url, ELgxUrlAction.FORCE));
    return this;
  }

  public urlParam(url: string): Builder {
    this.query.setUrl(new LgxUrl(url));
    return this;
  }

  public header(name: string, value: string): Builder {
    this.headers.push(new LgxHeader(name, value));
    return this;
  }

  public noPagination(): Builder {
    this.query.setNoPagination(true);
    return this;
  }

  private setHeaders(): void {
    this.headers.forEach(header => {
      this.getHttpClient().setHeader(header.getName(), header.getValue());
    });
  }

  public formData(): Builder {
    this.formDataActive = true;
    return this;
  }

  private initLgxPagination(): void {
    this.query.setLgxPagination(new LgxPagination());
  }

  public getHttpClient(): LgxHttpClient {
    return this.httpClient;
  }
}
