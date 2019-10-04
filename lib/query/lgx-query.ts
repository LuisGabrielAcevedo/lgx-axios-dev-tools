import { LgxPagination } from "../pagination/lgx-pagination";
import { LgxFilter } from "../filter/lgx-filter";
import { LgxOption } from "../option/lgx-option";
import { LgxSort } from "../sort/lgx-sort";
import { LgxQueryParam } from "./lgx-query-param";
import { LgxUrl } from "../url/lgx-url";
import { ILgxQueryConfig } from "../interfaces/lgx-query-config";

export class LgxQuery {
  protected resource: string;
  protected pagination!: LgxPagination;
  protected include: string[];
  protected filters: LgxFilter[];
  protected andFilters: LgxFilter[];
  protected orFilters: LgxFilter[];
  protected options: LgxOption[];
  protected sort: LgxSort[];
  protected url: LgxUrl | null;
  protected noPagination: boolean;
  protected queryConfig: ILgxQueryConfig;

  constructor(resource: string, queryConfig: ILgxQueryConfig) {
    this.queryConfig = queryConfig || {};
    this.resource = resource;
    this.include = [];
    this.filters = [];
    this.andFilters = [];
    this.orFilters = [];
    this.options = [];
    this.sort = [];
    this.url = null;
    this.noPagination = false;
  }

  public addFilter = (filter: LgxFilter): void => {
    this.filters.push(filter);
  };

  public addAndFilter = (filter: LgxFilter): void => {
    this.andFilters.push(filter);
  };

  public addOrFilter = (filter: LgxFilter): void => {
    this.orFilters.push(filter);
  };

  public addSort(sort: LgxSort): void {
    this.sort.push(sort);
  }

  public addInclude(includeSpec: string): void {
    this.include.push(includeSpec);
  }

  public addOption(option: LgxOption): void {
    this.options.push(option);
  }

  public setUrl(url: LgxUrl): void {
    this.url = url;
  }

  public setNoPagination(value: boolean): void {
    this.noPagination = value;
  }

  public setLgxPagination(LgxPagination: LgxPagination): void {
    this.pagination = LgxPagination;
  }

  public getLgxPagination(): LgxPagination {
    return this.pagination;
  }

  protected addFilterParameters(searchParams: LgxQueryParam[]): void {
    for (const f of this.filters) {
      searchParams.push(
        new LgxQueryParam(`filter[${f.getAttribute()}]`, f.getValue())
      );
    }
  }

  protected addAndFilterParameters(searchParams: LgxQueryParam[]): void {
    for (const f of this.andFilters) {
      searchParams.push(new LgxQueryParam(f.getAttribute(), f.getValue()));
    }
  }

  protected addOrFilterParameters(searchParams: LgxQueryParam[]): void {
    for (const f of this.orFilters) {
      searchParams.push(
        new LgxQueryParam(`q[${f.getAttribute()}]`, f.getValue())
      );
    }
  }

  protected addSortParameters(searchParams: LgxQueryParam[]): void {
    if (this.sort.length > 0) {
      let p = "";
      for (const LgxSort of this.sort) {
        if (p) {
          p += ",";
        }
        if (!LgxSort.getPositiveDirection()) {
          p += "-";
        }
        p += LgxSort.getAttribute();
      }
      searchParams.push(
        new LgxQueryParam(this.queryConfig["orderBy"] || "orderBy", p)
      );
    }
  }

  protected addIncludeParameters(searchParams: LgxQueryParam[]): void {
    if (this.include.length > 0) {
      let p = "";
      for (const incl of this.include) {
        if (p !== "") {
          p += ",";
        }
        p += incl;
      }
      searchParams.push(
        new LgxQueryParam(this.queryConfig["with"] || "with", p)
      );
    }
  }

  protected addOptionsParameters(searchParams: LgxQueryParam[]): void {
    for (const option of this.options) {
      searchParams.push(
        new LgxQueryParam(option.getParameter(), option.getValue())
      );
    }
  }

  protected addPaginationParameters(searchParams: LgxQueryParam[]): void {
    if (this.noPagination) {
      searchParams.push(new LgxQueryParam("no_pagination", true));
    } else {
      if (this.pagination.page) {
        for (const param of this.pagination.getPaginationParameters(
          this.queryConfig
        )) {
          searchParams.push(param);
        }
      }
    }
  }

  protected formatUrl(id?: string | number): string {
    let url = "";
    if (this.url) {
      url =
        this.url.getAction() === "force"
          ? this.url.getUrl()
          : `${this.resource || url}${id ? "/" + id : ""}/${this.url.getUrl()}`;
    } else {
      url = this.resource || url;
      if (id) url += `/${id}`;
    }
    return url;
  }

  public toString(id?: string | number): string {
    let url: string = this.formatUrl(id);

    const searchParams: LgxQueryParam[] = [];
    this.addFilterParameters(searchParams);
    this.addOrFilterParameters(searchParams);
    this.addAndFilterParameters(searchParams);
    this.addSortParameters(searchParams);
    this.addIncludeParameters(searchParams);
    this.addOptionsParameters(searchParams);
    this.addPaginationParameters(searchParams);

    let paramString = "";

    for (const searchParam of searchParams) {
      paramString += !paramString ? "?" : "&";
      paramString +=
        encodeURIComponent(searchParam.name) +
        "=" +
        encodeURIComponent(searchParam.value);
    }
    return url + paramString;
  }
}
